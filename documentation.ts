

import { PageView } from './types';

// --- System Documentation Types ---

export interface SystemModule {
  id: string;
  name: string;
  logic: string;       // 详细的后端业务逻辑描述
  checkpoints: string[]; // 测试建议关注的后台数据/状态变化点
}

export interface SystemDoc {
  id: string;
  title: string;
  description: string; 
  modules: SystemModule[]; // 升级为结构化对象
  dataEntities: string[]; 
}

export interface PageDocumentation {
  title: string;
  overview: string;
  // FIX: Added overviewImages to PageDocumentation interface.
  overviewImages?: string[];
  features: string[];
  backendConfig: Array<{ label: string; value: string }>;
  keyFlows: Array<{ name: string; steps: string[] }>;
  relatedSystems: string[]; 
}

// --- System Definitions (后端架构映射) ---

export const SYSTEM_DOCS: Record<string, SystemDoc> = {
  sys_user: {
    id: 'sys_user',
    title: '用户中心系统 (User Identity)',
    description: '处理从匿名访问到高级 VIP 的全生命周期，负责身份鉴权、风控策略及基础资料维护。',
    modules: [
      {
        id: 'auth_gateway',
        name: 'Auth Gateway',
        logic: '基于 JWT 的分发机制。登录时根据设备指纹 (Device Fingerprint) 生成唯一的 SessionID。若检测到异地 IP 登录，强制下发 4032 状态码触发前端 2FA 验证流。',
        checkpoints: ['Session 是否在 Redis 正常续期', '多端登录互踢逻辑是否生效', 'JWT Payload 中的角色权限字段校验']
      },
      {
        id: 'vip_engine',
        name: 'VIP Engine',
        logic: '每 5 分钟扫描一次用户的累计流水。当达到阈值时，自动修改用户表中的 vip_level。升级操作具有幂等性，确保礼金只发一次。',
        checkpoints: ['流水计算延迟是否在可接受范围', '升级礼金的账务流水表 ID 关联性', '保级周期届满时的降级计算准确性']
      },
      {
        id: 'security_audit',
        name: 'Security & 2FA',
        logic: '针对敏感接口（提现、改密）的切面过滤。若用户开启了 2FA，拦截请求并检查 Header 中的 totp_token。',
        checkpoints: ['短信/邮箱验证码的 TTL 准确性', '暴力破解尝试的 IP 封禁触发', '2FA 开启/关闭的日志审计记录']
      }
    ],
    dataEntities: ['User', 'VipConfig', 'SecurityLog', 'Notification']
  },
  sys_wallet: {
    id: 'sys_wallet',
    title: '钱包与结算系统 (Wallet & Settlement)',
    description: '核心金融级计费系统，确保所有卢布账本、红利账本及外部支付网关的数据同步与原子性。',
    modules: [
      {
        id: 'ledger_service',
        name: 'Ledger Service',
        logic: '采用双向账本。每一笔资金变动必须产生 A (主账户) -> B (目标方) 的对冲记录。支持事务回滚。',
        checkpoints: ['DB 事务隔离级别在高并发下的表现', '卢布精度（保留到 0.01）的舍入误差', '负数余额防御逻辑']
      },
      {
        id: 'payout_audit',
        name: 'Payout Auditor',
        logic: '自动流水审计器。逻辑：`TotalDeposit * WageringRequirement <= TotalBet`。若不满足，提现 API 强制返回 LOCK_AMOUNT 错误及差额数据。',
        checkpoints: ['不同游戏的打码权重（Slot 100%, Live 10%）计算', '锁定金额的实时计算延迟', '后台手动解冻权限覆盖逻辑']
      },
      {
        id: 'crypto_gateway',
        name: 'Crypto Gateway',
        logic: '监听链上 RPC。USDT 充值需 3 个确认位方开上账。提现时自动计算当前网络 Gas Fee 并从用户到账金额中扣除。',
        checkpoints: ['多重充值回调重复处理（幂等性）', '归集地址的私钥安全性', '汇率锁定 15 分钟的内存缓存同步']
      }
    ],
    dataEntities: ['Transaction', 'WageringAudit', 'ExchangeRate', 'WalletSnapshot']
  },
  sys_game: {
    id: 'sys_game',
    title: '游戏聚合平台 (Game Hub)',
    description: '负责第三方游戏厂商（PP, JILI, PG 等）的接入、免转钱包同步及注单聚合。',
    modules: [
      {
        id: 'seamless_bridge',
        name: 'Seamless Bridge',
        logic: '实现 Seamless Wallet 协议。厂商请求下注接口时，Bridge 同步扣除平台钱包余额。',
        checkpoints: ['厂商接口超时时的余额冲正处理', '注单状态转换：Betting -> Settled -> Cancelled', '单注最高限额校验']
      },
      {
        id: 'search_indexer',
        name: 'Search Indexer',
        logic: '基于 ElasticSearch 的游戏索引。支持按照标签 (Hot/New)、厂商优先级、区域屏蔽规则进行实时检索。',
        checkpoints: ['厂商维护状态 (Maintenance) 下的游戏搜索不可见性', '关键词模糊匹配权重分配', '多语言标题检索映射']
      }
    ],
    dataEntities: ['GameMeta', 'ProviderConfig', 'BetRecord', 'FavoriteMap']
  },
  sys_activity: {
    id: 'sys_activity',
    title: '营销规则引擎 (Activity Engine)',
    description: '全平台营销自动化，负责任务状态管理、红利派发队列及奖池累积。',
    modules: [
      {
        id: 'bonus_stack',
        name: 'Bonus Stack Management',
        logic: '管理用户名下的 Bonus 队列。状态机：`QUEUED -> ACTIVE -> LOCKED -> COMPLETED/VOID`。同一时间仅一个实例在 ACTIVE 状态下接收流水同步。',
        checkpoints: ['置顶操作对队列顺序的实时影响', '手动放弃 (Forfeit) 时资金回收的原子性', '打码 100% 后的即时划转逻辑']
      },
      {
        id: 'jackpot_controller',
        name: 'Jackpot Controller',
        logic: '分布式奖池计数器。系统每分钟快照所有参与用户的投注额。结算公式：`(用户本轮流水 / 奖池总流水) * 瓜分比例 * 奖池总额`。',
        checkpoints: ['瓜分区名次变更时，前端 UI 排名是否即时同步', '奖池结算时的原子性，防止重复派奖', '瓜分权重的动态变化计算是否准确']
      }
    ],
    dataEntities: ['BonusRecord', 'MissionConfig', 'ChestReward', 'JackpotPool']
  }
};

// --- Page PRD Documentation ---

export const PAGE_DOCS: Record<string, PageDocumentation> = {
  home: {
    title: "首页大厅 (Home Lobby)",
    overview: "核心流量枢纽。承载着用户“快速进场”和“高密度活动展示”的职责。采用模块化设计，支持运营端远程调整组件顺序。",
    features: [
      "【逻辑】余额展示需实时调用 Wallet API；隐私模式需本地缓存状态。",
      "【逻辑】游戏卡片根据 Tags 字段（Hot/New）进行视觉高亮区分。",
      "【逻辑】点击游戏需触发 RoomSelectionDrawer 判定该游戏是否支持红利场。",
      "【交互】支持 Sidebar 呼出，Sidebar 内容需根据登录角色（如 KOL 身份）动态显示功能项。"
    ],
    backendConfig: [
      { label: "Main Layout", value: "返回大厅模块数组，包含类型(Banner, Hot, Brands)和排序。" },
      { label: "Provider Status", value: "当厂商维护时，厂商 Logo 列表项必须置灰且不可点击。" }
    ],
    keyFlows: [
      {
        name: "游戏入场流 (Login Required)",
        steps: ["点击游戏卡片", "判定 Login 状态", "呼出房间选择", "加载 GameView（传递 RoomType）"]
      }
    ],
    relatedSystems: ['sys_user', 'sys_game', 'sys_wallet', 'sys_activity']
  },
  gameView: {
    title: "游戏竞技场 (Game Arena)",
    overview: "游戏核心体验区。根据进入的房间类型（Room Type）动态加载不同的辅助功能组件。",
    features: [
      "【Jackpot】在休闲场/巅峰场顶部集成。实时计算当前用户相对于“入围名次”的差距，并展示预计瓜分额度。",
      "【Bonus】在红利场显示。实时展示当前红利的打码进度条，100% 后自动清算。",
      "【平衡同步】Spin 动作后需同步更新主钱包与 Jackpot 本轮流水累计值。",
      "【交互】Jackpot 详情面板需展示本轮倒计时及奖池动态金额。"
    ],
    backendConfig: [
      { label: "Wager Sync", value: "注单产生后，Wager 实时推送给 sys_activity 进行排名重算。" },
      { label: "Share Algorithm", value: "配置前 100 名的具体瓜分比例（如冠军 20%，2-10名平分 30% 等）。" }
    ],
    keyFlows: [
      {
        name: "Jackpot 实时竞技流",
        steps: ["产生有效投注", "推送 Wager 变更", "后端重算 Rank", "WebSocket 推送新排名至前端", "更新瓜分预测 UI"]
      }
    ],
    relatedSystems: ['sys_activity', 'sys_game', 'sys_wallet']
  },
  search: {
    title: "搜索与智能筛选 (Search & Discovery)",
    overview: "采用 2:1 黄金比例排版。搜索框与厂商筛选同排并列，方便单手快速过滤海量游戏内容。",
    features: [
      "【逻辑】厂商筛选：点击弹出半屏 Drawer，展示厂商 Logo。选中后页面标题切换为“XXX 搜索结果”。",
      "【逻辑】实时搜索：输入每 300ms 触发一次本地/接口过滤。无结果时强制展示热门推荐。",
      "【逻辑】搜索结果页标题：需显示“搜索结果”字样，并附带命中的计数统计。",
      "|【交互】支持“一键清除”关键词；关闭搜索页时需还原大厅滚动状态。"
    ],
    backendConfig: [
      { label: "Search Index", value: "返回包含 Title, Provider, Tags 的全量 JSON，支持拼音模糊匹配。" }
    ],
    keyFlows: [
      {
        name: "厂商分类搜索",
        steps: ["点击厂商筛选", "Drawer 选中 JILI", "标题更新为 JILI 搜索结果", "展示该厂商全部游戏"]
      }
    ],
    relatedSystems: ['sys_game']
  },
  deposit: {
    title: "充值中心 (Crypto Deposit)",
    overview: "基于商品包逻辑的加密货币充值页。核心在于“利益最大化”的视觉引导和汇率锁定机制。",
    features: [
      "【规则】禁用自由输入金额，强制选择预设 Package，以降低用户决策成本。",
      "【逻辑】汇率锁定：点击确认充值后，15 分钟内汇率 1:92.5 保持不变，超时需重新拉取。",
      "【逻辑】实时权益看板：实时展示 基础RUB + 赠送Bonus + 赠送现金券 的总价值 (NET)。",
      "【展示】卢布 (RUB) 金额必须强制保留两位小数，并使用等宽字体显示。"
    ],
    backendConfig: [
      { label: "Price Packages", value: "配置 10-5000 USDT 各档位的 Bonus/Voucher 赠送系数。" },
      { label: "Rate Lock TTL", value: "服务端定义的汇率有效期时长，前端需展示同步倒计时。" }
    ],
    keyFlows: [
      {
        name: "USDT-TRC20 充值链路",
        steps: ["选择 USDT/TRC20", "选中 $100 包", "确认汇率锁定", "生成收币地址", "轮询支付状态"]
      }
    ],
    relatedSystems: ['sys_wallet', 'sys_activity']
  },
  withdrawal: {
    title: "提现中心 (Withdrawal Center)",
    overview: "高度风控敏感页面。核心逻辑是针对“待解冻金额”的实时审计，确保平台合规性。",
    features: [
      "【风控】流水判定：未完成 100% 打码要求的资金标记为“锁定”，不可提取，点击叹号查看详情。",
      "【计算】提现算式：输入 RUB -> 扣除平台固定 RUB 手续费 -> 换算 Crypto -> 扣除网络 Gas -> 最终到账。",
      "【逻辑】地址白名单：若未开启白名单，输入地址需触发 2FA 强制校验。",
      "【限制】提现门槛：需满足各币种最低起提额度（如 10 USDT 等值 RUB）。"
    ],
    backendConfig: [
      { label: "Wagering Audit", value: "实时返回 (总存款 - 总投注) 的缺口，用于判定锁定金额。" },
      { label: "Withdrawal Rate", value: "提现汇率通常低于充值汇率，需在页面显性标注。" }
    ],
    keyFlows: [
      {
        name: "受限提现拦截流",
        steps: ["输入 10000 RUB", "锁定金额 > 0", "弹出流水不足提示", "引导去游戏", "拦截提交按钮"]
      }
    ],
    relatedSystems: ['sys_wallet', 'sys_user']
  },
  vipCenter: {
    title: "VIP 晋升中心 (VIP Center)",
    overview: "用户忠诚度核心页。通过明确的利益点对比（Current vs Next）引导用户提升活跃度。",
    features: [
      "【逻辑】双轨晋升：充值和投注任一未达标，均不能自动升级。进度条需展示距离目标的绝对差额。",
      "【规则】保级规则：每月 1 号计算流水，不达标则阶梯式降级。页面需显著标示保级要求。",
      "【领取】权益领取：升级礼金自动到账，但周/月奖励需用户在此时手动点击 Claim。",
      "【展示】VIP 等级勋章在全站统一：Header、Sidebar、个人中心及排行榜。"
    ],
    backendConfig: [
      { label: "Privilege Matrix", value: "定义全等级的提现限额、返水比例、客服通道优先级。" }
    ],
    keyFlows: [
      {
        name: "权益 Claim 流程",
        steps: ["进入 VIP 中心", "检测领取资格", "点击 Claim", "主余额/红利余额刷新", "生成奖励记录"]
      }
    ],
    relatedSystems: ['sys_user', 'sys_activity', 'sys_wallet']
  },
  myBonuses: {
    title: "奖金中心 (Bonus Center)",
    overview: "红利生命周期管理。用户在此处将“不可提取的红利”通过游戏转化为“现金余额”。",
    features: [
      "【逻辑】红利排队：支持多个红利同时存在。同一时间仅一个 Active，其余为 Queued 状态。",
      "【交互】支持置顶操作：点击“优先排队”可将目标红利移至 Active 后的第一顺位。",
      "【规则】打码进度：实时从游戏注单同步打码额度。到达 100% 后红利自动清算并划转。",
      "【警告】放弃逻辑：明确告知放弃将导致当前关联的全部余额（含盈利）被永久扣除。"
    ],
    backendConfig: [
      { label: "Instance Map", value: "每个 Bonus 实例需绑定创建时间、关联订单 ID 及当前打码步长。" }
    ],
    keyFlows: [
      {
        name: "红利置顶与切换",
        steps: ["进入奖金中心", "查看排队项", "点击优先激活", "排序更新", "前序红利完成后自动触发"]
      }
    ],
    relatedSystems: ['sys_activity', 'sys_wallet', 'sys_game']
  },
  kolOverview: {
    title: "KOL 代理面板 (KOL Dashboard)",
    overview: "B端合伙人的业绩分析终端。核心在于“佣金变现”全路径的无感转化。",
    features: [
      "【逻辑】佣金划分：区分“总收益”、“可划转”和“本期预估”。预估值基于今日未结算流水。",
      "【交互】划转逻辑：点击划转将资金从 Agent 账户转入 Player 主账户。支持流水审计后再划转。",
      "【工具】快捷推广：提供专属链接一键复制和推广海报（含二维码）生成功能。",
      "【统计】全量下级统计：展示注册人数、有效用户（有充值行为）及流水贡献排行。"
    ],
    backendConfig: [
      { label: "Commission Config", value: "不同等级 KOL 对应的分成比例 (RevShare %)。" }
    ],
    keyFlows: [
      {
        name: "佣金变现闭环",
        steps: ["产生下级流水", "结算佣金", "查看可划转余额", "划转至主钱包", "去提现中心提现"]
      }
    ],
    relatedSystems: ['sys_agent', 'sys_wallet', 'sys_user']
  }
};

export const DEFAULT_DOC: PageDocumentation = {
  title: "全链路前端交付与测试标准 (QA Standard)",
  overview: "本规范定义了 Casino Lobby 产品的通用开发准则、UI 交付精度及核心测试矩阵。确保所有金融级逻辑在多端环境下的一致性。",
  features: [
    "【货币规范】所有金额显示必须带币种单位（RUB/USDT），且金额字体必须使用 `font-mono`。",
    "【风控逻辑】提现操作前强制触发 100% 流水合规检测，不满足必须提供可视化引导。",
    "【状态同步】账户余额（Main/Bonus/Points）在跨页面跳转或 Modals 关闭时需强制刷新的触发点定义。",
    "【响应标准】Api 成功反馈需在 300ms 内给予 UI 提示；Api 失败需区分业务错误与网络错误分类弹窗。"
  ],
  backendConfig: [
    { label: "Global Currency", value: "RUB (卢布) 为结算基准币种" },
    { label: "Rate Service", value: "聚合汇率源，每 60 秒更新一次中间价" }
  ],
  keyFlows: [
    {
      name: "前端质量验收矩阵",
      steps: ["全量埋点触发测试", "暗黑/高亮模式色彩对比度校验", "弱网环境下的支付倒计时同步", "设备指纹风控拦截测试"]
    }
  ],
  relatedSystems: ['sys_user', 'sys_wallet', 'sys_game', 'sys_activity', 'sys_agent']
};
