import * as vscode from 'vscode';
import {
	Vulnerability,
	ScanResult,
	VeracodeVulnerability,
} from '../types/vulnerabilities';

export class VeracodeScanner {
	private outputChannel: vscode.OutputChannel;

	constructor(outputChannel: vscode.OutputChannel) {
		this.outputChannel = outputChannel;
	}

	async scan(workspacePath: string): Promise<ScanResult> {
		this.outputChannel.appendLine('[Veracode] Starting SAST/SCA scan...');

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const veracodeVulnerable = this.getExampleData();
			const vulnerabilities = this.parseVulnerabilities(veracodeVulnerable);

			const scanResult: ScanResult = {
				scanId: `veracode-${Date.now()}`,
				scanner: 'veracode',
				timestamp: Date.now(),
				duration: 2000,
				status: 'completed',
				vulnerabilities,
				summary: {
					total: vulnerabilities.length,
					critical: vulnerabilities.filter((v) => v.severity === 'CRITICAL')
						.length,
					high: vulnerabilities.filter((v) => v.severity === 'HIGH').length,
					medium: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
					low: vulnerabilities.filter((v) => v.severity === 'LOW').length,
				},
			};

			this.outputChannel.appendLine(
				`[Veracode] Scan completed: ${scanResult.summary.total} vulnerabilities found`,
			);
			return scanResult;
		} catch (error) {
			this.outputChannel.appendLine(`[Veracode] Scan failed: ${error}`);
			throw error;
		}
	}

	private parseVulnerabilities(
		veracodeData: VeracodeVulnerability[],
	): Vulnerability[] {
		return veracodeData.map((issue) => ({
			id: `veracode-${issue.issue_id}`,
			title: issue.category_name,
			description: issue.description,
			severity: this.mapSeverity(issue.severity),
			cwe: issue.cwe_id,
			filePath: issue.file_name,
			lineNumber: issue.line_number,
			recommendation: `Fix the ${issue.category_name} vulnerability in ${issue.file_name}`,
			scanner: 'veracode',
			ignored: false,
			rawData: issue,
		}));
	}

	private mapSeverity(
		veracodeLevel: number,
	): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' {
		switch (veracodeLevel) {
			case 5:
				return 'CRITICAL';
			case 4:
				return 'HIGH';
			case 3:
				return 'MEDIUM';
			case 2:
				return 'LOW';
			default:
				return 'INFO';
		}
	}

	private getExampleData(): VeracodeVulnerability[] {
		return [
			{
				issue_id: 'VC001',
				issue_type: 'SQL_INJECTION',
				severity: 5,
				category_name: 'SQL Injection',
				description:
					'User-controlled data enters a SQL query. An attacker could execute arbitrary SQL code.',
				remediation_status: 'OPEN',
				affected_component: 'database.service.ts',
				file_name: 'src/services/database.service.ts',
				line_number: 45,
				cwe_id: 'CWE-89',
				owasp_top_10: 'A03:2021 – Injection',
			},
			{
				issue_id: 'VC002',
				issue_type: 'CROSS_SITE_SCRIPTING',
				severity: 4,
				category_name: 'Cross-Site Scripting (XSS)',
				description:
					'User input is reflected in HTML without proper encoding. An attacker could inject malicious scripts.',
				remediation_status: 'OPEN',
				affected_component: 'auth.controller.ts',
				file_name: 'src/controllers/auth.controller.ts',
				line_number: 78,
				cwe_id: 'CWE-79',
				owasp_top_10: 'A03:2021 – Injection',
			},
			{
				issue_id: 'VC003',
				issue_type: 'INSECURE_CRYPTOGRAPHY',
				severity: 4,
				category_name: 'Insecure Cryptography',
				description:
					'MD5 hash is used for password hashing. Use a modern algorithm like bcrypt.',
				remediation_status: 'OPEN',
				affected_component: 'password.utils.ts',
				file_name: 'src/utils/password.utils.ts',
				line_number: 12,
				cwe_id: 'CWE-327',
				owasp_top_10: 'A02:2021 – Cryptographic Failures',
			},
			{
				issue_id: 'VC004',
				issue_type: 'SENSITIVE_DATA_EXPOSURE',
				severity: 4,
				category_name: 'Sensitive Data Exposure',
				description:
					'API keys are hardcoded in source code. Move to environment variables.',
				remediation_status: 'OPEN',
				affected_component: 'config.ts',
				file_name: 'src/config/config.ts',
				line_number: 8,
				cwe_id: 'CWE-798',
				owasp_top_10: 'A02:2021 – Cryptographic Failures',
			},
			{
				issue_id: 'VC005',
				issue_type: 'WEAK_AUTHENTICATION',
				severity: 3,
				category_name: 'Weak Authentication',
				description:
					'Password validation is insufficient. Enforce strong password requirements.',
				remediation_status: 'OPEN',
				affected_component: 'auth.service.ts',
				file_name: 'src/services/auth.service.ts',
				line_number: 156,
				cwe_id: 'CWE-521',
				owasp_top_10: 'A07:2021 – Identification and Authentication Failures',
			},
			{
				issue_id: 'VC006',
				issue_type: 'MISSING_AUTHORIZATION_CHECK',
				severity: 3,
				category_name: 'Missing Authorization Check',
				description:
					'Endpoint does not validate user permissions before accessing resources.',
				remediation_status: 'OPEN',
				affected_component: 'admin.controller.ts',
				file_name: 'src/controllers/admin.controller.ts',
				line_number: 34,
				cwe_id: 'CWE-639',
				owasp_top_10: 'A01:2021 – Broken Access Control',
			},
		];
	}
}
