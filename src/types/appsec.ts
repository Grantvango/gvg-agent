/**
 * AppSec Agent Type Definitions
 */

export interface SecurityTool {
	id: string;
	name: string;
	description: string;
	category: ToolCategory;
	isAvailable: boolean;
	config?: Record<string, unknown>;
}

export enum ToolCategory {
	SAST = 'SAST',
	DAST = 'DAST',
	SCA = 'SCA',
	SECRETS = 'SECRETS',
	CONTAINER = 'CONTAINER',
	IAC = 'IAC',
	CLOUD = 'CLOUD',
	API = 'API',
	OTHER = 'OTHER',
}

export interface SecurityFinding {
	id: string;
	toolId: string;
	title: string;
	description: string;
	severity: Severity;
	cwe?: string;
	owasp?: string;
	file?: string;
	line?: number;
	remediation?: string;
	businessScore: number;
	timestamp: number;
}

export enum Severity {
	CRITICAL = 'CRITICAL',
	HIGH = 'HIGH',
	MEDIUM = 'MEDIUM',
	LOW = 'LOW',
	INFO = 'INFO',
}

export interface BusinessContext {
	projectName: string;
	businessImpactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	assetValue: number; // relative score 1-10
	dataClassification: 'CONFIDENTIAL' | 'INTERNAL' | 'PUBLIC';
	complianceRequirements: string[];
	slaBreach?: boolean;
}

export interface BusinessContextScore {
	finding: SecurityFinding;
	businessContext: BusinessContext;
	riskScore: number; // 0-100, adjusted for business context
	recommendedAction: string;
	urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ToolTriggerRequest {
	toolId: string;
	targetPath?: string;
	autoFix?: boolean;
	businessContext?: BusinessContext;
}

export interface ToolExecutionResult {
	toolId: string;
	success: boolean;
	findings: SecurityFinding[];
	executionTime: number;
	error?: string;
	businessContextScores?: BusinessContextScore[];
}

export interface AgentAction {
	id: string;
	name: string;
	description: string;
	execute: () => Promise<void>;
}
