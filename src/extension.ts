import * as vscode from 'vscode';
import { ScansService } from './services/scans';
import {
	SimpleTreeViewProvider,
	FindingsTreeProvider,
	ScanStatusProvider,
	DashboardWebViewProvider,
} from './views/examples';

// (Old example classes removed - see ./views/examples.ts for modern patterns)

export function activate(context: vscode.ExtensionContext) {
	console.log('🦖 AppSec Dinosaur extension is now active!');

	const scansService = new ScansService();

	// ========================================================================
	// Register View Providers
	// ========================================================================

	// Example 1: Simple tree view with collapsible items
	const simpleProvider = new SimpleTreeViewProvider();
	vscode.window.registerTreeDataProvider(
		'appsec-dinosaur-view',
		simpleProvider,
	);

	// Example 2: Findings tree with icons and severity badges
	const findingsProvider = new FindingsTreeProvider();
	vscode.window.registerTreeDataProvider(
		'appsec-dinosaur-findings',
		findingsProvider,
	);

	// Example 3: Settings/Status tree with badges
	const statusProvider = new ScanStatusProvider();
	vscode.window.registerTreeDataProvider(
		'appsec-dinosaur-settings',
		statusProvider,
	);

	// Example 4: WebView dashboard
	const dashboardProvider = new DashboardWebViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			DashboardWebViewProvider.viewType,
			dashboardProvider,
		),
	);

	// ========================================================================
	// Register Commands
	// ========================================================================

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

	const openFileCommand = vscode.commands.registerCommand(
		'appsec-dinosaur.openFile',
		(filePath: string, lineNumber?: number) => {
			vscode.workspace.openTextDocument(filePath).then((doc) => {
				vscode.window.showTextDocument(doc).then((editor) => {
					if (lineNumber) {
						const line = Math.max(0, lineNumber - 1);
						editor.selection = new vscode.Selection(line, 0, line, 0);
						editor.revealRange(
							new vscode.Range(line, 0, line, 0),
							vscode.TextEditorRevealType.InCenter,
						);
					}
				});
			});
		},
	);

	const fixFindingCommand = vscode.commands.registerCommand(
		'appsec-dinosaur.fixFinding',
		(finding: any) => {
			vscode.window.showInformationMessage(
				'🦖 Feature: Fix finding (auto-remediation coming soon)',
			);
			// TODO: Implement auto-fix logic
		},
	);

	const ignoreFindingCommand = vscode.commands.registerCommand(
		'appsec-dinosaur.ignoreFinding',
		(finding: any) => {
			vscode.window.showInformationMessage(
				'🦖 Feature: Ignore finding (add to allowlist)',
			);
			// TODO: Implement ignore/whitelist logic
		},
	);

	const applyContextScoreCommand = vscode.commands.registerCommand(
		'appsec-dinosaur.applyContextScore',
		(finding: any) => {
			vscode.window.showInformationMessage(
				'🦖 Feature: Apply business context score',
			);
			// TODO: Implement business context scoring UI
		},
	);

	context.subscriptions.push(
		runScanCommand,
		openFileCommand,
		fixFindingCommand,
		ignoreFindingCommand,
		applyContextScoreCommand,
	);
}

export function deactivate() {
	console.log('🦖 AppSec Dinosaur extension deactivated');
}
