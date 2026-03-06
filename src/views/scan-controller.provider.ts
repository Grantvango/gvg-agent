import * as vscode from 'vscode';

export class ScanControllerTreeDataProvider implements vscode.TreeDataProvider<ScanControlItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<
		ScanControlItem | undefined | null | void
	> = new vscode.EventEmitter<ScanControlItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<
		ScanControlItem | undefined | null | void
	> = this._onDidChangeTreeData.event;

	private scanStatus: Map<
		string,
		'idle' | 'scanning' | 'completed' | 'failed'
	> = new Map([
		['veracode', 'idle'],
		['snyk', 'idle'],
		['wiz', 'idle'],
	]);

	getTreeItem(element: ScanControlItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ScanControlItem): Thenable<ScanControlItem[]> {
		if (!element) {
			// Root level - show scanner options
			return Promise.resolve([
				new ScanControlItem(
					'✓ Veracode (SAST/SCA)',
					vscode.TreeItemCollapsibleState.None,
					'veracode',
					this.getStatusIcon('veracode'),
					'codewise.veracodeFullScan',
				),
				new ScanControlItem(
					'✓ Snyk (SAST/SCA)',
					vscode.TreeItemCollapsibleState.None,
					'snyk',
					this.getStatusIcon('snyk'),
					'codewise.snykFullScan',
				),
				new ScanControlItem(
					'✓ Wiz (Container/Image)',
					vscode.TreeItemCollapsibleState.None,
					'wiz',
					this.getStatusIcon('wiz'),
					'codewise.wizContainerScan',
				),
			]);
		}

		return Promise.resolve([]);
	}

	setScanStatus(
		scanner: string,
		status: 'idle' | 'scanning' | 'completed' | 'failed',
	): void {
		this.scanStatus.set(scanner, status);
		this._onDidChangeTreeData.fire();
	}

	private getStatusIcon(scanner: string): string {
		const status = this.scanStatus.get(scanner);
		const scannerEmoji =
			{
				veracode: '🔍',
				snyk: '🐍',
				wiz: '📦',
			}[scanner as string] || '❓';

		const statusEmoji = {
			idle: '⚪',
			scanning: '🟡',
			completed: '🟢',
			failed: '🔴',
		}[status || 'idle'];

		return `${scannerEmoji} ${statusEmoji}`;
	}
}

export class ScanControlItem extends vscode.TreeItem {
	declare command?: vscode.Command;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly id?: string,
		public readonly icon?: string,
		commandId?: string,
	) {
		super(label, collapsibleState);

		if (icon) {
			this.label = `${icon} ${label}`;
		}

		if (commandId) {
			this.command = {
				command: commandId,
				title: label,
				arguments: [],
			};
		}

		this.description = 'Click to scan';
	}
}
