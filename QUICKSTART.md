# CodeWise Quick Start Guide

Welcome to CodeWise! 🛡️ Get up and running with unified security scanning in 5 minutes.

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "CodeWise"
4. Click **Install**
5. Reload VS Code

### From Source (Development)

```bash
cd /path/to/codewise
npm install
npm run compile
# Press F5 to launch in debug extension host
```

## First Run - 5 Minutes to Your First Scan

### Step 1: Configure API Credentials (2 minutes)

CodeWise needs API credentials for the security scanners. You can skip this and use demo data.

**Option A: Demo Mode (No Setup Needed)**

- Leave settings blank to use built-in example vulnerabilities

**Option B: Use Real APIs**

1. Open VS Code Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "codewise"
3. Configure at least one scanner:

```
codewise.veracode.enabled: true
codewise.veracode.apiId: YOUR_API_ID
codewise.veracode.apiSecret: YOUR_API_SECRET
```

Or:

```
codewise.snyk.enabled: true
codewise.snyk.apiToken: YOUR_API_TOKEN
```

Or:

```
codewise.wiz.enabled: true
codewise.wiz.clientId: YOUR_CLIENT_ID
codewise.wiz.clientSecret: YOUR_CLIENT_SECRET
```

### Step 2: Open a Project (30 seconds)

1. Open any project folder in VS Code
2. Click the **CodeWise icon** in the Activity Bar (left sidebar)
   - It looks like a shield: `🛡️`

### Step 3: Run Your First Scan (1 minute)

1. In the CodeWise sidebar, you'll see "Scan Controls"
2. Click any button:
   - **Veracode (SAST/SCA)** 🔍 - Scans source code
   - **Snyk (SAST/SCA)** 🐍 - Scans dependencies
   - **Wiz (Container/Image)** 📦 - Scans container images

3. For Wiz, you'll be prompted to enter a container image name:

   ```
   ubuntu:20.04
   myapp:latest
   python:3.9-slim
   ```

4. Wait for the scan to complete (watch the progress notification)

### Step 4: View Vulnerabilities (1 minute)

1. Scans complete → vulnerabilities appear in **Vulnerabilities** panel
2. Expand by **Scanner**: Veracode, Snyk, or Wiz
3. Expand by **Severity**: CRITICAL, HIGH, MEDIUM, LOW, INFO
4. Click any vulnerability to see details

### Step 5: Fix a Vulnerability with Copilot (1 minute)

**Prerequisites**: Install [GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

1. Click any vulnerability to open details panel
2. Click **Fix with Copilot** button
3. GitHub Copilot will open with a detailed prompt
4. Use Copilot to generate a fix
5. Review and apply the suggested code

## Common Tasks

### View Scan Results

```
CodeWise Sidebar
├─ Scan Controls (buttons to trigger scans)
└─ Vulnerabilities (organized results)
    ├─ VERACODE (6 vulns)
    │  ├─ CRITICAL (1)
    │  ├─ HIGH (2)
    │  ├─ MEDIUM (2)
    │  └─ LOW (1)
    ├─ SNYK (5 vulns)
    │  ├─ CRITICAL (0)
    │  ├─ HIGH (2)
    │  └─ MEDIUM (3)
    └─ WIZ (8 vulns)
       ├─ CRITICAL (2)
       ├─ HIGH (3)
       ├─ MEDIUM (2)
       └─ LOW (1)
```

### Ignore a Vulnerability

1. Right-click vulnerability
2. Select "Ignore Vulnerability"
3. Vulnerability moves to ignored section
4. Re-enable in settings if needed

### View Vulnerability Details

Click on any vulnerability to see:

- **Title & Severity** with color-coded badge
- **CWE & CVE IDs** for reference
- **Description** - what the vulnerability is
- **Location** - file and line number
- **Recommendation** - how to fix it
- **References** - links to CVE/CWE databases
- **Actions** - Fix with Copilot or Ignore

### Run Multiple Scans

Click scan buttons in any order:

```
✓ Run Veracode →  6 vulnerabilities found
✓ Run Snyk →     5 vulnerabilities found
✓ Run Wiz →      8 vulnerabilities found
```

All results accumulate in the Vulnerabilities view. Organize by severity to prioritize fixes.

## Example Workflow

### Scenario: Fix Top Security Issues

**Goal**: Fix all CRITICAL vulnerabilities in your code

1. **Scan with Veracode**
   - Click "Scan with Veracode (SAST/SCA)"
   - Wait for results

2. **Filter by Severity**
   - Look in Vulnerabilities panel
   - Expand "CRITICAL" section
   - See 1 SQL Injection vulnerability

3. **View Details**
   - Click on "SQL Injection" vulnerability
   - Read description and recommendation
   - See file location: `src/services/database.service.ts:45`

4. **Fix with Copilot**
   - Click "🪄 Fix with Copilot" button
   - GitHub Copilot opens with prompt
   - Copilot suggests using parameterized queries
   - Accept and apply the fix

5. **Verify**
   - Re-run Veracode scan
   - SQL Injection should disappear from results

6. **Continue**
   - Repeat for next CRITICAL vulnerabilities
   - Then move to HIGH severity issues

## Keyboard Shortcuts

| Action                | Mac                          | Windows/Linux                |
| --------------------- | ---------------------------- | ---------------------------- |
| Open CodeWise Sidebar | `Cmd+Shift+X` then click     | `Ctrl+Shift+X` then click    |
| Focus Activity Bar    | `Cmd+0`                      | `Ctrl+0`                     |
| Open Command Palette  | `Cmd+Shift+P`                | `Ctrl+Shift+P`               |
| Run All Scans         | No shortcut (use UI buttons) | No shortcut (use UI buttons) |

## Tips & Tricks

### 💡 Use Demo Mode First

- Don't have API credentials? No problem!
- Leave settings blank to see example vulnerabilities
- Great for learning CodeWise features

### 💡 Run Scans Incrementally

- Run Veracode first (SAST)
- Then Snyk (dependencies)
- Then Wiz (containers)
- Compare results across scanners

### 💡 Check Output Channel

- Open Output panel (`Cmd+J`)
- Select "CodeWise" from dropdown
- See detailed logs of each scan
- Useful for debugging issues

### 💡 Leverage Copilot

- Have GitHub Copilot installed
- Each vulnerability has Copilot-optimized prompt
- Copilot can suggest context-aware fixes
- Review fixes before applying

## Troubleshooting

### Scans Not Running?

1. **Check workspace**: Is a folder open in VS Code?
2. **Check credentials**: Do you have valid API keys? (or use demo mode)
3. **Check output**: Open CodeWise output channel for error details
4. **Check network**: Do you have internet access?

### No Vulnerabilities Found?

- API credentials may be invalid
- Project may be clean (unlikely, run demo!)
- Try running the scan again
- Check output channel for errors

### Copilot Not Working?

- Install GitHub Copilot extension
- Have active Copilot subscription
- Check your VS Code version (1.100.0+)

## Next Steps

### Learn More

- Read full [README.md](README.md) for complete documentation
- Check security platform docs:
  - [Veracode](https://www.veracode.com/docs)
  - [Snyk](https://docs.snyk.io/)
  - [Wiz](https://docs.wiz.io/)

### Get API Credentials

**Veracode**

- Sign up at https://www.veracode.com/
- Account → API Credentials → Generate

**Snyk**

- Sign up at https://snyk.io/
- Settings → API Token → Copy

**Wiz**

- Sign up at https://www.wiz.io/
- Settings → API Tokens → Generate

### Configure Your Workspace

Add a `.codewise.json` to your project root (optional):

```json
{
	"ignoreVulnerabilities": ["veracode-VC005", "snyk-npm:lodash:20160406"],
	"maxSeverityToFix": "HIGH",
	"autoFixWithCopilot": false
}
```

## Support

**Having trouble?**

1. Check this Quick Start again
2. Read [README.md](README.md) for detailed docs
3. Check CodeWise Output Channel for errors
4. Verify API credentials and network connectivity

**Found a bug?**

- File an issue on GitHub: https://github.com/evm-dsoar/codewise/issues

---

**Questions?**: See [README.md](README.md) or the CodeWise documentation.

**Version**: 1.0.0 | **Made by**: EVM DSOAR

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
