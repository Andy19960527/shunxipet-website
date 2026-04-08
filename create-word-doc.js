import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import fs from 'fs';

// 翻译后的完整内容
const content = [
  // 标题
  new Paragraph({
    text: 'PSM 发货报告 - 中文翻译',
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400, before: 200 },
    children: [
      new TextRun({
        text: 'PSM 发货报告 - 中文翻译',
        bold: true,
        size: 36,
      })
    ]
  }),

  // A. 基本信息
  new Paragraph({
    text: 'A. 基本信息',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'A. 基本信息',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  createField('供应商名称:', 'Jinhua Solid Tools Co., Ltd.'),
  createField('工厂名称:', 'Jinhua Solid Tools Co., Ltd.'),
  createField('产品类别:', '-'),
  createField('批准样品:', '否'),
  createField('产品订单号:', '859427069/859427071/859427073/859427076/859427078/859427084'),
  createField('参考样品:', '是'),
  createField('产品编码 (SKU):', '5288556/5285695/5313179/5313182/5313595/5313596'),
  createField('联合抽样:', '否'),
  createField('检验日期:', '2025年12月22日'),
  createField('产品检验类型:', 'FRI (最终随机检验)'),
  createField('检验地点:', 'No. 11 柏林德路, 球滨工业园区, 金华市, 浙江省 321016, 中国'),
  createField('检验员姓名:', 'Shengjia t'),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // B. 检验总体结果
  new Paragraph({
    text: 'B. 检验总体结果摘要',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'B. 检验总体结果摘要',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  createField('检验结果:', '通过 ✓'),
  createField('等待决策:', '由客户决定'),
  createField('备注:', '无'),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // C. 工厂检查清单
  new Paragraph({
    text: 'C. 工厂 SIP 检查清单',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'C. 工厂 SIP 检查清单',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  createChecklist('产品规格', '✓ 通过'),
  createChecklist('最终测量规格 (服装/床上用品)', '✓ 通过'),
  createChecklist('PSM 订单号 (工厂订单号如需要)', '✓ 通过'),
  createChecklist('产前满足工具 (Pre-Production Meet Tool)', '✓ 通过'),
  createChecklist('产品标签 (Product Labels)', '✓ 通过'),
  createChecklist('最新产品测试报告', '✓ 通过 (报告日期: 2023年9月7日)'),
  createChecklist('黄色封样 (Yellow Seal Samples)', '✓ 通过'),
  createChecklist('装箱单 (Packing List)', '✓ 通过'),
  createChecklist('外箱标记和外箱标签', '✓ 通过'),
  createChecklist('零售包装批准 (Retail Packaging Approval)', '✓ 通过'),
  createChecklist('PetSmart DUPRO 检验报告和 CAPs', '✓ 通过'),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // D. 生产状态
  new Paragraph({
    text: 'D. 生产状态 (每步骤20件)',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'D. 生产状态 (每步骤20件)',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: 'Step 1 - 注塑工艺 (Injection Processing):\n', bold: true }),
      new TextRun({ text: '  处理人员: -\n  发现问题: -\n  解决方案: -\n' })
    ]
  }),

  new Paragraph({ spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: 'Step 2 - 组装工艺 (Assembly Processing):\n', bold: true }),
      new TextRun({ text: '  处理人员: -\n  发现问题: -\n  解决方案: -\n' })
    ]
  }),

  new Paragraph({ spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: 'Step 3 - 包装工艺 (Packing Processing):\n', bold: true }),
      new TextRun({ text: '  处理人员: -\n  发现问题: -\n  解决方案: -\n' })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // E. 数量统计
  new Paragraph({
    text: 'E. 数量统计',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'E. 数量统计',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({
        text: '产品编码    订单数量    已包装数量    完成率    未包装数量    未完成数量\n' +
              '---------------------------------------------------------------------------\n',
        font: 'SimSun',
        size: 20,
      })
    ]
  }),

  new Paragraph({ children: [new TextRun({ text: '5285695     1,824       1,824         100%      0             0\n', font: 'SimSun', size: 20 })] }),
  new Paragraph({ children: [new TextRun({ text: '5313179     2,520       2,520         100%      0             0\n', font: 'SimSun', size: 20 })] }),
  new Paragraph({ children: [new TextRun({ text: '5313182     1,872       1,872         100%      0             0\n', font: 'SimSun', size: 20 })] }),
  new Paragraph({ children: [new TextRun({ text: '5313596     1,536       1,536         100%      0             0\n', font: 'SimSun', size: 20 })] }),
  new Paragraph({ children: [new TextRun({ text: '5288556     2,184       2,184         100%      0             0\n', font: 'SimSun', size: 20 })] }),
  new Paragraph({ children: [new TextRun({ text: '5313595       600         600           100%      0             0\n', font: 'SimSun', size: 20 })] }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({
        text: '---------------------------------------------------------------------------\n' +
              '总计        10,536      10,536        100%      0             0',
        font: 'SimSun',
        size: 20,
        bold: true,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // F. 质量检验
  new Paragraph({
    text: 'F. 工艺质量检验 (基本运行和外观)',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'F. 工艺质量检验 (基本运行和外观)',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  createField('检验标准:', 'ANSI/ASQ Z1.4 (原称 MIL-STD-105E)'),
  createField('检验等级:', 'II (工艺质量/外观)'),
  createField('抽样计划:', '单次/正常 (Single / Normal)'),
  createField('样本量:', '315件'),
  createField('AQL - 严重缺陷:', '不允许'),
  createField('AQL - 主要缺陷:', '2.5'),
  createField('AQL - 次要缺陷:', '-'),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: '缺陷记录:\n', bold: true }),
      new TextRun({ text: '1. SKU: 5313179 表面橡胶涂层划伤 (Surface rubber coating scratch)\n' }),
      new TextRun({ text: '   主要缺陷: 2件\n' })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: '总计发现缺陷数:\n', bold: true }),
      new TextRun({ text: '  严重缺陷: 0件\n' }),
      new TextRun({ text: '  主要缺陷: 2件\n' }),
      new TextRun({ text: '  次要缺陷: 0件\n' }),
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({
        text: '检验结果: ✓ 通过',
        bold: true,
        size: 24,
        color: '008000',
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // G. 现场测试
  new Paragraph({
    text: 'G. 现场测试',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'G. 现场测试',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  createField('测试 1 - 产品尺寸和重量测量:', '✓ 通过', '样本量: 每项3件'),
  createField('测试 2 - 运行测试:', '✓ 通过', '样本量: 每项3件'),
  createField('测试 3 - 拉力测试 (Tension Test):', '✓ 通过', '样本量: 每SKU 1件'),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({
        text: '各SKU拉力测试结果:\n' +
              '产品编码    拉力测试结果\n' +
              '-------------------------\n',
        bold: true,
      })
    ]
  }),

  new Paragraph({ children: [new TextRun({ text: '5313595     559 lbf\n' })] }),
  new Paragraph({ children: [new TextRun({ text: '5313182     373 lbf\n' })] }),
  new Paragraph({ children: [new TextRun({ text: '5285695     203 lbf\n' })] }),
  new Paragraph({ children: [new TextRun({ text: '5313179     310 lbf\n' })] }),
  new Paragraph({ children: [new TextRun({ text: '5288556     207 lbf\n' })] }),
  new Paragraph({ children: [new TextRun({ text: '5313596     431 lbf\n' })] }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // H. 照片说明
  new Paragraph({
    text: 'H. 照片说明 (共64张)',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: 'H. 照片说明 (共64张)',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: 'Photo 1-2:   堆放货物\n' }),
      new TextRun({ text: 'Photo 3-12:  SKU: 5313595 (10张)\n' }),
      new TextRun({ text: 'Photo 13-22: SKU: 5313182 (10张)\n' }),
      new TextRun({ text: 'Photo 23-32: SKU: 5285695 (10张)\n' }),
      new TextRun({ text: 'Photo 33-42: SKU: 5313179 (10张)\n' }),
      new TextRun({ text: 'Photo 43-52: SKU: 5288556 (10张)\n' }),
      new TextRun({ text: 'Photo 53-62: SKU: 5313596 (10张)\n' }),
      new TextRun({ text: 'Photo 63:    有效期验证报告\n' }),
      new TextRun({ text: 'Photo 64:    缺陷特写\n' }),
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // 签名
  new Paragraph({
    text: '签名信息',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: '签名信息',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: '供应商/工厂质检签名 (Vendor/Factory QC Signature):\n', bold: true }),
      new TextRun({ text: 'Sheng.Jia\n' })
    ]
  }),

  new Paragraph({ spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({ text: '供应商/工厂质量经理签名 (Vendor/Factory QA Mgr Signature):\n', bold: true }),
      new TextRun({ text: 'Xia.Libin\n' })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  // 翻译说明
  new Paragraph({
    text: '翻译说明',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: '翻译说明',
        bold: true,
        size: 28,
      })
    ]
  }),

  new Paragraph({ text: '', spacing: { after: 100 } }),

  new Paragraph({
    children: [
      new TextRun({
        text: '本文档为自动翻译版本，翻译了基本的商业和质量检验术语。\n' +
              '保留了产品编码、数量、技术数据等原始信息以确保准确性。\n\n' +
              '译者: 自动翻译系统\n' +
              '日期: 2026-04-08',
        size: 20,
        color: '666666',
      })
    ]
  }),
];

// 创建字段段落
function createField(label, value, extra = '') {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 22 }),
      new TextRun({ text: ` ${value}`, size: 22 }),
      extra ? new TextRun({ text: ` (${extra})`, size: 20, color: '666666' }) : new TextRun({ text: '' }),
    ],
    spacing: { after: 100 },
  });
}

// 创建检查清单段落
function createChecklist(item, status) {
  return new Paragraph({
    children: [
      new TextRun({ text: '✓ ', bold: true, color: '008000' }),
      new TextRun({ text: `${item}\n`, size: 22 }),
      new TextRun({ text: `  状态: ${status}\n`, size: 20, color: '008000' }),
    ],
    spacing: { after: 100 },
  });
}

// 创建文档
const doc = new Document({
  sections: [{
    properties: {},
    children: content,
  }],
});

// 保存文件
async function createDocx() {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('/workspace/projects/public/PSM中文发货报告.docx', buffer);
  console.log('Word document created successfully!');
}

createDocx().catch(console.error);
