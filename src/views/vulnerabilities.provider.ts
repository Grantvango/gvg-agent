import * as vscode from 'vscode';
import { ScanResult, Vulnerability } from '../types/vulnerabilities';

export class VulnerabilityTreeDataProvider implements vscode.TreeDataProvider<VulnerabilityTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<
		VulnerabilityTreeItem | undefined | null | void
	> = new vscode.EventEmitter<
		VulnerabilityTreeItem | undefined | null | void
	>();
	readonly onDidChangeTreeData: vscode.Event<
		VulnerabilityTreeItem | undefined | null | void
	> = this._onDidChangeTreeData.event;

	private scanResults: Map<string, ScanResult> = new Map();
	private ignoredVulnerabilities: Set<string> = new Set();

	constructor() {}

	refresh(scanResult: ScanResult): void {
		this.scanResults.set(scanResult.scanId, scanResult);
		this._onDidChangeTreeData.fire();
	}

	addScanResult(scanResult: ScanResult): void {
		this.scanResults.set(scanResult.scanId, scanResult);
		this._onDidChangeTreeData.fire();
	}

	ignoreVulnerability(vulnId: string): void {
		this.ignoredVulnerabilities.add(vulnId);
		this._onDidChangeTreeData.fire();
	}

	removeIgnoredVulnerability(vulnId: string): void {
		this.ignoredVulnerabilities.delete(vulnId);
		this._onDidChangeTreeData.fire();
	}

	getAllVulnerabilities(): Vulnerability[] {
		const allVulns: Vulnerability[] = [];
		for (const result of this.scanResults.values()) {
			allVulns.push(...result.vulnerabilities);
		}
		return allVulns;
	}

	getVulnerability(vulnId: string): Vulnerability | undefined {
		for (const result of this.scanResults.values()) {
			const vuln = result.vulnerabilities.find((v) => v.id === vulnId);
			if (vuln) {
				return vuln;
			}
		}
		return undefined;
	}

	getTreeItem(element: VulnerabilityTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(
		element?: VulnerabilityTreeItem,
	): Thenable<VulnerabilityTreeItem[]> {
		if (!element) {
			// Root level - show scanner categories
			const scanners = new Map<string, ScanResult[]>();
			for (const result of this.scanResults.values()) {
				if (!scanners.has(result.scanner)) {
					scanners.set(result.scanner, []);
				}
				scanners.get(result.scanner)!.push(result);
			}

			if (scanners.size === 0) {
				return Promise.resolve([
					new VulnerabilityTreeItem(
						'No scans performed',
						vscode.TreeItemCollapsibleState.None,
					),
				]);
			}

			const items: VulnerabilityTreeItem[] = [];
			for (const [scanner, results] of scanners) {
				const icon = this.getScannerIcon(scanner);
				const vulnCount = results.reduce(
					(sum, r) => sum + r.vulnerabilities.length,
					0,
				);
				items.push(
					new VulnerabilityTreeItem(
						`${scanner.toUpperCase()} (${vulnCount} vulns)`,
						vscode.TreeItemCollapsibleState.Expanded,
						`scanner-${scanner}`,
						icon,
					),
				);
			}

			return Promise.resolve(items);
		}

		// If it's a scanner category, show vulnerabilities grouped by severity
		if (element.id?.startsWith('scanner-')) {
			const scanner = element.id.replace('scanner-', '');
			const results = Array.from(this.scanResults.values()).filter(
				(r) => r.scanner === scanner,
			);
			const vulns = results
				.flatMap((r) => r.vulnerabilities)
				.filter((v) => !this.ignoredVulnerabilities.has(v.id));

			const severityLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
			const items: VulnerabilityTreeItem[] = [];

			for (const severity of severityLevels) {
				const count = vulns.filter((v) => v.severity === severity).length;
				if (count > 0) {
					items.push(
						new VulnerabilityTreeItem(
							`${severity} (${count})`,
							vscode.TreeItemCollapsibleState.Collapsed,
							`severity-${severity}`,
							this.getSeverityIcon(severity as any),
						),
					);
				}
			}

			return Promise.resolve(items);
		}

		// If it's a severity group, show individual vulnerabilities
		if (element.id?.startsWith('severity-')) {
			const severity = element.label?.split(' ')[0];
			const results = Array.from(this.scanResults.values());
			const vulns = results
				.flatMap((r) => r.vulnerabilities)
				.filter(
					(v) =>
						v.severity === severity && !this.ignoredVulnerabilities.has(v.id),
				);

			const items: VulnerabilityTreeItem[] = vulns.map(
				(vuln) =>
					new VulnerabilityTreeItem(
						`[${vuln.scanner.toUpperCase()}] ${vuln.title}`,
						vscode.TreeItemCollapsibleState.None,
						vuln.id,
						this.getSeverityIcon(vuln.severity),
						vuln,
					),
			);

			return Promise.resolve(items);
		}

		return Promise.resolve([]);
	}

	private getSeverityIcon(severity: string): string {
		switch (severity) {
			case 'CRITICAL':
				return '🔴';
			case 'HIGH':
				return '🟠';
			case 'MEDIUM':
				return '🟡';
			case 'LOW':
				return '🟢';
			default:
				return '⚪';
		}
	}

	private getScannerIcon(scanner: string): string {
		switch (scanner) {
			case 'veracode':
				return '🔍';
			case 'snyk':
				return '🐍';
			case 'wiz':
				return '📦';
			default:
				return '🛡';
		}
	}
}

export class VulnerabilityTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly id?: string,
		public readonly icon?: string,
		public readonly vulnerability?: Vulnerability,
	) {
		super(label, collapsibleState);

		if (icon) {
			this.label = `${icon} ${label}`;
		}

		if (vulnerability) {
			this.tooltip = new vscode.MarkdownString(
				`**${vulnerability.title}**\n\n${vulnerability.description}\n\nCWE: ${vulnerability.cwe || 'N/A'}`,
			);
			this.contextValue = 'vulnerability';
			this.command = {
				command: 'codewise.viewVulnerabilityDetails',
				title: 'View Details',
				arguments: [vulnerability],
			};
		}
	}
}
