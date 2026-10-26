import type { DocsPageInfo } from "@hast/docs";
import type { AppLocale } from "@/i18n/config";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

export const docsPages: DocsPageInfo[] = [
  {
    "slug": "overview",
    "title": "认识 Hast",
    "description": "了解 Hast AIP、Hast Agent、Hast GTM，以及 FDE 团队的交付方式。",
    "group": "开始使用",
    "toc": [
      {
        "id": "platform",
        "title": "Hast AIP：支持 FDE 交付的平台"
      },
      {
        "id": "products",
        "title": "两个产品子模块"
      },
      {
        "id": "fde",
        "title": "FDE：与客户共同交付的团队"
      },
      {
        "id": "first-use",
        "title": "从哪里开始"
      },
      {
        "id": "integration",
        "title": "通过程序接入"
      }
    ]
  },
  {
    "slug": "aip-overview",
    "title": "AIP 产品介绍",
    "description": "了解 FDE 交付平台的定位，以及 Agent 工作台如何支持业务接入。",
    "group": "AIP",
    "toc": [
      {
        "id": "uses",
        "title": "适合哪些交付场景"
      },
      {
        "id": "capabilities",
        "title": "工作台提供什么"
      },
      {
        "id": "concepts",
        "title": "先认识几个概念"
      },
      {
        "id": "workflow",
        "title": "配置与交付流程"
      },
      {
        "id": "state",
        "title": "启用状态与运行状态"
      },
      {
        "id": "delivery",
        "title": "与 FDE 一起推进上线"
      }
    ]
  },
  {
    "slug": "aip-quickstart",
    "title": "创建第一个 Agent",
    "description": "用一个不依赖外部服务的例子，完成配置、保存和调试。",
    "group": "AIP",
    "toc": [
      {
        "id": "prepare",
        "title": "开始前"
      },
      {
        "id": "create",
        "title": "创建并保存"
      },
      {
        "id": "test",
        "title": "发送测试消息"
      },
      {
        "id": "next",
        "title": "接下来"
      }
    ]
  },
  {
    "slug": "aip-agents",
    "title": "配置与管理 Agent",
    "description": "设置职责、模型和能力，维护当前生效的配置。",
    "group": "AIP",
    "toc": [
      {
        "id": "edit",
        "title": "编辑配置"
      },
      {
        "id": "save",
        "title": "保存与协作"
      },
      {
        "id": "disable",
        "title": "停用和删除"
      },
      {
        "id": "related",
        "title": "相关操作"
      }
    ]
  },
  {
    "slug": "aip-skills",
    "title": "管理 Skills",
    "description": "编写、导入和选择 Agent 使用的技能文件。",
    "group": "AIP",
    "toc": [
      {
        "id": "create",
        "title": "创建技能"
      },
      {
        "id": "import",
        "title": "导入已有技能"
      },
      {
        "id": "maintain",
        "title": "编辑、停用与删除"
      }
    ]
  },
  {
    "slug": "aip-knowledge",
    "title": "添加知识库",
    "description": "组合网址、文件和 Drive 来源，维护知识库成员、索引与编译内容。",
    "group": "AIP",
    "toc": [
      {
        "id": "create",
        "title": "添加资料"
      },
      {
        "id": "use",
        "title": "在 Agent 中使用"
      },
      {
        "id": "update",
        "title": "资料变化后怎么办"
      }
    ]
  },
  {
    "slug": "aip-secrets",
    "title": "管理机密",
    "description": "保存凭证并绑定到 Agent，避免在配置示例中写入真实值。",
    "group": "AIP",
    "toc": [
      {
        "id": "create",
        "title": "创建机密"
      },
      {
        "id": "bind",
        "title": "在 Agent 中绑定"
      },
      {
        "id": "rotate",
        "title": "更新和删除"
      }
    ]
  },
  {
    "slug": "aip-tools",
    "title": "连接业务工具",
    "description": "让 Agent 调用已有 HTTP 服务，并明确参数和认证方式。",
    "group": "AIP",
    "toc": [
      {
        "id": "choose",
        "title": "选择工具类型"
      },
      {
        "id": "http",
        "title": "配置 HTTP 动态工具"
      },
      {
        "id": "proxy",
        "title": "配置 HTTP 代理"
      },
      {
        "id": "troubleshoot",
        "title": "调用失败时检查"
      }
    ]
  },
  {
    "slug": "aip-memory",
    "title": "设置长期记忆",
    "description": "决定 Agent 能读取哪些记忆，以及新记忆写到哪里。",
    "group": "AIP",
    "toc": [
      {
        "id": "enable",
        "title": "启用记忆能力"
      },
      {
        "id": "scope",
        "title": "选择记忆范围"
      },
      {
        "id": "manage",
        "title": "维护记忆条目"
      }
    ]
  },
  {
    "slug": "aip-debug",
    "title": "调试 Agent",
    "description": "测试保存后的配置，检查连续对话和工具结果。",
    "group": "AIP",
    "toc": [
      {
        "id": "start",
        "title": "开始调试"
      },
      {
        "id": "check",
        "title": "检查结果"
      },
      {
        "id": "stop",
        "title": "停止与重连"
      },
      {
        "id": "errors",
        "title": "常见情况"
      }
    ]
  },
  {
    "slug": "aip-config-transfer",
    "title": "导入、导出与复制",
    "description": "复用配置，并在迁移后重新检查资源和凭证。",
    "group": "AIP",
    "toc": [
      {
        "id": "import",
        "title": "导入配置"
      },
      {
        "id": "copy",
        "title": "复制已有 Agent"
      },
      {
        "id": "export",
        "title": "导出与交接"
      }
    ]
  },
  {
    "slug": "aip-api",
    "title": "Webhook HTTP 接入",
    "description": "从服务端调用 Agent，继续对话、读取回复并停止生成。",
    "group": "AIP",
    "toc": [
      {
        "id": "auth",
        "title": "准备调用地址"
      },
      {
        "id": "first",
        "title": "发送首条消息"
      },
      {
        "id": "stream",
        "title": "接收流式回复"
      },
      {
        "id": "continue",
        "title": "继续对话"
      },
      {
        "id": "stop",
        "title": "停止生成"
      },
      {
        "id": "fields",
        "title": "请求字段速查"
      }
    ]
  },
  {
    "slug": "mcp",
    "title": "MCP 接入",
    "description": "连接外部 Agent 客户端，通过同一把 Public API Key 使用 AIP 工具。",
    "group": "AIP",
    "toc": [
      {
        "id": "prepare",
        "title": "准备密钥与权限"
      },
      {
        "id": "connect",
        "title": "配置 MCP 客户端"
      },
      {
        "id": "verify",
        "title": "验证连接并读取指南"
      },
      {
        "id": "wechat-accounts",
        "title": "获取微信客服账号"
      },
      {
        "id": "use",
        "title": "让 Agent 开始工作"
      },
      {
        "id": "results",
        "title": "理解结果与限制"
      },
      {
        "id": "troubleshoot",
        "title": "连接或调用失败时"
      }
    ]
  },
  {
    "slug": "aip-slack",
    "title": "接入 Slack",
    "description": "将 Agent 加入 Slack，在频道或私聊中提问、处理文件，与团队一起使用。",
    "subgroup": "渠道接入",
    "toc": [
      {
        "id": "prepare",
        "title": "开始前"
      },
      {
        "id": "create-app",
        "title": "创建 Slack App"
      },
      {
        "id": "install",
        "title": "安装到工作区"
      },
      {
        "id": "connect",
        "title": "在 AIP 创建渠道"
      },
      {
        "id": "events",
        "title": "验证回调并保存事件"
      },
      {
        "id": "test",
        "title": "选择 Agent 并测试"
      },
      {
        "id": "reply-rules",
        "title": "设置回复触发规则"
      },
      {
        "id": "operation-progress",
        "title": "显示操作进度"
      },
      {
        "id": "troubleshooting",
        "title": "常见问题"
      }
    ],
    "group": "AIP"
  },
  {
    "slug": "aip-whatsapp",
    "title": "接入 WhatsApp",
    "description": "让客户通过 WhatsApp 向 Agent 提问、发送文件并获取回复。",
    "subgroup": "渠道接入",
    "toc": [
      {
        "id": "prepare",
        "title": "开始前"
      },
      {
        "id": "account",
        "title": "准备账号授权"
      },
      {
        "id": "connect",
        "title": "在 AIP 创建渠道"
      },
      {
        "id": "webhook",
        "title": "配置消息回调"
      },
      {
        "id": "identifiers",
        "title": "保存账号信息"
      },
      {
        "id": "credentials",
        "title": "获取 Outbound API key"
      },
      {
        "id": "test",
        "title": "关联 Agent 并测试"
      },
      {
        "id": "app",
        "title": "已有 Meta 接入"
      },
      {
        "id": "troubleshooting",
        "title": "常见问题"
      }
    ],
    "group": "AIP"
  },
  {
    "slug": "aip-wechat-kf",
    "title": "接入企业微信（微信客服）",
    "description": "将 Agent 接入微信客服，在微信中解答客户问题。",
    "subgroup": "渠道接入",
    "toc": [
      {
        "id": "prepare",
        "title": "开始前"
      },
      {
        "id": "app",
        "title": "准备企业微信应用"
      },
      {
        "id": "callback-values",
        "title": "准备回调凭证"
      },
      {
        "id": "connect",
        "title": "在 AIP 创建渠道"
      },
      {
        "id": "domain",
        "title": "验证域名并添加可信 IP"
      },
      {
        "id": "callback",
        "title": "保存回调配置"
      },
      {
        "id": "authorize",
        "title": "授权微信客服账号"
      },
      {
        "id": "verify",
        "title": "完成 AIP 安装"
      },
      {
        "id": "test",
        "title": "用微信测试回复"
      },
      {
        "id": "troubleshooting",
        "title": "常见问题"
      }
    ],
    "group": "AIP"
  },
  {
    "slug": "aip-api-quickstart",
    "title": "API 入门",
    "description": "在 AIP 创建密钥，调用已保存的 Agent，读取回复并按权限访问业务资源。",
    "group": "AIP",
    "subgroup": "AIP API",
    "toc": [
      {
        "id": "prepare",
        "title": "准备地址与密钥"
      },
      {
        "id": "send",
        "title": "发送第一条任务"
      },
      {
        "id": "read",
        "title": "读取执行过程"
      },
      {
        "id": "profile",
        "title": "使用 Profile API key"
      },
      {
        "id": "next",
        "title": "继续接入"
      }
    ]
  },
  {
    "slug": "aip-api-events",
    "title": "会话事件与 SSE",
    "description": "轮询单 Agent 对话事件，或使用 Profile API key 连接普通任务的 SSE。",
    "group": "AIP",
    "subgroup": "AIP API",
    "toc": [
      {
        "id": "agent",
        "title": "读取单 Agent 对话事件"
      },
      {
        "id": "sse",
        "title": "连接事件流"
      },
      {
        "id": "frames",
        "title": "SSE 帧格式"
      },
      {
        "id": "reconnect",
        "title": "断线续读与回放"
      },
      {
        "id": "poll",
        "title": "通过 JSON 读取事件"
      },
      {
        "id": "envelope",
        "title": "Event v2 与事件类型"
      }
    ]
  },
  {
    "slug": "aip-api-reference",
    "title": "API 文档",
    "description": "查看 AIP 公开 API 的认证、Agent 对话和业务资源接口。",
    "group": "AIP",
    "subgroup": "AIP API",
    "toc": [
      {
        "id": "openapi",
        "title": "OpenAPI JSON"
      },
      {
        "id": "wechat-accounts",
        "title": "获取微信客服账号"
      }
    ]
  },
  {
    "slug": "task-overview",
    "title": "Task Agent 产品介绍",
    "description": "了解 Hast Agent 如何规划、执行并交付任务，持续使用文件、工具与业务背景。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "uses",
        "title": "适合哪些工作"
      },
      {
        "id": "workspace",
        "title": "在同一个工作区中持续推进"
      },
      {
        "id": "continuity",
        "title": "复用背景与安排重复工作"
      },
      {
        "id": "workflow",
        "title": "一次任务如何完成"
      },
      {
        "id": "api",
        "title": "程序接入"
      },
      {
        "id": "next",
        "title": "开始使用"
      }
    ]
  },
  {
    "slug": "task-quickstart",
    "title": "完成第一个任务",
    "description": "从需求描述开始，查看执行进展并检查最终结果。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "prepare",
        "title": "准备资料"
      },
      {
        "id": "prompt",
        "title": "提交任务"
      },
      {
        "id": "plan",
        "title": "查看执行进展"
      },
      {
        "id": "result",
        "title": "检查与下载"
      }
    ]
  },
  {
    "slug": "task-conversations",
    "title": "执行任务与管理对话",
    "description": "补充要求，停止当前执行，并管理历史对话。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "request",
        "title": "写清任务要求"
      },
      {
        "id": "execute",
        "title": "查看执行过程"
      },
      {
        "id": "stop",
        "title": "停止与继续"
      },
      {
        "id": "history",
        "title": "管理历史对话"
      }
    ]
  },
  {
    "slug": "task-files",
    "title": "上传、查看与下载文件",
    "description": "为任务提供输入资料，并保存执行产物。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "upload",
        "title": "上传输入文件"
      },
      {
        "id": "view",
        "title": "查看生成文件"
      },
      {
        "id": "download",
        "title": "下载结果"
      },
      {
        "id": "delete",
        "title": "删除文件"
      }
    ]
  },
  {
    "slug": "task-capabilities",
    "title": "连接器与设置能力",
    "description": "授权外部应用，并维护任务需要的长期上下文。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "connect",
        "title": "连接外部应用"
      },
      {
        "id": "memory",
        "title": "保存长期记忆"
      },
      {
        "id": "methods",
        "title": "使用产品内的技能"
      },
      {
        "id": "port-sharing",
        "title": "分享临时网页预览"
      },
      {
        "id": "account",
        "title": "连接自己的 Codex 账号"
      }
    ]
  },
  {
    "slug": "task-schedules",
    "title": "创建定时任务",
    "description": "配置周期、时区和任务要求，查看每次运行结果。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "create",
        "title": "创建时间表"
      },
      {
        "id": "cron",
        "title": "自定义 Cron"
      },
      {
        "id": "runs",
        "title": "查看运行结果"
      },
      {
        "id": "pause",
        "title": "暂停、恢复和删除"
      }
    ]
  },
  {
    "slug": "task-troubleshooting",
    "title": "Task Agent 常见问题",
    "description": "按当前状态检查权限、连接、任务和文件。",
    "group": "Task Agent",
    "toc": [
      {
        "id": "questions",
        "title": "常见问题"
      },
      {
        "id": "support",
        "title": "提交问题时提供什么"
      }
    ]
  },
  {
    "slug": "gtm-overview",
    "title": "GTM 产品介绍",
    "description": "从网站建立共享项目背景，衔接市场调研、可见度分析和营销内容工作。",
    "group": "GTM",
    "toc": [
      {
        "id": "uses",
        "title": "适合哪些市场工作"
      },
      {
        "id": "context",
        "title": "让调研和内容使用同一份背景"
      },
      {
        "id": "workspace",
        "title": "项目里有什么"
      },
      {
        "id": "start",
        "title": "从网站项目开始"
      },
      {
        "id": "workflow",
        "title": "从分析结果安排下一步"
      },
      {
        "id": "agent",
        "title": "通过 Growth Agent 操作项目"
      }
    ]
  },
  {
    "slug": "gtm-quickstart",
    "title": "创建第一个 GTM 项目",
    "description": "输入网站，等待初始化，并检查第一批分析结果。",
    "group": "GTM",
    "toc": [
      {
        "id": "prepare",
        "title": "开始前"
      },
      {
        "id": "create",
        "title": "创建项目"
      },
      {
        "id": "setup",
        "title": "等待初始化"
      },
      {
        "id": "review",
        "title": "检查结果"
      }
    ]
  },
  {
    "slug": "gtm-projects",
    "title": "管理项目与网站资料",
    "description": "切换项目、刷新网站上下文，维护项目名称。",
    "group": "GTM",
    "toc": [
      {
        "id": "switch",
        "title": "切换和识别项目"
      },
      {
        "id": "refresh",
        "title": "刷新网站资料"
      },
      {
        "id": "files",
        "title": "查看站点文件"
      },
      {
        "id": "settings",
        "title": "修改名称与删除"
      }
    ]
  },
  {
    "slug": "gtm-company",
    "title": "公司分析与项目文档",
    "description": "检查产品、竞品和营销资料，作为内容任务的背景。",
    "group": "GTM",
    "toc": [
      {
        "id": "intelligence",
        "title": "查看公司分析"
      },
      {
        "id": "documents",
        "title": "查看项目文档"
      },
      {
        "id": "review",
        "title": "生成内容前先核对事实"
      }
    ]
  },
  {
    "slug": "gtm-performance",
    "title": "SEO 与网站性能",
    "description": "阅读 PageSpeed 结果，分别检查移动端和桌面端。",
    "group": "GTM",
    "toc": [
      {
        "id": "run",
        "title": "运行检查"
      },
      {
        "id": "read",
        "title": "阅读报告"
      },
      {
        "id": "compare",
        "title": "修改网站后复查"
      }
    ]
  },
  {
    "slug": "gtm-geo",
    "title": "AI 品牌提及",
    "description": "查看买家问题，以及模型回答是否提到你的品牌。",
    "group": "GTM",
    "toc": [
      {
        "id": "prompts",
        "title": "检查买家问题"
      },
      {
        "id": "run",
        "title": "运行品牌提及分析"
      },
      {
        "id": "read",
        "title": "检查模型回答"
      }
    ]
  },
  {
    "slug": "gtm-traffic",
    "title": "连接 Google Analytics",
    "description": "授权账户、选择 GA 属性，并查看流量报告。",
    "group": "GTM",
    "toc": [
      {
        "id": "connect",
        "title": "连接账号"
      },
      {
        "id": "property",
        "title": "选择属性"
      },
      {
        "id": "sync",
        "title": "同步与查看"
      }
    ]
  },
  {
    "slug": "gtm-x",
    "title": "生成与发布 X 草稿",
    "description": "生成帖子，检查预览，再到 X 完成发布。",
    "group": "GTM",
    "toc": [
      {
        "id": "generate",
        "title": "生成草稿"
      },
      {
        "id": "review",
        "title": "审阅内容"
      },
      {
        "id": "publish",
        "title": "到 X 发布"
      }
    ]
  },
  {
    "slug": "gtm-articles",
    "title": "生成文章草稿",
    "description": "设定风格、语言和读者，审阅并复制 Markdown。",
    "group": "GTM",
    "toc": [
      {
        "id": "configure",
        "title": "填写文章要求"
      },
      {
        "id": "generate",
        "title": "等待草稿生成"
      },
      {
        "id": "review",
        "title": "检查并使用"
      }
    ]
  },
  {
    "slug": "gtm-growth-agent",
    "title": "使用 Growth Agent",
    "description": "通过项目内对话读取资料或发起后台操作。",
    "group": "GTM",
    "toc": [
      {
        "id": "ask",
        "title": "围绕当前项目提问"
      },
      {
        "id": "operations",
        "title": "通过对话发起操作"
      },
      {
        "id": "status",
        "title": "区分回复与后台结果"
      }
    ]
  },
  {
    "slug": "gtm-troubleshooting",
    "title": "运行状态与常见问题",
    "description": "检查排队、依赖和结果，避免把未完成误当作无数据。",
    "group": "GTM",
    "toc": [
      {
        "id": "statuses",
        "title": "查看运行状态"
      },
      {
        "id": "questions",
        "title": "常见问题"
      },
      {
        "id": "help",
        "title": "反馈问题"
      }
    ]
  },
  {
    "slug": "billing",
    "title": "套餐与用量",
    "description": "查看当前身份的权益、使用情况和账单。",
    "group": "账户与平台",
    "toc": [
      {
        "id": "plan",
        "title": "查看产品权限"
      },
      {
        "id": "usage",
        "title": "查看用量"
      },
      {
        "id": "team",
        "title": "团队席位"
      },
      {
        "id": "renew",
        "title": "续费与取消"
      }
    ]
  }
];

const groups = {
  en: { "开始使用": "Getting started", "账户与平台": "Account and platform" },
  ja: { "开始使用": "はじめに", "账户与平台": "アカウントとプラットフォーム" },
};
export function getDocsPages(locale: AppLocale): DocsPageInfo[] {
  if (locale === "zh-CN") return docsPages;
  const translated: Record<string, { title: string; description: string; toc: DocsPageInfo["toc"] }> = locale === "en" ? en : ja;
  const groupNames: Record<string, string> = groups[locale];
  return docsPages.map((page) => ({ ...page, ...translated[page.slug], group: groupNames[page.group] ?? page.group }));
}
