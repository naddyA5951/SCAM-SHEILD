export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScamSignal {
  category: 'IMPERSONATION' | 'FINANCIAL_TRAP' | 'SUSPICIOUS_DOMAIN' | 'UNREALISTIC_OFFER' | 'PRESSURE_URGENCY' | 'COMMUNICATION_ANOMALY';
  title: string;
  description: string;
  severity: ThreatLevel;
  quote?: string;
}

export interface DomainAnalysis {
  domain: string;
  isLookalike: boolean;
  targetBrand?: string;
  tldRisk: 'SAFE' | 'QUESTIONABLE' | 'SUSPICIOUS';
  ageEstimate?: string;
  similarityScore?: number;
  suspiciousCharacteristics: string[];
}

export interface FinancialCheck {
  hasPaymentRequest: boolean;
  hasChequeOverpaymentTrap: boolean;
  hasEquipmentDepositFee: boolean;
  hasCryptoRequirement: boolean;
  requestedAmount?: string;
  paymentMethods: string[];
}

export interface RecommendedAction {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  title: string;
  detail: string;
  actionText?: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  targetType: 'TEXT' | 'URL' | 'DOCUMENT';
  targetSummary: string;
  scamScore: number; // 0 to 100
  threatLevel: ThreatLevel;
  verdictTitle: string;
  verdictSummary: string;
  signals: ScamSignal[];
  domainAnalysis?: DomainAnalysis;
  financialCheck: FinancialCheck;
  recommendedActions: RecommendedAction[];
  rawAnalysisNotes?: string[];
  safeNextSteps: string[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  targetType: 'TEXT' | 'URL' | 'DOCUMENT';
  previewText: string;
  scamScore: number;
  threatLevel: ThreatLevel;
  signalsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
  joinedAt: number;
}