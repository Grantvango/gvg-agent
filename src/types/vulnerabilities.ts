export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface ScanResult {
	scanId: string;
	scanner: 'veracode' | 'snyk' | 'wiz';
	timestamp: number;
	duration: number;
	status: 'completed' | 'in_progress' | 'failed';
	vulnerabilities: Vulnerability[];
	summary: {
		total: number;
		critical: number;
		high: number;
		medium: number;
		low: number;
	};
}

export interface Vulnerability {
	id: string;
	title: string;
	description: string;
	severity: SeverityLevel;
	cwe?: string;
	cveId?: string;
	filePath?: string;
	lineNumber?: number;
	code?: string;
	recommendation?: string;
	references?: string[];
	ignored: boolean;
	scanner: 'veracode' | 'snyk' | 'wiz';
	rawData: any;
}

export interface VeracodeVulnerability {
	issue_id: string;
	issue_type: string;
	severity: number; // 1-5
	category_name: string;
	description: string;
	remediation_status: string;
	affected_component?: string;
	file_name?: string;
	line_number?: number;
	cwe_id?: string;
	owasp_top_10?: string;
}

export interface SnykVulnerability {
	id: string;
	title: string;
	severity: 'critical' | 'high' | 'medium' | 'low';
	type: string;
	description: string;
	identifiers?: {
		CVE?: string[];
		CWE?: string[];
	};
	packageName: string;
	packageVersion: string;
	from: string[];
	fixedIn?: string[];
	remediation?: string;
}

export interface WizVulnerability {
	id: string;
	name: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
	vulnerabilityType: string;
	description: string;
	image?: string;
	imageTag?: string;
	affectedResource: string;
	cve?: string;
	cvss?: number;
	remediation?: string;
}

export interface ScanConfig {
	veracode?: {
		enabled: boolean;
		apiId?: string;
		apiSecret?: string;
	};
	snyk?: {
		enabled: boolean;
		apiToken?: string;
	};
	wiz?: {
		enabled: boolean;
		clientId?: string;
		clientSecret?: string;
	};
}

export interface FixSuggestion {
	id: string;
	vulnerabilityId: string;
	type: 'code_change' | 'dependency_update' | 'configuration' | 'remediation';
	description: string;
	code?: string;
	file?: string;
	line?: number;
	copilotPrompt: string;
}
