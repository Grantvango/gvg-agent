/**
 * Examples of different view types and capabilities for VS Code extensions
 */

import * as vscode from 'vscode';

// ============================================================================
// EXAMPLE 1: Tree View with Collapsible Items
// ============================================================================

export class TreeItem extends vscode.TreeItem {
	constructor(
		label: string,
		collapsibleState?: vscode.TreeItemCollapsibleState,
		command?: vscode.Command,
	) {
		super(label, collapsibleState);
		this.command = command;
	}
}

export class SimpleTreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<
		TreeItem | undefined | null | void
	> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<
		TreeItem | undefined | null | void
	> = this._onDidChangeTreeData.event;

	getTreeItem(element: TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): TreeItem[] {
		if (!element) {
			// Root items
			return [
				new TreeItem('SAST Scans', vscode.TreeItemCollapsibleState.Collapsed),
				new TreeItem('SCA Scans', vscode.TreeItemCollapsibleState.Collapsed),
				new TreeItem(
					'Recent Findings',
					vscode.TreeItemCollapsibleState.Collapsed,
				),
			];
		}

		// Children based on parent
		if (element.label === 'SAST Scans') {
			return [
				new TreeItem('Semgrep', vscode.TreeItemCollapsibleState.None),
				new TreeItem('SonarQube', vscode.TreeItemCollapsibleState.None),
			];
		}
		if (element.label === 'SCA Scans') {
			return [
				new TreeItem('Dependency-Check', vscode.TreeItemCollapsibleState.None),
				new TreeItem('Snyk', vscode.TreeItemCollapsibleState.None),
			];
		}
		if (element.label === 'Recent Findings') {
			return [
				new TreeItem(
					'SQL Injection (Critical)',
					vscode.TreeItemCollapsibleState.None,
				),
				new TreeItem(
					'Weak Crypto (High)',
					vscode.TreeItemCollapsibleState.None,
				),
			];
		}

		return [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}

// ============================================================================
// EXAMPLE 2: Tree View with Icons, Badges, and Context Values
// ============================================================================

interface FindingItem {
	id: string;
	title: string;
	severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
	filePath?: string;
	lineNumber?: number;
}

export class FindingsTreeProvider implements vscode.TreeDataProvider<FindingItem> {
	private findings: FindingItem[] = [
		{
			id: '1',
			title: 'SQL Injection in user login',
			severity: 'critical',
			filePath: 'src/auth.ts',
			lineNumber: 42,
		},
		{
			id: '2',
			title: 'Insecure password storage',
			severity: 'high',
			filePath: 'src/user.ts',
			lineNumber: 15,
		},
		{
			id: '3',
			title: 'Missing CSRF token',
			severity: 'medium',
			filePath: 'src/forms.ts',
			lineNumber: 8,
		},
	];

	getTreeItem(element: FindingItem): vscode.TreeItem {
		const item = new vscode.TreeItem(element.title);

		// Add icon based on severity
		const iconMap: Record<string, vscode.ThemeIcon> = {
			critical: new vscode.ThemeIcon('error'),
			high: new vscode.ThemeIcon('warning'),
			medium: new vscode.ThemeIcon('info'),
			low: new vscode.ThemeIcon('debug-hint'),
			info: new vscode.ThemeIcon('info'),
		};
		item.iconPath = iconMap[element.severity] || new vscode.ThemeIcon('info');

		// Add description
		item.description = `[${element.severity.toUpperCase()}]`;

		// Add tooltip with more info
		item.tooltip = new vscode.MarkdownString(
			`**${element.title}**\n\nFile: ${element.filePath}:${element.lineNumber}`,
		);

		// Add context value for conditional commands
		item.contextValue = `finding-${element.severity}`;

		// Add command to open file
		if (element.filePath) {
			item.command = {
				command: 'appsec-dinosaur.openFile',
				title: 'Open Finding',
				arguments: [element.filePath, element.lineNumber],
			};
		}

		return item;
	}

	getChildren(): FindingItem[] {
		return this.findings;
	}

	addFinding(finding: FindingItem): void {
		this.findings.push(finding);
	}

	clearFindings(): void {
		this.findings = [];
	}
}

// ============================================================================
// EXAMPLE 3: Tree View with Badges and States
// ============================================================================

interface ScanStatus {
	name: string;
	status: 'running' | 'passed' | 'failed' | 'warning';
	progress?: number;
}

export class ScanStatusProvider implements vscode.TreeDataProvider<ScanStatus> {
	private scans: ScanStatus[] = [
		{ name: 'SAST Scan', status: 'passed' },
		{ name: 'SCA Scan', status: 'warning' },
		{ name: 'DAST Scan', status: 'failed' },
	];

	getTreeItem(element: ScanStatus): vscode.TreeItem {
		const item = new vscode.TreeItem(element.name);

		// Icon based on status
		const statusIcons: Record<string, vscode.ThemeIcon> = {
			passed: new vscode.ThemeIcon('check-all'),
			failed: new vscode.ThemeIcon('close'),
			warning: new vscode.ThemeIcon('warning'),
			running: new vscode.ThemeIcon('loading~spin'),
		};
		item.iconPath = statusIcons[element.status];

		item.label = element.name;
		item.description = element.status;

		return item;
	}

	getChildren(): ScanStatus[] {
		return this.scans;
	}
}

// ============================================================================
// EXAMPLE 4: WebView Provider (Custom HTML UI)
// ============================================================================

export class DashboardWebViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'appsec-dinosaur-dashboard';

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri],
		};

		webviewView.webview.html = this._getHtmlContent();

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage((data) => {
			switch (data.type) {
				case 'alert':
					vscode.window.showInformationMessage(data.value);
					break;
			}
		});
	}

	private _getHtmlContent() {
		return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              padding: 10px;
              font-family: var(--vscode-font-family);
            }
            .card {
              background: var(--vscode-editor-background);
              border: 1px solid var(--vscode-editor-border);
              padding: 12px;
              border-radius: 4px;
              margin-bottom: 8px;
            }
            .stat {
              font-size: 24px;
              font-weight: bold;
              color: var(--vscode-foreground);
            }
            .label {
              font-size: 12px;
              color: var(--vscode-descriptionForeground);
            }
            button {
              background: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              padding: 6px 12px;
              border-radius: 3px;
              cursor: pointer;
              width: 100%;
              margin-top: 8px;
            }
            button:hover {
              background: var(--vscode-button-hoverBackground);
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="stat">24</div>
            <div class="label">Critical Issues</div>
          </div>
          
          <div class="card">
            <div class="stat">156</div>
            <div class="label">Total Findings</div>
          </div>
          
          <div class="card">
            <div class="stat">94%</div>
            <div class="label">Security Score</div>
          </div>
          
          <button onclick="runScan()">Run Full Scan</button>
          
          <script>
            function runScan() {
              const vscode = acquireVsCodeApi();
              vscode.postMessage({
                type: 'alert',
                value: 'Starting security scan...'
              });
            }
          </script>
        </body>
      </html>
    `;
	}
}

// ============================================================================
// EXAMPLE 5: Context Menu Items with Tree Items
// ============================================================================

export class ContextMenuExample extends vscode.TreeItem {
	constructor(label: string) {
		super(label);
		// This context value enables specific commands only for this item
		this.contextValue = 'finding';
	}
}

// Usage in package.json:
// "menus": {
//   "view/item/context": [
//     {
//       "command": "appsec-dinosaur.fixFinding",
//       "when": "viewItem == finding",
//       "group": "inline@1"
//     },
//     {
//       "command": "appsec-dinosaur.ignoreFinding",
//       "when": "viewItem == finding",
//       "group": "inline@2"
//     }
//   ]
// }
