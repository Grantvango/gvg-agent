# 🦖 AppSec Dinosaur

> A VS Code extension providing intelligent orchestration of security tools with business context scoring

The AppSec Dinosaur is your security-conscious companion that helps prioritize vulnerabilities based on your business impact, data classification, compliance requirements, and asset value. It integrates multiple security tools (SAST, DAST, SCA, Secrets Detection, etc.) and rescores their findings to align with your organization's risk tolerance.

## 🌟 Features

- 🔧 **Multi-Tool Integration**: Support for SAST, DAST, SCA, Secrets Detection, Container scanning, and more
  - npm audit (Node.js dependencies)
  - Semgrep (Static analysis)
  - Gitleaks (Secret detection)
  - Extensible framework for adding more tools

- 📊 **Business Context Scoring**: Automatically rescores findings based on:
  - Business Impact Level (CRITICAL/HIGH/MEDIUM/LOW)
    -🚀 Quick Start

### 1. Install the Extension

- Open VS Code and search for "AppSec Dinosaur" in the Extensions marketplace, or
- C⚙️ Configuration

Configure AppSec Dinosaur in VS Code settings:

```json
{
	"appsecDinosaur.businessContextEnabled": true,
	"appsecDinosaur.defaultBusinessImpact": "HIGH",
	"appsecDinosaur.dataClassification": "INTERNAL",
	"appsecDinosaur.enabledTools": ["npm-audit", "gitleaks", "semgrep"]
}
```

### Business Context Settings

- `appsecDinosaur.businessContextEnabled`: Toggle business context scoring on/off
- `appsecDinosaur.defaultBusinessImpact`: Default business impact level for your projects
- `appsecDinosaur.dataClassification`: Default data classification for your codebase
- `appsecDinosaur.enabledTools`: Which tools are active (uncheck to disable)

### 3. Apply Business Context (Optional)

When prompted, select "Yes" to apply business context scoring. This will:

- Adjust severity scores based on your business impact
- Provide risk-adjusted urgency levels
- Suggest appropriate remediation timelines
  🛠 Supported Tools & Categories

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
