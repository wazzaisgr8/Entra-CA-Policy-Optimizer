
export interface DashboardMetric {
  metric: string;
  status: string;
  assessment: string;
}

export interface Policy {
  policyId: string;
  name: string;
  users: string;
  apps: string;
  conditions: string;
  grantControl: string;
}

export type StressTestResult = 'BLOCKED' | 'ALLOWED' | 'MFA' | 'MFA / BLOCK';

export interface StressTest {
  scenario: string;
  result: StressTestResult;
  explanation: string;
}

export interface GeneratedPolicyResponse {
  summary: string;
  dashboard: DashboardMetric[];
  matrix: Policy[];
  stressTest: StressTest[];
}
