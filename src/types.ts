export type RiskLevel = 
  | 'Low Risk'
  | 'Mild Risk'
  | 'Moderate Risk'
  | 'High Risk'
  | 'Very High Risk';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type ThreatCategory = 
  | 'payment' 
  | 'urgency' 
  | 'identity' 
  | 'communication' 
  | 'compensation';

export interface RedFlag {
  id: string;
  title: string;
  severity: Severity;
  category: ThreatCategory;
  evidence: string;
  explanation: string;
}

export interface PositiveSignal {
  id: string;
  title: string;
  evidence: string;
  explanation: string;
}

export interface DomainIntelligence {
  url: string;
  domain: string;
  isHttps: boolean;
  protocol: string;
  tld: string;
  isSuspiciousTld: boolean;
  isIpHost: boolean;
  subdomainCount: number;
  brandMismatch: boolean;
  targetedBrand?: string;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  heuristicNotes: string[];
}

export interface ThreatBreakdown {
  paymentRisk: number;       // 0-100
  identitySpoofing: number;  // 0-100
  pressureUrgency: number;   // 0-100
  unrealisticTerms: number;  // 0-100
}

export interface ScanResult {
  id: string;
  timestamp: number;
  scanType: 'text' | 'url';
  inputSnippet: string;
  score: number;             // 0 - 100
  riskLevel: RiskLevel;
  summary: string;
  redFlags: RedFlag[];
  positiveSignals: PositiveSignal[];
  domainIntelligence?: DomainIntelligence;
  breakdown: ThreatBreakdown;
  recommendations: string[];
  engine: string;
}

export interface ScanRequest {
  type: 'text' | 'url';
  content: string;
}
