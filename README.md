# CodeWise

**A unified VS Code security scanning extension for developers**

Made by **EVM DSOAR**

CodeWise is a comprehensive VS Code extension that brings unified security scanning capabilities from three leading security platforms directly into your IDE. Scan your code and containers for vulnerabilities using Veracode (SAST/SCA), Snyk (SAST/SCA), and Wiz (Container/Image scanning), all from one place. Fix vulnerabilities with the power of GitHub Copilot.

## Features

✨ **Multi-Scanner Integration**

- **Veracode SAST/SCA**: Deep code analysis and software composition analysis
- **Snyk SAST/SCA**: Dependency vulnerability scanning and code security analysis
- **Wiz Container Scanning**: Container image and runtime security scanning

🔍 **Comprehensive Vulnerability Management**

- View all vulnerabilities in an organized tree view
- Filter by severity level (CRITICAL, HIGH, MEDIUM, LOW, INFO)
- Detailed vulnerability information with CWE/CVE references
- One-click navigation to vulnerable code locations

🪄 **AI-Powered Fixes**

- Fix vulnerabilities with GitHub Copilot
- Automatic prompt generation with security context
- View Copilot suggestions directly in the editor

🎯 **Security Best Practices**

- Real-time vulnerability tracking
- Grouping by scanner and severity
- Ignore/whitelist vulnerabilities
- Export scan results

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "CodeWise"
4. Click Install
5. Reload VS Code

## Quick Start

### 1. Configure Scanner APIs

Open VS Code Settings (Ctrl+, / Cmd+,) and navigate to **CodeWise**:

```json
"codewise.veracode.enabled": true,
"codewise.veracode.apiId": "YOUR_VERACODE_API_ID",
"codewise.veracode.apiSecret": "YOUR_VERACODE_API_SECRET",

"codewise.snyk.enabled": true,
"codewise.snyk.apiToken": "YOUR_SNYK_API_TOKEN",

"codewise.wiz.enabled": true,
"codewise.wiz.clientId": "YOUR_WIZ_CLIENT_ID",
"codewise.wiz.clientSecret": "YOUR_WIZ_CLIENT_SECRET"
```

### 2. Open a Project

Open any project folder in VS Code

### 3. Run a Scan

1. Open the CodeWise panel in the Activity Bar (it shows the shield icon)
2. Click on any scanner under "Scan Controls":
   - **Veracode (SAST/SCA)** - Scans your source code
   - **Snyk (SAST/SCA)** - Scans dependencies and code
   - **Wiz (Container/Image)** - Scans container images (you'll be prompted for image name)

### 4. View Results

Vulnerabilities appear in the "Vulnerabilities" tree view, organized by:

- Scanner (Veracode, Snyk, Wiz)
- Severity level (CRITICAL → INFO)
- Individual vulnerabilities

### 5. Fix Vulnerabilities

- Click on any vulnerability to open the details panel
- Click **Fix with Copilot** button
- GitHub Copilot will open with a detailed prompt to help fix the issue

## Example Vulnerability Outputs

### Veracode SAST/SCA Example

```
Scanner: VERACODE
Total Vulnerabilities: 6

CRITICAL (1):
  ├─ SQL Injection (CWE-89, CVE-N/A)
  │  File: src/services/database.service.ts
  │  Line: 45
  │  Description: User-controlled data enters a SQL query.
  │              An attacker could execute arbitrary SQL code.
  │  Recommendation: Use parameterized queries or prepared statements

HIGH (2):
  ├─ Cross-Site Scripting (XSS) (CWE-79)
  │  File: src/controllers/auth.controller.ts
  │  Line: 78
  │  Description: User input is reflected in HTML without encoding
  │
  └─ Insecure Cryptography (CWE-327)
     File: src/utils/password.utils.ts
     Line: 12
     Description: MD5 hash used for passwords (weak algorithm)

MEDIUM (2):
  └─ [Similar structure...]

LOW (1):
  └─ [Similar structure...]
```

### Snyk SAST/SCA Example

```
Scanner: SNYK
Total Vulnerabilities: 5

CRITICAL (0)

HIGH (2):
  ├─ Prototype Pollution in lodash (CVE-2021-23337)
  │  Package: lodash@4.17.4
  │  Severity: HIGH
  │  Description: Prototype pollution vulnerability allowing RCE
  │  Fix Available: Upgrade to lodash@4.17.21 or higher
  │
  └─ Arbitrary Code Execution in js-yaml (CVE-2018-3174)
     Package: js-yaml@3.12.0
     Severity: HIGH

MEDIUM (3):
  ├─ Open Redirect in express (CVE-2022-24999)
  │  Package: express@4.16.0
  │  Available Fix: express@4.18.1
  │
  ├─ Prototype Pollution in minimist (CVE-2021-44906)
  │  Package: minimist@1.2.0
  │  Available Fix: minimist@1.2.6
  │
  └─ Regular Expression DoS in underscore (CVE-2021-23504)
     Package: underscore@1.12.0
     Available Fix: underscore@1.13.0

LOW (0)
```

### Wiz Container/Image Example

```
Scanner: WIZ
Image: ubuntu:20.04
Total Vulnerabilities: 8

CRITICAL (2):
  ├─ OpenSSL Vulnerability (CVE-2023-0286)
  │  Package: openssl (1.1.1f-1ubuntu2)
  │  CVSS Score: 9.8
  │  Type: OS Package Vulnerability
  │  Description: Buffer overflow in SSL/TLS handshake
  │  Remediation: apt-get update && apt-get upgrade openssl
  │
  └─ Log4Shell Vulnerability (CVE-2021-44228)
     Package: log4j (2.14.1)
     CVSS Score: 10.0
     Type: Runtime Vulnerability
     Description: Remote Code Execution via JNDI injection

HIGH (3):
  ├─ Python Requests Library Vulnerability (CVE-2023-32681)
  │  Package: requests (2.25.1)
  │  Available Fix: requests@2.28.0+
  │
  ├─ Container Runs as Root
  │  Type: Security Configuration Issue
  │  Remediation: Add USER directive to Dockerfile
  │
  └─ Database Credentials Exposed
     Type: Secrets Detection
     Remediation: Rebuild image without credentials

MEDIUM (2):
  ├─ Node.js Package Vulnerability (CVE-2022-24999)
  │  Package: express (4.16.3)
  │  Available Fix: express@4.18.2+
  │
  └─ Container Security Configuration
     Type: Best Practice Violation

LOW (1):
  └─ Missing Security Labels
```

### Detailed Vulnerability Information Panel

When you click on a vulnerability, CodeWise displays:

```
═══════════════════════════════════════════════════════════════
  🔴 SQL Injection (CRITICAL)
═══════════════════════════════════════════════════════════════

  Scanner: VERACODE
  ID: veracode-VC001
  CWE: CWE-89
  CVE: N/A

  DESCRIPTION
  User-controlled data enters a SQL query. An attacker could
  execute arbitrary SQL code, manipulate data, or perform
  unauthorized actions on your database.

  LOCATION
  File: src/services/database.service.ts
  Line: 45

  RECOMMENDATION
  Replace dynamic SQL construction with parameterized queries
  or prepared statements. This prevents SQL injection attacks
  by ensuring user input is treated as data, not code.

  REFERENCES
  → CWE-89
  → OWASP Top 10 A03:2021 – Injection

  ┌──────────────────────────────────────────────────────────┐
  │ [🪄 Fix with Copilot]              [⊘ Ignore Vulnerability] │
  └──────────────────────────────────────────────────────────┘
```

## Commands

| Command                           | Shortcut | Description                       |
| --------------------------------- | -------- | --------------------------------- |
| `Scan with Veracode (SAST/SCA)`   | —        | Trigger Veracode security scan    |
| `Scan with Snyk (SAST/SCA)`       | —        | Trigger Snyk dependency scan      |
| `Scan with Wiz (Container/Image)` | —        | Trigger container image scan      |
| `Fix with Copilot`                | —        | Open Copilot to fix vulnerability |
| `Ignore Vulnerability`            | —        | Add vulnerability to ignorelist   |
| `View Details`                    | —        | Open detailed vulnerability info  |
| `Refresh Results`                 | —        | Refresh vulnerability display     |
| `Settings`                        | —        | Open CodeWise settings            |

## Configuration

Add to your VS Code `settings.json`:

```json
{
	// Veracode Configuration
	"codewise.veracode.enabled": true,
	"codewise.veracode.apiId": "",
	"codewise.veracode.apiSecret": "",

	// Snyk Configuration
	"codewise.snyk.enabled": true,
	"codewise.snyk.apiToken": "",

	// Wiz Configuration
	"codewise.wiz.enabled": true,
	"codewise.wiz.clientId": "",
	"codewise.wiz.clientSecret": "",

	// Copilot Settings
	"codewise.copilot.autoFix": false
}
```

## API Credentials

### Veracode

1. Go to [Veracode](https://www.veracode.com/)
2. Sign in to your account
3. Navigate to Account Settings → API Credentials
4. Generate API ID and Secret
5. Add to CodeWise settings

### Snyk

1. Go to [Snyk](https://snyk.io/)
2. Sign in or create account
3. Go to Settings → API Token
4. Copy your API token
5. Add to CodeWise settings

### Wiz

1. Go to [Wiz](https://www.wiz.io/)
2. Sign in to your account
3. Navigate to Settings → API Tokens
4. Generate Client ID and Secret
5. Add to CodeWise settings

## Features in Detail

### Multi-Scanner View

The "Scan Controls" panel shows all available scanners with their current status:

- ⚪ Idle (ready to scan)
- 🟡 Scanning (in progress)
- 🟢 Completed (scan finished)
- 🔴 Failed (scan encountered an error)

### Vulnerability Organization

Vulnerabilities are automatically organized by:

1. **Scanner**: Veracode 🔍 | Snyk 🐍 | Wiz 📦
2. **Severity**: CRITICAL 🔴 | HIGH 🟠 | MEDIUM 🟡 | LOW 🟢 | INFO ⚪
3. **Individual Items**: Click to view full details

### Copilot Integration

The "Fix with Copilot" button:

1. Opens GitHub Copilot (if installed)
2. Provides context about the vulnerability
3. Suggests fixes based on security best practices
4. Helps generate code to remediate the issue

### Output Channel

View detailed logs in the CodeWise Output Channel:

- Scan start/completion times
- Number of vulnerabilities found
- Error messages and diagnostics
- Copilot prompt history

## Troubleshooting

### Scans Not Running

- Verify API credentials in Settings
- Check Output Channel for error messages
- Ensure workspace folder is open
- Make sure extension is enabled

### No Vulnerabilities Found

- API credentials may be invalid
- Try running the scan again
- Check that you're scanning the right project

### Copilot Integration Not Working

- Install GitHub Copilot extension
- Ensure you have active Copilot subscription
- Check VS Code version compatibility

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Run tests
npm run test

# Package for distribution
npm run package
```

### Project Structure

```
codewise/
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── services/
│   │   ├── veracode.service.ts   # Veracode scanner
│   │   ├── snyk.service.ts       # Snyk scanner
│   │   └── wiz.service.ts        # Wiz container scanner
│   ├── types/
│   │   └── vulnerabilities.ts    # TypeScript interfaces
│   └── views/
│       ├── scan-controller.provider.ts      # Scan controls tree
│       ├── vulnerabilities.provider.ts      # Vulnerabilities tree
│       └── vulnerability-details.panel.ts   # Details webview
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript config
└── README.md                     # Documentation
```

## Performance

CodeWise is designed for performance:

- Scans run with progress notifications
- Results update incrementally
- Tree views use lazy loading
- Minimal memory footprint

## Security

- API credentials are stored securely in VS Code settings
- All scan data is processed locally
- No data is sent to third parties without explicit API calls
- Source code is not transmitted to CodeWise servers

## Support & Troubleshooting

For issues or feature requests:

1. Check the Output Channel (CodeWise) for error details
2. Verify API credentials are correct
3. Ensure you have sufficient permissions in each security platform
4. Check GitHub Issues on the CodeWise repository

## License

MIT License - See LICENSE file for details

## Made by

**EVM DSOAR** - Enterprise Vulnerability Management, Development Security Operations & Architecture

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Compatibility**: VS Code 1.100.0+

### SAST (Static Application Security Testing)

- 🟢 **Semgrep** - Fast, rule-based code analysis
- ⚫ **SonarQube** - Enterprise code quality platform

### SCA (Software Composition Analysis)

- 🟢 **npm audit** - Node.js dependency vulnerabilities
- ⚫ **Snyk** - Developer-first dependency scanner

### Secrets Detection

- 🟢 **Gitleaks** - Find secrets in git history
- ⚫ **TruffleHog** - Advanced secret scanning

### Container Security

- ⚫ **Trivy** - Container image scanning

### Infrastructure as Code

- ⚫ **tfsec** - Terraform security scanning

### DAST (Dynamic Application Security Testing)

- ⚫ **OWASP ZAP** - Web application testing

_🟢 = Available out of box | ⚫ = Requires tool installation_

## 📊 How Business Context Scoring Works

Each security finding is rescored based on your business context:

```
Final Risk Score = Base Severity Score × Business Multipliers

Business Multipliers Include:
- Impact Level: 1.5x (CRITICAL) to 0.75x (LOW)
- Asset Value: 0.2x to 2.0x
- Data Classification: 0.8x (PUBLIC) to 1.4x (CONFIDENTIAL)
- Compliance Relevance: 1.5x if required by your compliance reqs
```

Example:

- **Without context**: SQL Injection (HIGH severity) = 70/100
- **With context** on a CRITICAL asset with CONFIDENTIAL data = 96/100
- **Same finding** on a LOW-impact PUBLIC asset = 42/100

## 📁 Project Structure

```
appsec-dinosaur/
├── assets/
│   └── dinosaur.png          # Extension icon and branding
├── src/
│   ├── extension.ts           # Main extension entry point
│   ├── types/
│   │   └── appsec.ts          # Type definitions
│   └── services/
│       ├── toolRegistry.ts    # Tool registration and management
│       ├── businessContextScorer.ts  # Risk scoring engine
│       ├── toolExecutor.ts    # Tool execution orchestration
│       └── appSecAgent.ts     # Main agent interface
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🏗 Extending the Extension

### Adding a New Security Tool

1. Register in `src/services/toolRegistry.ts`:

```typescript
this.register({
	id: 'my-tool',
	name: 'My Security Tool',
	description: 'Tool description',
	category: ToolCategory.SAST,
	isAvailable: true,
});
```

2. Add execution logic in `src/services/toolExecutor.ts`:

```typescript
private async runMyTool(targetPath: string): Promise<SecurityFinding[]> {
  // Tool execution code
  return findings;
}
```

3. Add to the switch statement in `runTool()` method

### Customizing Business Context

Edit `src/services/businessContextScorer.ts` to adjust multipliers and scoring logic.

## ⌨️ Available Commands

| Command                            | Description               |
| ---------------------------------- | ------------------------- |
| `appsec-dinosaur.selectTool`       | Interactive tool selector |
| `appsec-dinosaur.browseByCategory` | Browse tools by category  |
| `appsec-dinosaur.runNpmAudit`      | Run npm audit             |
| `appsec-dinosaur.runGitleaks`      | Run Gitleaks              |
| `appsec-dinosaur.runSemgrep`       | Run Semgrep               |
| `appsec-dinosaur.toolStatus`       | Show tool status          |
| `appsec-dinosaur.help`             | Show help documentation   |

## 📌 Status Bar

The 🦖 AppSec icon in the status bar provides quick access to the tool selector.

## 📤 Output Channels

Tool results are displayed in dedicated output channels:

- `AppSec Dinosaur - [Tool Name]` - Individual tool results
- `AppSec Dinosaur Agent` - Agent logs and orchestration info

## 🐛 Known Issues & Limitations

- Tool availability depends on local installation
- Some tools require API keys (e.g., Snyk, SonarQube)
- Business context scoring uses simplified multipliers (can be customized)
- Currently supports major Unix-like systems and Windows with similar tooling
  The extension doesn't require dependencies, but to use specific tools, install them:

```bash
# Node.js dependency scanning
npm install -g npm-audit

# Secret detection
curl https://github.com/gitleaks/gitleaks/releases/download/v8.x.x/gitleaks-linux-x64 -o /usr/local/bin/gitleaks
chmod +x /usr/local/bin/gitleaks

# Code analysis
pip install semgrep
```

Check "AppSec Dinosaur: Tool Status" in VS Code to see which tools are installed

- SLA Breach Status

- 🎯 **Smart Risk Prioritization**: Findings are ranked by actual business risk, not just technical severity

- 🦖 **Dinosaur Branding**: Adorable security companion with every interaction

- 📋 **Tool Status Dashboard**: View which security tools are installed and available

- 🔍 **Category Browser**: Filter and run tools by security category

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## 🗺️ Roadmap

- [ ] Web UI dashboard for findings
- [ ] Integration with ticketing systems (Jira, GitHub Issues)
- [ ] ML-based severity prediction
- [ ] Custom compliance mappings
- [ ] Automated remediation suggestions
- [ ] Reporting and trends analysis
- [ ] Team-based risk assessment
- [ ] IDE-wide issue highlights
