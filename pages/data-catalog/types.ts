import { TreeNode } from '../../components/ui/Tree';

export type Dimension = 'PHYSICAL' | 'FUNCTION' | 'ASSET';
export type ElementType = 'ROOT' | 'FACTORY' | 'WORKSHOP' | 'LINE' | 'DEVICE' | 'SENSOR';
export type ViewState = 'LOADING' | 'ERROR' | 'ROOT_OVERVIEW' | 'ELEMENT_DETAIL' | 'PROPERTY_DETAIL' | 'EMPTY';

export interface ElementNode extends TreeNode {
  type: ElementType;
  path: string;
  template?: string;
  category?: string;
  description?: string;
  location?: Record<string, string>;
  additionalProperties?: Record<string, string>;
  defaultProperties?: string;
  isFavorite?: boolean;
  isTemplate?: boolean;
  stats?: {
    totalElements: number;
    totalProperties: number;
    totalTimeSeries: number;
    totalAnalysis: number;
  };
  children?: ElementNode[];
  
  // New fields for P0/P1 features
  dataSourceBinding?: {
    type: 'IoTDB' | 'InfluxDB';
    sourcePath: string;
    status: 'BOUND' | 'UNBOUND' | 'ERROR';
  };
  referenceType?: 'DIRECT' | 'CROSS_DIMENSION';
  referenceSource?: string;
  relations?: {
    upstream: string[];
    downstream: string[];
    impactCount: number;
  };
  info?: {
    documents: { name: string; url: string }[];
    notes: string;
    security: { level: string; lastAudit: string; encrypted: boolean };
    history: { version: string; date: string }[];
  };
  templateAppliedAt?: string;
}

export interface Property {
  id: string;
  name: string;
  path: string;
  valueType: string;
  length?: number;
  referenceType: string;
  displayValue?: string;
  defaultValue?: string;
  flags: {
    constant: boolean;
    excluded: boolean;
    hidden: boolean;
  };
  limits?: {
    high?: number;
    low?: number;
  };
  prediction?: {
    algorithm: string;
    covariables: string[];
    samplingInterval: string;
    historical: string;
    future: string;
    confidence: number;
  };
  additionalProperties?: Record<string, string>;
  isFile?: boolean;
  fileUrl?: string;

  // New fields for P0/P1 features
  propertyType?: 'INDICATOR' | 'TAG' | 'FORMULA';
  unit?: string;
  formula?: string;
  sourcePath?: string;
  unitConversionStrategy?: string;
  formulaResult?: string;
}

export interface CatalogProvider {
  getTree: (dimension: Dimension) => Promise<ElementNode[]>;
  getProperties: (nodeId: string) => Promise<Property[]>;
}
