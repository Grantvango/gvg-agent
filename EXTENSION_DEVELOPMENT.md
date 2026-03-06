# CodeWise Extension Development Guide

**Made by EVM DSOAR** | Version 1.0.0

Complete documentation for building, extending, and maintaining the CodeWise VS Code security extension.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Build & Deployment](#build--deployment)
5. [Adding New Scanners](#adding-new-scanners)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Contributing](#contributing)

## Architecture Overview

CodeWise follows a modular, extensible architecture:

```
┌─────────────────────────────────────────────────────────┐
│                   VS Code API                           │
├─────────────────────────────────────────────────────────┤
│                 Extension.ts (Main)                      │
│            (Command Registration & Lifecycle)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Services   │  │   Tree Views  │  │   Webviews    │ │
│  ├──────────────┤  ├──────────────┤  ├───────────────┤ │
│  │ Veracode     │  │ Scan         │  │ Vulnerability │ │
│  │ Snyk         │  │ Controller   │  │ Details Panel │ │
│  │ Wiz          │  │ Renderer     │  └───────────────┘ │
│  │              │  │              │                     │
│  └──────────────┘  └──────────────┘                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│        Types (Vulnerabilities, ScanResult, etc)        │
├─────────────────────────────────────────────────────────┤
│        External Services (Veracode, Snyk, Wiz)         │
└─────────────────────────────────────────────────────────┘
```

**Design Principles**:
- **Modular**: Each scanner is independent
- **Extensible**: Easy to add new scanners
- **Type-Safe**: Full TypeScript support
- **User-Friendly**: Clear, organized UI
- **Non-Blocking**: Scans run with progress notifications

## Project Structure

```
codewise/
├── src/
│   ├── extension.ts                      # Main entry point
│   │
│   ├── services/                         # Scanner implementations
│   │   ├── veracode.service.ts          # Veracode SAST/SCA
│   │   ├── snyk.service.ts              # Snyk SAST/SCA
│   │   └── wiz.service.ts               # Wiz Container Scanning
│   │
│   ├── types/
│   │   └── vulnerabilities.ts           # TypeScript interfaces
│   │
│   └── views/                            # UI components
│       ├── scan-controller.provider.ts   # Scan controls tree view
│       ├── vulnerabilities.provider.ts   # Vulnerabilities tree view
│       └── vulnerability-details.panel.ts# Details webview
│
├── out/                                  # Compiled JavaScript
│
├── package.json                          # Manifest & dependencies
├── tsconfig.json                         # TypeScript configuration
├── eslint.config.mjs                     # Code style
│
├── README.md                             # Full documentation
├── QUICKSTART.md                         # 5-minute setup guide
└── EXTENSION_VIEWS_GUIDE.md              # VS Code patterns guide
```

## Core Components

### 1. Main Extension (extension.ts)

**Responsibilities**:
- Register all commands
- Initialize tree data providers
- Handle scan orchestration
- Manage Copilot integration
- Provide output logging

**Key Functions**:
```typescript
activate(context)              // Extension initialization
registerCommands(context)      // Register all commands
runVeracodeScan()             // Trigger Veracode scan
runSnykScan()                 // Trigger Snyk scan
runWizScan()                  // Trigger Wiz scan
fixVulnerabilityWithCopilot() // Handle Copilot fixes
buildCopilotPrompt()          // Generate Copilot prompts
```

### 2. Scanner Services

Each scanner is independent with consistent interface:

#### Veracode Service (veracode.service.ts)
- **Input**: Workspace path
- **Output**: ScanResult with Veracode vulnerabilities
- **Example Data**: 6 vulnerabilities (SQL injection, XSS, crypto, etc)
- **Fields**: Issue ID, severity, category, recommendations, CWE

#### Snyk Service (snyk.service.ts)
- **Input**: Workspace path
- **Output**: ScanResult with Snyk vulnerabilities
- **Example Data**: 5 vulnerabilities (dependency package issues)
- **Fields**: Package name, version, CVE IDs, fix recommendations

#### Wiz Service (wiz.service.ts)
- **Input**: Container image name
- **Output**: ScanResult with container vulnerabilities
- **Example Data**: 8 vulnerabilities (OS packages, configs, secrets)
- **Fields**: OS packages, runtime vulnerabilities, best practices

### 3. Tree View Providers

#### ScanControllerTreeDataProvider
**Purpose**: Display scan trigger buttons

```
Scan Controls
├─ 🔍 ⚪ Veracode (SAST/SCA)
├─ 🐍 ⚪ Snyk (SAST/SCA)
└─ 📦 ⚪ Wiz (Container/Image)
```

**Features**:
- Shows scanner status (idle, scanning, completed, failed)
- Clickable items trigger scans
- Emoji indicators for quick visual reference

#### VulnerabilityTreeDataProvider
**Purpose**: Display vulnerability results

```
Vulnerabilities
├─ 🔍 VERACODE (6 vulns)
│  ├─ 🔴 CRITICAL (1)
│  │  └─ SQL Injection (CWE-89)
│  ├─ 🟠 HIGH (2)
│  ├─ 🟡 MEDIUM (2)
│  └─ 🟢 LOW (1)
├─ 🐍 SNYK (5 vulns)
└─ 📦 WIZ (8 vulns)
```

**Features**:
- Hierarchical organization (Scanner → Severity → Item)
- Click to view details
- Ignore functionality
- Fix with Copilot

### 4. Webview Panel

#### VulnerabilityDetailsPanel
**Purpose**: Show detailed vulnerability information

**Contains**:
- Severity badge with color coding
- Vulnerability ID, CWE, CVE
- Description and location
- Recommendations
- References links
- "Fix with Copilot" button
- "Ignore" button

**Styling**:
- VS Code theme-aware
- Professional HTML/CSS layout
- Responsive design
- Copy-friendly text

## Build & Deployment

### Development Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on save)
npm run watch

# Run linter
npm run lint
```

### Debug Mode

1. Open project in VS Code
2. Press `F5` to launch extension in debug window
3. Extension runs with console logs enabled
4. Breakpoints supported

### Build for Distribution

```bash
# Compile
npm run compile

# Package .vsix file
npm run package

# Publish to marketplace
npm run publish
```

## Adding New Scanners

### Step 1: Create Scanner Service

Create `src/services/mynewscanner.service.ts`:

```typescript
import * as vscode from 'vscode';
import { Vulnerability, ScanResult } from '../types/vulnerabilities';

export class MyNewScanner {
  private outputChannel: vscode.OutputChannel;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  async scan(workspacePath: string): Promise<ScanResult> {
    this.outputChannel.appendLine('[MYNEWSCANNER] Starting scan...');
    
    try {
      // Call API or run local scan
      const results = await this.runScan(workspacePath);
      
      const vulnerabilities = this.parseResults(results);
      
      const scanResult: ScanResult = {
        scanId: `mynewscanner-${Date.now()}`,
        scanner: 'mynewscanner',  // Must match your scanner type
        timestamp: Date.now(),
        duration: 0,
        status: 'completed',
        vulnerabilities,
        summary: {
          total: vulnerabilities.length,
          critical: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
          high: vulnerabilities.filter(v => v.severity === 'HIGH').length,
          medium: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
          low: vulnerabilities.filter(v => v.severity === 'LOW').length,
        },
      };
      
      return scanResult;
    } catch (error) {
      this.outputChannel.appendLine(`[MYNEWSCANNER] Error: ${error}`);
      throw error;
    }
  }

  private async runScan(workspacePath: string): Promise<any> {
    // Implement your scanning logic
  }

  private parseResults(results: any): Vulnerability[] {
    // Convert results to Vulnerability[]
    return [];
  }
}
```

### Step 2: Update Vulnerability Types

Modify `src/types/vulnerabilities.ts`:

```typescript
// Add your scanner type
export interface MyNewScannerVulnerability {
  id: string;
  title: string;
  severity: SeverityLevel;
  // ... other fields
}

// Update Vulnerability interface if needed
export interface Vulnerability {
  // ... existing fields
  scanner: 'veracode' | 'snyk' | 'wiz' | 'mynewscanner';
}
```

### Step 3: Register Command in extension.ts

```typescript
// Import
import { MyNewScanner } from './services/mynewscanner.service';

// In registerCommands()
context.subscriptions.push(
  vscode.commands.registerCommand('codewise.mynewscannerScan', async () => {
    await runMyNewScannerScan();
  })
);

// Add handler function
async function runMyNewScannerScan(): Promise<void> {
  scanControllerProvider.setScanStatus('mynewscanner', 'scanning');

  try {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage('No workspace folder is open');
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'My New Scanner Scan',
        cancellable: true,
      },
      async progress => {
        progress.report({ increment: 0 });

        const scanner = new MyNewScanner(outputChannel);
        const result = await scanner.scan(workspacePath);

        progress.report({ increment: 50, message: 'Processing results...' });

        vulnerabilityProvider.addScanResult(result);
        scanControllerProvider.setScanStatus('mynewscanner', 'completed');

        progress.report({ increment: 100 });

        vscode.window.showInformationMessage(
          `✅ Scan completed: ${result.summary.total} vulnerabilities found`
        );
        outputChannel.show();
      }
    );
  } catch (error) {
    scanControllerProvider.setScanStatus('mynewscanner', 'failed');
    vscode.window.showErrorMessage(`❌ Scan failed: ${error}`);
  }
}
```

### Step 4: Update package.json

```json
{
  "contributes": {
    "commands": [
      {
        "command": "codewise.mynewscannerScan",
        "title": "Scan with My New Scanner",
        "category": "CodeWise",
        "icon": "$(device-desktop)"
      }
    ]
  }
}
```

## API Integration

### Veracode API

**Endpoint**: https://api.veracode.com/

**Authentication**: REST API with HMAC signature

```typescript
// Example API call
const response = await axios.get('https://api.veracode.com/appsec/v2/findings', {
  auth: {
    username: apiId,
    password: apiSecret,
  },
});
```

### Snyk API

**Endpoint**: https://api.snyk.io/

**Authentication**: Bearer Token

```typescript
const response = await axios.get('https://api.snyk.io/v1/vulnerabilities', {
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
});
```

### Wiz API

**Endpoint**: https://app.wiz.io/api/

**Authentication**: OAuth 2.0

```typescript
// Authenticate first
const token = await getWizToken(clientId, clientSecret);

// Use token
const response = await axios.get('https://app.wiz.io/api/vulnerability-scan', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Testing

### Unit Tests

```bash
npm run test
```

### Manual Testing Checklist

- [ ] Veracode scan completes and shows results
- [ ] Snyk scan completes and shows results
- [ ] Wiz scan completes and shows results
- [ ] Multiple scans can be running simultaneously
- [ ] Vulnerability details panel opens correctly
- [ ] Copilot integration works
- [ ] Ignore functionality works
- [ ] Tree view updates correctly after scans
- [ ] Output channel shows logs

### Demo Mode Testing

CodeWise works without credentials using built-in example data:

1. Leave all API credentials blank
2. Run each scanner
3. Example vulnerabilities appear automatically
4. Test fix/ignore functionality with demo data

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (npm run lint)
- Document complex functions
- Use meaningful variable names

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Compile and lint: `npm run compile && npm run lint`
4. Commit with descriptive messages
5. Push and create PR

### Commit Message Format

```
type(scope): brief description

Longer explanation if needed

Fixes #123
```

Types: feat, fix, docs, style, refactor, test, chore

## Performance Considerations

### Optimization Tips

1. **Lazy Load Results**: Tree views use lazy loading
2. **Progress Notifications**: Users see scan progress
3. **Non-Blocking**: Scans don't freeze extension
4. **Caching**: Consider caching scan results
5. **Throttling**: Limit API rate with backoff

### Memory Management

- Dispose webviews properly
- Clean up event listeners
- Limit vulnerability history

## Troubleshooting Extension Development

### Extension Won't Load

```bash
# Check for compilation errors
npm run compile

# Check manifest (package.json)
# Ensure all referenced files exist
```

### Commands Not Appearing

```bash
# Commands must be registered in package.json contributes
# And in extension.ts registerCommands()
# Clear VS Code cache and reload
```

### Webview Not Displaying

- Check nonce generation
- Verify HTML is valid
- Check CSS paths
- Look at browser dev tools (F12 in debug mode)

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Extension Samples](https://github.com/Microsoft/vscode-extension-samples)
- [Veracode API Docs](https://docs.veracode.com/)
- [Snyk API Docs](https://snyk.docs.apiary.io/)
- [Wiz API Docs](https://docs.wiz.io/)

---

**Made by**: EVM DSOAR  
**License**: MIT  
**Version**: 1.0.0
