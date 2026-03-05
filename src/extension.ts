import * as vscode from 'vscode';
import { ScansService } from './services/scans';

class ScanItem extends vscode.TreeItem {
	constructor() {
		super('Run Scan', vscode.TreeItemCollapsibleState.None);
		this.command = {
			command: 'appsec-dinosaur.runScan',
			title: 'Run Scan',
		};
		this.iconPath = new vscode.ThemeIcon('run');
	}
}

class AppSecViewProvider implements vscode.TreeDataProvider<ScanItem> {
	getTreeItem(element: ScanItem): vscode.TreeItem {
		return element;
	}

	getChildren(): ScanItem[] {
		return [new ScanItem()];
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('🦖 AppSec Dinosaur extension is now active!');

	const provider = new AppSecViewProvider();
	vscode.window.registerTreeDataProvider('appsec-dinosaur-view', provider);

	const scansService = new ScansService();

	const runScanCommand = vscode.commands.registerCommand(
		'appsec-dinosaur.runScan',
		async () => {
			const projectPath =
				vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';

			if (!projectPath) {
				vscode.window.showErrorMessage('No workspace folder found');
				return;
			}

			try {
				vscode.window.showInformationMessage('🦖 Starting security scan...');

				// Call the scan service
				const results = await scansService.runFullScan(projectPath);

				console.log('Scan results:', results);
				vscode.window.showInformationMessage(
					`🦖 Scan complete! Found ${results.length} scan result(s)`,
				);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error';
				vscode.window.showErrorMessage(`Scan failed: ${message}`);
			}
		},
	);

	context.subscriptions.push(runScanCommand);
}

export function deactivate() {
	console.log('🦖 AppSec Dinosaur extension deactivated');
}
