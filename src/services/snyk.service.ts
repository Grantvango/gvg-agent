import * as vscode from 'vscode';
import {
	Vulnerability,
	ScanResult,
	SnykVulnerability,
} from '../types/vulnerabilities';

export class SnykScanner {
	private outputChannel: vscode.OutputChannel;

	constructor(outputChannel: vscode.OutputChannel) {
		this.outputChannel = outputChannel;
	}

	async scan(workspacePath: string): Promise<ScanResult> {
		this.outputChannel.appendLine('[Snyk] Starting SAST/SCA scan...');

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 2500));

			const snykVulnerabilities = this.getExampleData();
			const vulnerabilities = this.parseVulnerabilities(snykVulnerabilities);

			const scanResult: ScanResult = {
				scanId: `snyk-${Date.now()}`,
				scanner: 'snyk',
				timestamp: Date.now(),
				duration: 2500,
				status: 'completed',
				vulnerabilities,
				summary: {
					total: vulnerabilities.length,
					critical: vulnerabilities.filter((v) => v.severity === 'CRITICAL')
						.length,
					high: vulnerabilities.filter((v) => v.severity === 'HIGH').length,
					medium: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
					low: vulnerabilities.filter((v) => v.severity === 'LOW').length,
				},
			};

			this.outputChannel.appendLine(
				`[Snyk] Scan completed: ${scanResult.summary.total} vulnerabilities found`,
			);
			return scanResult;
		} catch (error) {
			this.outputChannel.appendLine(`[Snyk] Scan failed: ${error}`);
			throw error;
		}
	}

	private parseVulnerabilities(snykData: SnykVulnerability[]): Vulnerability[] {
		return snykData.map((vuln) => ({
			id: `snyk-${vuln.id}`,
			title: vuln.title,
			description: vuln.description,
			severity: this.mapSeverity(vuln.severity),
			cveId: vuln.identifiers?.CVE?.[0],
			cwe: vuln.identifiers?.CWE?.[0],
			recommendation: vuln.remediation,
			references: vuln.identifiers?.CVE || [],
			scanner: 'snyk',
			ignored: false,
			rawData: vuln,
		}));
	}

	private mapSeverity(
		snykLevel: string,
	): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' {
		switch (snykLevel.toLowerCase()) {
			case 'critical':
				return 'CRITICAL';
			case 'high':
				return 'HIGH';
			case 'medium':
				return 'MEDIUM';
			case 'low':
				return 'LOW';
			default:
				return 'INFO';
		}
	}

	private getExampleData(): SnykVulnerability[] {
		return [
			{
				id: 'npm:lodash:20160406',
				title: 'Prototype Pollution in lodash',
				severity: 'high',
				type: 'vulnerability',
				description:
					'A prototype pollution vulnerability allowing remote code execution via lodash functions.',
				identifiers: {
					CVE: ['CVE-2021-23337'],
					CWE: ['CWE-1321'],
				},
				packageName: 'lodash',
				packageVersion: '4.17.4',
				from: ['lodash@4.17.4'],
				fixedIn: ['4.17.21'],
				remediation: 'Upgrade lodash to version 4.17.21 or higher',
			},
			{
				id: 'npm:express:20160406',
				title: 'Open Redirect in express',
				severity: 'medium',
				type: 'vulnerability',
				description:
					'An open redirect vulnerability in express middleware can redirect users to malicious sites.',
				identifiers: {
					CVE: ['CVE-2022-24999'],
					CWE: ['CWE-601'],
				},
				packageName: 'express',
				packageVersion: '4.16.0',
				from: ['express@4.16.0'],
				fixedIn: ['4.18.1'],
				remediation: 'Upgrade express to version 4.18.1 or higher',
			},
			{
				id: 'npm:minimist:20160406',
				title: 'Prototype Pollution in minimist',
				severity: 'medium',
				type: 'vulnerability',
				description:
					'Minimist before 1.2.6 and 1.3.x before 1.3.0 using the ++ syntax does not properly reset.',
				identifiers: {
					CVE: ['CVE-2021-44906'],
					CWE: ['CWE-1321'],
				},
				packageName: 'minimist',
				packageVersion: '1.2.0',
				from: ['minimist@1.2.0'],
				fixedIn: ['1.2.6'],
				remediation: 'Upgrade minimist to version 1.2.6 or higher',
			},
			{
				id: 'SNYK-JS-YML-1948417',
				title: 'Arbitrary Code Execution in js-yaml',
				severity: 'high',
				type: 'vulnerability',
				description:
					'js-yaml 3.x before 3.13.1 allows arbitrary code execution via unsafe YAML parsing.',
				identifiers: {
					CVE: ['CVE-2018-3174'],
					CWE: ['CWE-502'],
				},
				packageName: 'js-yaml',
				packageVersion: '3.12.0',
				from: ['js-yaml@3.12.0'],
				fixedIn: ['3.13.1'],
				remediation:
					'Upgrade js-yaml to version 3.13.1 or higher and use safe load',
			},
			{
				id: 'SNYK-JS-UNDERSCORE-1080384',
				title: 'Regular Expression DoS in underscore',
				severity: 'medium',
				type: 'vulnerability',
				description:
					'Underscore before 1.13.0-0 allows ReDoS via the template function.',
				identifiers: {
					CVE: ['CVE-2021-23504'],
					CWE: ['CWE-1333'],
				},
				packageName: 'underscore',
				packageVersion: '1.12.0',
				from: ['underscore@1.12.0'],
				fixedIn: ['1.13.0'],
				remediation: 'Upgrade underscore to version 1.13.0 or higher',
			},
		];
	}
}
