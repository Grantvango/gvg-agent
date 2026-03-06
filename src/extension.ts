import * as vscode from 'vscode';
import { VeracodeScanner } from './services/veracode.service';
import { SnykScanner } from './services/snyk.service';
import { WizScanner } from './services/wiz.service';
import { VulnerabilityTreeDataProvider } from './views/vulnerabilities.provider';
import { ScanControllerTreeDataProvider } from './views/scan-controller.provider';
import { VulnerabilityDetailsPanel } from './views/vulnerability-details.panel';
import { Vulnerability } from './types/vulnerabilities';

let vulnerabilityProvider: VulnerabilityTreeDataProvider;
let scanControllerProvider: ScanControllerTreeDataProvider;
let outputChannel: vscode.OutputChannel;

export async function activate(context: vscode.ExtensionContext) {
	console.log('🛡️ CodeWise security extension activated');

	// Create output channel
	outputChannel = vscode.window.createOutputChannel('CodeWise');
	outputChannel.appendLine('CodeWise Security Extension Started');

	// Initialize tree data providers
	vulnerabilityProvider = new VulnerabilityTreeDataProvider();
	scanControllerProvider = new ScanControllerTreeDataProvider();

	// Register tree views
	vscode.window.registerTreeDataProvider(
		'codewise.scanController',
		scanControllerProvider,
	);
	vscode.window.registerTreeDataProvider(
		'codewise.vulnerabilities',
		vulnerabilityProvider,
	);

	// Register commands
	registerCommands(context);

	outputChannel.appendLine('✅ CodeWise initialized successfully');
}

function registerCommands(context: vscode.ExtensionContext): void {
	// Veracode scan command
	context.subscriptions.push(
		vscode.commands.registerCommand('codewise.veracodeFullScan', async () => {
			await runVeracodeScan();
		}),
	);

	// Snyk scan command
	context.subscriptions.push(
		vscode.commands.registerCommand('codewise.snykFullScan', async () => {
			await runSnykScan();
		}),
	);

	// Wiz scan command
	context.subscriptions.push(
		vscode.commands.registerCommand('codewise.wizContainerScan', async () => {
			await runWizScan();
		}),
	);

	// Fix vulnerability command
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'codewise.fixVulnerability',
			async (vulnerability: Vulnerability) => {
				await fixVulnerabilityWithCopilot(vulnerability);
			},
		),
	);

	// Ignore vulnerability command
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'codewise.ignoreVulnerability',
			(vulnId: string) => {
				vulnerabilityProvider.ignoreVulnerability(vulnId);
				vscode.window.showInformationMessage(`Vulnerability ${vulnId} ignored`);
			},
		),
	);

	// View vulnerability details command
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'codewise.viewVulnerabilityDetails',
			async (vulnerability: Vulnerability) => {
				VulnerabilityDetailsPanel.createOrShow(
					context.extensionUri,
					vulnerability,
				);
			},
		),
	);

	// Refresh scans command
	context.subscriptions.push(
		vscode.commands.registerCommand('codewise.refreshScans', () => {
			vscode.window.showInformationMessage('Refreshing scan results...');
		}),
	);

	// Settings command
	context.subscriptions.push(
		vscode.commands.registerCommand('codewise.openSettings', () => {
			vscode.commands.executeCommand(
				'workbench.action.openSettings',
				'codewise',
			);
		}),
	);
}

async function runVeracodeScan(): Promise<void> {
	scanControllerProvider.setScanStatus('veracode', 'scanning');

	try {
		const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder is open');
			return;
		}

		// Show progress notification
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Veracode SAST/SCA Scan',
				cancellable: true,
			},
			async (progress) => {
				progress.report({ increment: 0 });

				const scanner = new VeracodeScanner(outputChannel);
				const result = await scanner.scan(workspacePath);

				progress.report({ increment: 50, message: 'Processing results...' });

				vulnerabilityProvider.addScanResult(result);
				scanControllerProvider.setScanStatus('veracode', 'completed');

				progress.report({ increment: 100 });

				vscode.window.showInformationMessage(
					`✅ Veracode scan completed: ${result.summary.total} vulnerabilities found`,
				);
				outputChannel.show();
			},
		);
	} catch (error) {
		scanControllerProvider.setScanStatus('veracode', 'failed');
		vscode.window.showErrorMessage(`❌ Veracode scan failed: ${error}`);
		outputChannel.appendLine(`Error: ${error}`);
	}
}

async function runSnykScan(): Promise<void> {
	scanControllerProvider.setScanStatus('snyk', 'scanning');

	try {
		const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder is open');
			return;
		}

		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Snyk SAST/SCA Scan',
				cancellable: true,
			},
			async (progress) => {
				progress.report({ increment: 0 });

				const scanner = new SnykScanner(outputChannel);
				const result = await scanner.scan(workspacePath);

				progress.report({ increment: 50, message: 'Processing results...' });

				vulnerabilityProvider.addScanResult(result);
				scanControllerProvider.setScanStatus('snyk', 'completed');

				progress.report({ increment: 100 });

				vscode.window.showInformationMessage(
					`✅ Snyk scan completed: ${result.summary.total} vulnerabilities found`,
				);
				outputChannel.show();
			},
		);
	} catch (error) {
		scanControllerProvider.setScanStatus('snyk', 'failed');
		vscode.window.showErrorMessage(`❌ Snyk scan failed: ${error}`);
		outputChannel.appendLine(`Error: ${error}`);
	}
}

async function runWizScan(): Promise<void> {
	scanControllerProvider.setScanStatus('wiz', 'scanning');

	try {
		// Prompt for image name
		const imageName = await vscode.window.showInputBox({
			prompt: 'Enter container image name (e.g., ubuntu:20.04, myapp:latest)',
			placeHolder: 'ubuntu:20.04',
		});

		if (!imageName) {
			scanControllerProvider.setScanStatus('wiz', 'idle');
			return;
		}

		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: `Wiz Container Scan: ${imageName}`,
				cancellable: true,
			},
			async (progress) => {
				progress.report({ increment: 0 });

				const scanner = new WizScanner(outputChannel);
				const result = await scanner.scan(imageName);

				progress.report({ increment: 50, message: 'Processing results...' });

				vulnerabilityProvider.addScanResult(result);
				scanControllerProvider.setScanStatus('wiz', 'completed');

				progress.report({ increment: 100 });

				vscode.window.showInformationMessage(
					`✅ Wiz scan completed for ${imageName}: ${result.summary.total} vulnerabilities found`,
				);
				outputChannel.show();
			},
		);
	} catch (error) {
		scanControllerProvider.setScanStatus('wiz', 'failed');
		vscode.window.showErrorMessage(`❌ Wiz scan failed: ${error}`);
		outputChannel.appendLine(`Error: ${error}`);
	}
}

async function fixVulnerabilityWithCopilot(
	vulnerability: Vulnerability,
): Promise<void> {
	const message = `🪄 Attempting to fix ${vulnerability.title} with Copilot...`;
	vscode.window.showInformationMessage(message);

	outputChannel.appendLine(`\n[COPILOT FIX] ${vulnerability.title}`);
	outputChannel.appendLine(`ID: ${vulnerability.id}`);
	outputChannel.appendLine(`Description: ${vulnerability.description}`);
	if (vulnerability.recommendation) {
		outputChannel.appendLine(`Recommendation: ${vulnerability.recommendation}`);
	}

	// Build Copilot prompt
	const copilotPrompt = buildCopilotPrompt(vulnerability);
	outputChannel.appendLine(`\nCopilot Prompt:\n${copilotPrompt}`);

	// Try to trigger Copilot inline chat
	try {
		// Open inline chat with the vulnerability details
		await vscode.commands.executeCommand(
			'github.copilot.openSymbolFromReferences',
			null,
			null,
			null,
		);

		// Alternative: Try to use the copilot.chat.open command if it exists
		try {
			await vscode.commands.executeCommand('workbench.action.openUnifiedFind');
		} catch (e) {
			// Command may not exist in all versions
		}

		vscode.window.showInformationMessage(
			`Copilot should open. Please use the following prompt to fix the vulnerability:\n\n${copilotPrompt}`,
		);
	} catch (error) {
		// Show the prompt to the user directly
		const fixPrompt = `Use GitHub Copilot to fix the following security vulnerability:\n\n${copilotPrompt}`;
		vscode.window.showInformationMessage(fixPrompt);
	}

	outputChannel.show();
}

function buildCopilotPrompt(vulnerability: Vulnerability): string {
	let prompt = `Fix the following security vulnerability:\n\n`;
	prompt += `Title: ${vulnerability.title}\n`;
	prompt += `Severity: ${vulnerability.severity}\n`;
	prompt += `Description: ${vulnerability.description}\n`;

	if (vulnerability.cwe) {
		prompt += `CWE: ${vulnerability.cwe}\n`;
	}

	if (vulnerability.cveId) {
		prompt += `CVE: ${vulnerability.cveId}\n`;
	}

	if (vulnerability.filePath && vulnerability.lineNumber) {
		prompt += `Location: ${vulnerability.filePath}:${vulnerability.lineNumber}\n`;
	}

	if (vulnerability.recommendation) {
		prompt += `Recommendation: ${vulnerability.recommendation}\n`;
	}

	prompt += `\nPlease provide code changes to remediate this vulnerability. Consider:\n`;
	prompt += `- Security best practices\n`;
	prompt += `- Code quality and maintainability\n`;
	prompt += `- Minimal impact on existing functionality\n`;
	prompt += `- Proper error handling\n`;

	return prompt;
}

export function deactivate() {
	console.log('🛡️ CodeWise security extension deactivated');
	outputChannel.dispose();
}
