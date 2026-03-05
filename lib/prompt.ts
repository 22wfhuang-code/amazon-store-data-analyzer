// 未来你接入任意大模型时，用这个 prompt 作为“咨询报告格式”的约束。
// 目前项目默认不依赖外部 API：ai-report 使用本地规则生成（更适合先验证需求）。

export const DIAGNOSIS_PROMPT = `
You are an Amazon e-commerce data analyst.
Generate a professional store diagnosis report with:
1) Store Health Score (0-100)
2) Top 3 problems with reasons
3) Key metrics analysis: GMV, Profit Margin, Ad ROI, Conversion Rate, Inventory Turnover
4) 7-day action plan (actionable, non-generic).
`;
