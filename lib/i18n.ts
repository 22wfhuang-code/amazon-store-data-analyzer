// lib/i18n.ts
export type Lang = "zh" | "en";
export const LANG_COOKIE = "lang";
export const LANG_STORAGE_KEY = "lang";

export const copy = {
  zh: {
    appName: "Amazon 店铺数据分析器",
    navHome: "首页",
    navUpload: "上传数据",

    heroTitle1: "上传亚马逊数据",
    heroTitle2: "系统自动告诉你为什么亏钱",
    heroTitle3: "并给出7天优化方案",
    heroDesc:
      "自动计算 GMV、广告 ROI、转化率、利润率、库存周转，并生成可执行的 7 天优化清单。",

    btnTryDemo: "使用示例数据体验",
    btnUpload: "上传我的数据",

    whatTitle: "它会分析什么？以及你该怎么用？",
    privacyTitle: "隐私说明",
    privacyDesc: "数据仅用于本次分析；默认不做服务器持久化存储（你可后续再加）。",

    uploadTitle: "上传数据",
    uploadDesc:
      "支持 CSV / Excel（.xlsx）。建议包含列：orders / gmv / ads_cost / sessions / profit（可选）。",
    btnChooseFile: "选择文件",
    btnAnalyze: "开始分析",
    analyzing: "分析中…",
    demoTip: "没有数据？直接点示例体验。",

    reportTitle: "诊断报告",
    metrics: "关键指标",
    conclusion: "诊断结论（规则）",
    plan: "7 天优化清单",
    back: "返回上传页",
    home: "首页",
    reupload: "重新上传",

    debugTitle: "技术信息（Debug）",
    debugTip: "仅用于开发排查，生产环境不会展示。",
    show: "展开",
    hide: "收起",

    // 指标解释（用在首页卡片）
    k_gmv: "GMV（成交额）",
    k_gmv_rule: "GMV 下降：优先排查流量与转化。",
    k_gmv_do: ["看 sessions 是否下降", "看 CR 是否偏低", "检查广告/关键词是否被砍掉"],

    k_roi: "广告 ROI",
    k_roi_rule: "ROI < 2：烧钱；2-4：正常；>4：可加预算。",
    k_roi_do: ["暂停 ROI<1 的广告组/词", "ROI>3 的词加预算 10%-20%", "分离品牌词/泛词，避免互抢"],

    k_cr: "转化率（CR）",
    k_cr_rule: "CR < 2%：偏低，优先做 Listing。",
    k_cr_do: ["主图做 AB 测试（对标竞品）", "标题前 80 字讲清卖点", "价格/优惠券做 48h 小实验"],

    k_margin: "利润率",
    k_margin_rule: "利润率为负：先核对 COGS/广告/退货/佣金。",
    k_margin_do: ["核对 COGS 是否写高", "广告占比是否过高", "是否频繁退货导致利润被吃掉"],

    k_inv: "库存周转",
    k_inv_rule: "周转低：说明压货；周转高：可能断货风险。",
    k_inv_do: ["低周转 SKU 清仓或降价", "高周转 SKU 提前备货", "把补货周期写成规则提醒"],
  },

  en: {
    appName: "Amazon Store Analyzer",
    navHome: "Home",
    navUpload: "Upload",

    heroTitle1: "Upload Amazon data",
    heroTitle2: "We tell you why you lose money",
    heroTitle3: "and give a 7-day action plan",
    heroDesc:
      "Calculates GMV, Ad ROI, Conversion Rate, Profit Margin, and Inventory Turnover, then outputs an actionable 7-day plan.",

    btnTryDemo: "Try demo data",
    btnUpload: "Upload my data",

    whatTitle: "What it analyzes (and how to use it)",
    privacyTitle: "Privacy",
    privacyDesc: "Data is used only for this analysis; no persistence by default (you can add later).",

    uploadTitle: "Upload data",
    uploadDesc:
      "Supports CSV / Excel (.xlsx). Recommended columns: orders / gmv / ads_cost / sessions / profit (optional).",
    btnChooseFile: "Choose file",
    btnAnalyze: "Analyze",
    analyzing: "Analyzing…",
    demoTip: "No data? Try demo.",

    reportTitle: "Store Diagnosis Report",
    metrics: "Key Metrics",
    conclusion: "Diagnosis (rules)",
    plan: "7-Day Action Plan",
    back: "Back to upload",
    home: "Home",
    reupload: "Re-upload",

    debugTitle: "Technical Info (Debug)",
    debugTip: "Dev-only. Never shown in production.",
    show: "Show",
    hide: "Hide",

    k_gmv: "GMV",
    k_gmv_rule: "If GMV drops: check traffic and conversion first.",
    k_gmv_do: ["Check if sessions dropped", "Check if CR is low", "Verify ads/keywords changes"],

    k_roi: "Ad ROI",
    k_roi_rule: "ROI < 2: losing; 2–4: ok; >4: scale.",
    k_roi_do: ["Pause ad groups/keywords with ROI<1", "Increase budget 10–20% for ROI>3", "Separate brand vs generic"],

    k_cr: "Conversion Rate (CR)",
    k_cr_rule: "CR < 2%: low. Fix listing first.",
    k_cr_do: ["A/B test main image vs competitors", "Improve first 80 chars of title", "Run a 48h price/coupon test"],

    k_margin: "Profit Margin",
    k_margin_rule: "Negative margin: verify COGS/ads/returns/fees.",
    k_margin_do: ["Verify COGS", "Check ad cost share", "Check returns eating profit"],

    k_inv: "Inventory Turnover",
    k_inv_rule: "Low turnover: overstock; high turnover: stockout risk.",
    k_inv_do: ["Clear slow SKUs", "Replenish fast SKUs earlier", "Set replenishment reminders"],
  },
} as const;

export function normalizeLang(v: any): Lang {
  return v === "en" ? "en" : "zh";
}

// Client-side helpers
export function getLangClient(): Lang {
  if (typeof window === "undefined") return "zh";
  const fromStorage = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (fromStorage === "en" || fromStorage === "zh") return fromStorage;
  return "zh";
}

export function setLangClient(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

}


// lib/i18n.ts 末尾追加（不要删你原来的内容）

// 读取 cookie（client）
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : undefined;
}

// 给页面用的“当前语言文案对象”
// 你页面里写的是：import t from "@/lib/i18n";
// 所以这里必须 default export 一个对象
export default function getCopy() {
  const lang = normalizeLang(
    typeof window === "undefined"
      ? "zh"
      : window.localStorage.getItem(LANG_STORAGE_KEY) || getCookie(LANG_COOKIE) || "zh"
  );

  // 返回 copy.zh 或 copy.en 这类对象
  return copy[lang];
}
