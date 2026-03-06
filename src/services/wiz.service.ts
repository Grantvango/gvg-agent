import * as vscode from 'vscode';
import {
	Vulnerability,
	ScanResult,
	WizVulnerability,
} from '../types/vulnerabilities';

export class WizScanner {
	private outputChannel: vscode.OutputChannel;

	constructor(outputChannel: vscode.OutputChannel) {
		this.outputChannel = outputChannel;
	}

	async scan(imageName: string): Promise<ScanResult> {
		this.outputChannel.appendLine(
			`[Wiz] Starting container/image scan for ${imageName}...`,
		);

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const wizVulnerabilities = this.getExampleData();
			const vulnerabilities = this.parseVulnerabilities(wizVulnerabilities);

			const scanResult: ScanResult = {
				scanId: `wiz-${Date.now()}`,
				scanner: 'wiz',
				timestamp: Date.now(),
				duration: 3000,
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
				`[Wiz] Scan completed for ${imageName}: ${scanResult.summary.total} vulnerabilities found`,
			);
			return scanResult;
		} catch (error) {
			this.outputChannel.appendLine(`[Wiz] Scan failed: ${error}`);
			throw error;
		}
	}

	private parseVulnerabilities(wizData: WizVulnerability[]): Vulnerability[] {
		return wizData.map((vuln) => ({
			id: `wiz-${vuln.id}`,
			title: vuln.name,
			description: vuln.description,
			severity: vuln.severity,
			cveId: vuln.cve,
			recommendation: vuln.remediation,
			scanner: 'wiz',
			ignored: false,
			rawData: vuln,
		}));
	}

	private getExampleData(): WizVulnerability[] {
		return [
			{
				id: 'WIZ001',
				name: 'OpenSSL Vulnerability',
				severity: 'CRITICAL',
				vulnerabilityType: 'OS Package Vulnerability',
				description:
					'OpenSSL before 1.1.1w, 3.0.x before 3.0.8, and 3.1.x before 3.1.1 contains a buffer overflow in the SSL/TLS handshake.',
				image: 'ubuntu:20.04',
				imageTag: 'latest',
				affectedResource: 'openssl (1.1.1f-1ubuntu2)',
				cve: 'CVE-2023-0286',
				cvss: 9.8,
				remediation:
					'Upgrade OpenSSL package to the latest version using apt-get update && apt-get upgrade openssl',
			},
			{
				id: 'WIZ002',
				name: 'Python Vulnerability in requests library',
				severity: 'HIGH',
				vulnerabilityType: 'Application Dependency Vulnerability',
				description:
					'The requests library in Python before 2.28.0 is vulnerable to request body exposure in proxy URLs.',
				image: 'python:3.9-slim',
				imageTag: 'v1.0',
				affectedResource: 'requests (2.25.1)',
				cve: 'CVE-2023-32681',
				cvss: 8.1,
				remediation:
					'Upgrade Python requests library to 2.28.0 or higher using pip install --upgrade requests',
			},
			{
				id: 'WIZ003',
				name: 'Node.js Package Vulnerability',
				severity: 'HIGH',
				vulnerabilityType: 'Application Dependency Vulnerability',
				description:
					'npm package express before 4.18.2 is vulnerable to open redirect vulnerability (CVE-2022-24999).',
				image: 'node:16-alpine',
				imageTag: 'v2.0',
				affectedResource: 'express (4.16.3)',
				cve: 'CVE-2022-24999',
				cvss: 6.1,
				remediation:
					'Update express package to 4.18.2 or higher in package.json and run npm install',
			},
			{
				id: 'WIZ004',
				name: 'Java Log4Shell Vulnerability',
				severity: 'CRITICAL',
				vulnerabilityType: 'Runtime Vulnerability',
				description:
					'Apache Log4j 2 before 2.17.1 is vulnerable to Remote Code Execution (RCE) via JNDI injection.',
				image: 'openjdk:11-jre-slim',
				imageTag: 'v1.2',
				affectedResource: 'log4j (2.14.1)',
				cve: 'CVE-2021-44228',
				cvss: 10.0,
				remediation:
					'Update Apache Log4j2 dependency to version 2.17.1 or higher',
			},
			{
				id: 'WIZ005',
				name: 'Container Security Configuration Issue',
				severity: 'HIGH',
				vulnerabilityType: 'Configuration Issue',
				description:
					'Container is running with privileged permissions and insecure capabilities.',
				image: 'ubuntu:20.04',
				imageTag: 'production',
				affectedResource: 'Container Runtime',
				remediation:
					'Remove privileged flag and use specific capabilities. Update Dockerfile:security_opt to include "no-new-privileges:true"',
			},
			{
				id: 'WIZ006',
				name: 'Database Credential Exposure',
				severity: 'CRITICAL',
				vulnerabilityType: 'Secrets Detection',
				description:
					'Database credentials and API keys detected in image layers as plaintext.',
				image: 'myapp:latest',
				imageTag: 'v1.0',
				affectedResource: 'Image Layers - env',
				remediation:
					'Use Docker secrets or environment variable management. Rebuild image without exposed credentials.',
			},
			{
				id: 'WIZ007',
				name: 'Malware Detected',
				severity: 'CRITICAL',
				vulnerabilityType: 'Malware Detection',
				description:
					'Suspicious binary pattern detected that matches known malware signatures.',
				image: 'suspect-image:v1',
				imageTag: 'latest',
				affectedResource: '/usr/local/bin/tool',
				remediation: 'Verify image source and rebuild from trusted base image',
			},
			{
				id: 'WIZ008',
				name: 'Container Runs as Root',
				severity: 'MEDIUM',
				vulnerabilityType: 'Security Best Practice',
				description:
					"Container's default USER is not set, running as root with full privileges.",
				image: 'nginx:latest',
				imageTag: 'v1.0',
				affectedResource: 'Dockerfile Configuration',
				remediation:
					'Add USER directive to Dockerfile to run the application with non-root user permissions',
			},
		];
	}
}
