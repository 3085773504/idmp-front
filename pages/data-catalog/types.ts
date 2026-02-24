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
  stats?: {
    totalElements: number;
    totalProperties: number;
    totalTimeSeries: number;
    totalAnalysis: number;
  };
  children?: ElementNode[];
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
}

export interface CatalogProvider {
  getTree: (dimension: Dimension) => Promise<ElementNode[]>;
  getProperties: (nodeId: string) => Promise<Property[]>;
}
