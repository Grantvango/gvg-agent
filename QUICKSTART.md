# Quick Start Guide - AppSec Dinosaur

Welcome to AppSec Dinosaur! 🦖 This guide gets you up and running in 5 minutes.

## Installation

### Option 1: From Marketplace (When Available)

- Open VS Code Extensions (`Cmd+Shift+X`)
- Search: "AppSec Dinosaur"
- Click Install

### Option 2: From Source

```bash
cd /path/to/appsec-dinosaur
npm install
npm run compile
# Press F5 to launch in debug extension host
```

## First Run

### Quick Test (30 seconds)

1. Open command palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: "AppSec Dinosaur: Tool Status"
3. Press Enter
4. View available tools in the output channel

### Run Your First Scan (2 minutes)

1. Open command palette: `Cmd+Shift+P`
2. Type: "AppSec Dinosaur: Select Tool"
3. Choose a tool (e.g., "npm audit")
4. Select "No" for business context (optional)
5. Wait for results in output channel

### Enable Business Context (1 minute)

1. Run a tool (see above)
2. When prompted "Apply business context scoring?" → Select "Yes"
3. Results will include:
   - Business Risk Scores (0-100)
   - Urgency Levels (IMMEDIATE, HIGH, MEDIUM, LOW)
   - Contextual Recommendations

## Commands Reference

### Main Commands

| Keyboard      | Command                     | Purpose                     |
| ------------- | --------------------------- | --------------------------- |
| `Cmd+Shift+P` | Search "Select Tool"        | Interactive tool picker     |
| `Cmd+Shift+P` | Search "Browse by Category" | Filter by security category |
| `Cmd+Shift+P` | Search "Tool Status"        | See installed tools         |
| `Cmd+Shift+P` | Search "Help"               | Documentation               |

### Quick Run Commands

| Command         | Purpose           |
| --------------- | ----------------- |
| "Run npm audit" | Scan dependencies |
| "Run Gitleaks"  | Detect secrets    |
| "Run Semgrep"   | Analyze code      |

### Status Bar

- Click 🦖 in status bar → Quick tool selector

## Setting Up Tools

### npm audit (Already Built-in)

```bash
# Usually already available if you have Node.js
npm audit --version
```

### Gitleaks (Recommended)

```bash
# macOS
brew install gitleaks

# Linux
https://github.com/gitleaks/gitleaks/releases

# Windows
choco install gitleaks
```

### Semgrep (Recommended)

```bash
# Install via pip
pip3 install semgrep

# Or via brew (macOS)
brew install semgrep

# Verify
semgrep --version
```

## Configuration

### Basic Settings (Optional)

Open VS Code Settings → Search "AppSec Dinosaur" and adjust:

```
appsecDinosaur.businessContextEnabled
  ↳ Toggle business context scoring (default: true)

appsecDinosaur.defaultBusinessImpact
  ↳ Set to: CRITICAL, HIGH, MEDIUM, or LOW (default: HIGH)

appsecDinosaur.dataClassification
  ↳ Set to: CONFIDENTIAL, INTERNAL, or PUBLIC (default: INTERNAL)
```

## Understanding Results

### Without Business Context

```
Finding: SQL Injection (HIGH)
Risk Score: 70/100
```

### With Business Context

```
Finding: SQL Injection (HIGH)
Base Score: 70
+ Business Impact (CRITICAL): ×1.5
+ Asset Value (8/10): ×1.6
+ Data Classification (CONFIDENTIAL): ×1.4
= Final Risk Score: 98/100 [IMMEDIATE]
Recommendation: Fix immediately before deployment
```

## Common Workflows

### Workflow 1: Pre-commit Security Check

1. Run: "AppSec Dinosaur: Run Gitleaks" → Check for secrets
2. Run: "AppSec Dinosaur: Run npm audit" → Check dependencies
   ✅ Commit only if no IMMEDIATE/HIGH findings

### Workflow 2: Full Security Audit

1. Run: "AppSec Dinosaur: Browse by Category"
2. Select each category (SAST, SCA, SECRETS, etc.)
3. Enable business context for all
4. Review all findings with business context scores
5. Create tickets for HIGH and IMMEDIATE items

### Workflow 3: Daily Security Monitor

1. Click 🦖 in status bar
2. Run quick tool scan
3. Check output for new findings
4. Review business-adjusted risk scores
5. Prioritize for sprint backlog

## Troubleshooting

### "Tool not available" Error

- Run: "AppSec Dinosaur: Tool Status"
- Install missing tools (shows which ones)
- Verify tool is in PATH: `which toolname`
- Restart VS Code

### No Findings Reported

- Tool may have found no issues (✅ good!)
- Check tool is installed correctly
- For npm audit: Run `npm audit` manually to verify
- Check console for error messages

### Output Channel Not Showing

- Manually click output channel tabs
- Or run command again
- Check "Output" view in bottom panel

## Next Steps

### Learn More

- Read [README.md](README.md) - Full documentation
- Read [EXAMPLES.md](EXAMPLES.md) - 10 detailed examples
- Read [DEVELOPMENT.md](DEVELOPMENT.md) - How to extend
- Read [ARCHITECTURE.md](ARCHITECTURE.md) - How it works

### Extend the Extension

- Add custom tools (see DEVELOPMENT.md)
- Customize business scoring multipliers
- Add your compliance requirements
- Create team-specific policies

### Integrate with CI/CD

```yaml
# GitHub Actions example
- name: Security Scan
  run: |
    npm audit --audit-level=moderate
    gitleaks detect --source .
    semgrep --json .
```

## Key Concepts

### Business Context Scoring

Adjusts security finding severity based on:

- **Business Impact**: How critical is this asset? (CRITICAL/HIGH/MEDIUM/LOW)
- **Asset Value**: How valuable is this system? (1-10 scale)
- **Data Classification**: What data does it handle? (CONFIDENTIAL/INTERNAL/PUBLIC)
- **Compliance**: Does it affect compliance requirements? (OWASP, PCI-DSS, etc.)

Result: Same vulnerability gets different risk scores for different systems.

### Tool Categories

- **SAST**: Find bugs in code (Semgrep, SonarQube)
- **DAST**: Test running application (OWASP ZAP)
- **SCA**: Check dependencies (npm audit, Snyk)
- **Secrets**: Find exposed credentials (Gitleaks)
- **Container**: Scan images (Trivy)
- **IAC**: Check infrastructure (tfsec)

### Risk Scores

- **90-100**: IMMEDIATE - Stop everything, fix now
- **70-89**: HIGH - Fix this sprint
- **50-69**: MEDIUM - Next 2 sprints
- **<50**: LOW - Backlog

## Tips & Tricks

💡 **Tip 1**: Always run Gitleaks before pushing code

```
Cmd+Shift+P → "Run Gitleaks"
```

💡 **Tip 2**: Use business context for priority meetings

```
Show risk scores to stakeholders
Higher business context = easier discussions about remediation
```

💡 **Tip 3**: Set up pre-commit hook

```bash
#!/bin/bash
gitleaks detect --source . || exit 1
```

💡 **Tip 4**: Review tool status regularly

```
Cmd+Shift+P → "Tool Status"
Stay updated on what's available
```

💡 **Tip 5**: Customize scoring for your team

```
Edit src/services/businessContextScorer.ts
Adjust multipliers for your risk profile
```

## Default Tools

| Tool      | Status       | Install                 |
| --------- | ------------ | ----------------------- |
| npm audit | ✅ Built-in  | Already have            |
| Gitleaks  | ⚫ Available | `brew install gitleaks` |
| Semgrep   | ⚫ Available | `pip3 install semgrep`  |
| Snyk      | ⚫ Coming    | `npm install -g snyk`   |
| SonarQube | ⚫ Coming    | Cloud service           |
| Trivy     | ⚫ Coming    | `brew install trivy`    |
| tfsec     | ⚫ Coming    | `brew install tfsec`    |
| OWASP ZAP | ⚫ Coming    | Download installer      |

✅ = Ready to use | ⚫ = Install first

## Support

### Getting Help

1. Run: "AppSec Dinosaur: Help" - View documentation
2. Check: [EXAMPLES.md](EXAMPLES.md) - Real-world scenarios
3. Read: [DEVELOPMENT.md](DEVELOPMENT.md) - Extension guide
4. Check: [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

### Reporting Issues

- Check Tool Status first
- Verify tool is installed
- Check console output (View → Debug Console)
- Try restarting VS Code

## What's Next?

- ✅ Try running your first tool
- ✅ Enable business context scoring
- ✅ Install additional tools
- ✅ Read usage examples
- ✅ Customize settings for your team

**Happy scanning with 🦖 AppSec Dinosaur!**
