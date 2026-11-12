export interface ProjectSkillScore {
  dimension: string;
  shortLabel: string;
  score: number; // 0 to 100
  fiveScale: number; // 0 to 5
  summary: string;
}

export interface AIFinding {
  id: string;
  type: 'Strength' | 'Concern' | 'Gap';
  dimension: string;
  title: string;
  description: string;
  filePath: string;
  lineRange: string;
  excerpt: string[];
}

export interface ArchitectureNode {
  id: string;
  name: string;
  layer: 'api' | 'service' | 'concurrency' | 'data' | 'config';
  x: number;
  y: number;
  connections: string[];
  edgesCount: number;
  summary: string;
}

export interface AnalyzedProject {
  id: string;
  dossierId: string;
  name: string;
  repoUrl: string;
  language: string;
  levelBadge: string;
  grade: string;
  globalPercentile: string;
  overallScore: number;
  stack: string[];
  lastCommit: string;
  commitHash: string;
  filesCount: number;
  modulesCount: number;
  edgesCount: number;
  skills: ProjectSkillScore[];
  findings: AIFinding[];
  graphNodes: ArchitectureNode[];
}

export interface IngestionStep {
  id: string;
  number: string;
  label: string;
  detail: string;
}
