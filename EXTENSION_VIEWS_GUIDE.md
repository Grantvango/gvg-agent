# VS Code Extension Views & UI Capabilities

This guide explains the different types of views and UI components you can add to your VS Code extension.

## View Types in Your Extension

### 1. **Tree Views** (Most Common)

Tree views display hierarchical data with collapsible items.

**Features:**

- Collapsible/expandable items with children
- Icons and badges
- Descriptions and tooltips
- Context menus
- Click commands
- Lazy loading

**Examples in your code:**

- `SimpleTreeViewProvider` - Basic collapsible structure
- `FindingsTreeProvider` - Items with severity icons
- `ScanStatusProvider` - Items with status badges

**Use cases for AppSec:**

- Scan results hierarchy
- Findings by severity/type
- Tool configurations
- Recent scans

---

### 2. **WebView** (Custom HTML UI)

For custom HTML/CSS/JS UI when tree views aren't enough.

**Features:**

- Full control over UI design
- Interactive components (charts, forms, etc.)
- Custom styling with VS Code theme variables
- Two-way messaging with extension
- Resource loading from disk or web

**Example in your code:**

- `DashboardWebViewProvider` - Shows metrics and stats

**Use cases for AppSec:**

- Dashboard with charts/graphs
- Risk scoring visualizations
- Trend analysis
- Real-time metrics
- Interactive configuration forms

---

### 3. **VS Code UI Components**

#### Tree Item Features

```typescript
// Icon - Use ThemeIcon for consistency
item.iconPath = new vscode.ThemeIcon('error');

// Badge - Small indicator
item.badge = new vscode.TreeItemBadge('5', vscode.ThemeIconId.circle);

// Description - Right-aligned text
item.description = '[CRITICAL]';

// Tooltip - Hover text (can be Markdown)
item.tooltip = new vscode.MarkdownString('**Finding:** SQL Injection');

// Context Value - for conditional menus
item.contextValue = 'finding-critical';

// Command - Click action
item.command = {
	command: 'appsec-dinosaur.openFile',
	arguments: ['file.ts', 42],
};
```

#### Collapsible State

```typescript
vscode.TreeItemCollapsibleState.None; // No children
vscode.TreeItemCollapsibleState.Collapsed; // Can expand
vscode.TreeItemCollapsibleState.Expanded; // Auto-expanded
```

---

## Configuration in package.json

### Views Container

Creates a new sidebar section (activity bar icon)

```json
"viewsContainers": {
  "activitybar": [
    {
      "id": "my-container",
      "title": "My Extension",
      "icon": "assets/icon.png"
    }
  ]
}
```

### Views

Registers individual views in a container

```json
"views": {
  "my-container": [
    {
      "id": "my-view",
      "name": "View Name",
      "type": "tree"  // or "webview"
    }
  ]
}
```

### Commands

```json
"commands": [
  {
    "command": "my-command",
    "title": "Display Title",
    "category": "Category Name",
    "icon": "$(check)"  // VS Code icon reference
  }
]
```

### Context Menus

Shows commands in tree item context menus

```json
"menus": {
  "view/item/context": [
    {
      "command": "my-command",
      "when": "viewItem == finding",      // Show only for items with contextValue='finding'
      "group": "inline@1"                 // Position (inline@1, inline@2, etc.)
    }
  ]
}
```

---

## Common Patterns for AppSec

### Pattern 1: Hierarchical Scan Results

```
SAST Scans
├── Semgrep
│   └── SQL Injection (critical)
└── SonarQube
    └── Weak Crypto (high)

SCA Scans
├── Dependencies
│   ├── lodash 4.17.11 (critical - CVE-xxxx)
│   └── express 4.17.1 (high - CVE-yyyy)
```

### Pattern 2: Severity-based Filtering

```typescript
const item = new vscode.TreeItem(finding.title);
item.contextValue = `finding-${finding.severity}`;
// In menus: when: "viewItem =~ /^finding-(critical|high)/"
```

### Pattern 3: File Navigation

```typescript
item.command = {
	command: 'appsec-dinosaur.openFile',
	arguments: [finding.filePath, finding.lineNumber],
};
```

### Pattern 4: Real-time Updates

```typescript
private _onDidChangeTreeData = new vscode.EventEmitter();

// Trigger refresh when data changes
this._onDidChangeTreeData.fire(itemToRefresh);
// or fire() with no args to refresh entire tree
```

### Pattern 5: Dashboard with Metrics

Use WebView to show:

- Total findings count
- Critical/high/medium/low breakdown
- Security score
- Trend graphs
- Compliance status

---

## VS Code Theme Integration

Your extension should use VS Code theme variables:

```css
/* Colors */
color: var(--vscode-foreground);
background: var(--vscode-editor-background);
border: 1px solid var(--vscode-editor-border);

/* Buttons */
background: var(--vscode-button-background);
color: var(--vscode-button-foreground);

/* Status colors */
color: var(--vscode-statusBar-foreground);

/* Input */
background: var(--vscode-input-background);
```

---

## Icon References

VS Code has built-in icons you can use:

```
$(check)              ✓
$(close)              ✕
$(error)              ⚠ Error icon
$(warning)            ⚠ Warning
$(info)               ⓘ
$(debug-hint)         💡
$(loading~spin)       ⟳ Loading
$(run)                ▶
$(debug-start)        ▶
$(refresh)            ⟳
$(stop)               ■
$(search)             🔍
$(wrench)             🔧
```

Full list: https://code.visualstudio.com/api/references/icons-in-labels

---

## Next Steps for Your AppSec Agent

1. **Enhance Findings View** - Show SAST/SCA results with drill-down
2. **Add Dashboard WebView** - Real-time security metrics
3. **Business Context Scoring** - Interactive scoring UI
4. **Settings View** - Configure scan tools and thresholds
5. **Report Generation** - Export findings with context scores
6. **Hover Tooltips** - Show detailed vulnerability info

---

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api/references/vscode-api)
- [Tree View Guide](https://code.visualstudio.com/api/extension-guides/tree-view)
- [WebView Guide](https://code.visualstudio.com/api/extension-guides/webview)
- [UI Theme Variables](https://code.visualstudio.com/api/references/theme-color)
