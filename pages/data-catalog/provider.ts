import { CatalogProvider, Dimension, ElementNode, Property } from './types';

const mockProperties: Record<string, Property[]> = {
  'dev-1': [
    {
      id: 'p1',
      name: '温度',
      path: 'root.bj.ws1.dev1.temp',
      valueType: 'DOUBLE',
      referenceType: '时序数据',
      displayValue: '45.5 °C',
      defaultValue: '0',
      flags: { constant: false, excluded: false, hidden: false },
      limits: { high: 80, low: -10 },
      prediction: {
        algorithm: 'ARIMA',
        covariables: ['压力', '转速'],
        samplingInterval: '1m',
        historical: '7d',
        future: '1h',
        confidence: 0.95
      },
      additionalProperties: { '传感器型号': 'PT100' }
    },
    {
      id: 'p2',
      name: '设备手册',
      path: 'root.bj.ws1.dev1.manual',
      valueType: 'FILE',
      referenceType: '静态属性',
      displayValue: 'manual.pdf',
      flags: { constant: true, excluded: false, hidden: false },
      isFile: true,
      fileUrl: '#'
    }
  ]
};

const generateMockChildren = (count: number, parentPath: string): ElementNode[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-child-${i}`,
    label: `设备 ${i + 1}`,
    type: 'DEVICE',
    path: `${parentPath}.dev${i + 1}`,
    category: i % 3 === 0 ? '关键设备' : '辅助设备',
    template: i % 2 === 0 ? 'CNC标准模板' : '通用设备模板',
    description: `自动生成的模拟设备数据 ${i + 1}`,
    location: { '工位': `A-${i}` },
    additionalProperties: { '维保周期': '30天', '生产商': 'ABC公司' },
    defaultProperties: '温度, 压力',
    isFavorite: false,
    children: []
  }));
};

const mockTreeDataPhysical: ElementNode[] = [
  {
    id: 'root-1',
    label: '北京一厂',
    type: 'ROOT',
    path: 'root.bj',
    category: '生产基地',
    description: '华北地区主要生产基地',
    stats: {
      totalElements: 1250,
      totalProperties: 5600,
      totalTimeSeries: 3200,
      totalAnalysis: 45
    },
    children: [
      {
        id: 'ws-1',
        label: '装配车间 A',
        type: 'WORKSHOP',
        path: 'root.bj.ws1',
        category: '核心车间',
        template: '标准车间模板',
        location: { '经度': '116.40', '纬度': '39.90' },
        additionalProperties: { '负责人': '王总' },
        children: [
          {
            id: 'dev-1',
            label: '数控机床 01',
            type: 'DEVICE',
            path: 'root.bj.ws1.dev1',
            category: '关键设备',
            template: 'CNC标准模板',
            description: '主轴转速监控设备',
            location: { '工位': 'A-01' },
            additionalProperties: { '维保周期': '30天', '生产商': 'ABC公司' },
            defaultProperties: '温度, 压力',
            isFavorite: true
          },
          ...generateMockChildren(25, 'root.bj.ws1')
        ]
      }
    ]
  }
];

const mockTreeDataFunction: ElementNode[] = [
  {
    id: 'root-func-1',
    label: '生产管理系统',
    type: 'ROOT',
    path: 'root.mes',
    category: '业务系统',
    description: '制造执行系统数据',
    stats: {
      totalElements: 800,
      totalProperties: 3200,
      totalTimeSeries: 1500,
      totalAnalysis: 20
    },
    children: [
      {
        id: 'func-1',
        label: '订单追踪',
        type: 'WORKSHOP',
        path: 'root.mes.order',
        category: '功能模块',
        children: []
      }
    ]
  }
];

const mockTreeDataAsset: ElementNode[] = [
  {
    id: 'root-asset-1',
    label: '固定资产库',
    type: 'ROOT',
    path: 'root.asset',
    category: '资产管理',
    description: '企业固定资产台账',
    stats: {
      totalElements: 5000,
      totalProperties: 15000,
      totalTimeSeries: 0,
      totalAnalysis: 10
    },
    children: [
      {
        id: 'asset-1',
        label: '生产设备类',
        type: 'WORKSHOP',
        path: 'root.asset.equipment',
        category: '资产分类',
        children: []
      }
    ]
  }
];

export const mockCatalogProvider: CatalogProvider = {
  getTree: async (dimension: Dimension) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (dimension === 'PHYSICAL') resolve(mockTreeDataPhysical);
        else if (dimension === 'FUNCTION') resolve(mockTreeDataFunction);
        else resolve(mockTreeDataAsset);
      }, 500);
    });
  },
  getProperties: async (nodeId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProperties[nodeId] || []);
      }, 200);
    });
  }
};
