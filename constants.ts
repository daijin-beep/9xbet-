
import { QuickAccessItem, CategoryFilterItem, Game, BottomNavItem, SidebarNavItem, OffersTabItem, PromotionalBanner, PageView, GameCollection, GameProviderCollectionItem, GameListProviderFilter, AgentTopTabItem, SocialShareIconType, ProfileWalletSummary, ProfileQuickLink, GameBrand, HomeCategory, GameCategory, Bonus, VipLevel, RewardHistoryItem, AgentMonthlyStats, CommissionDetailItem, PosterTemplate, InvitationGuideStep, FaqItem, VipPrivilege, BettingHistoryTab, BettingHistoryItem, TransactionHistoryTab, TransactionHistoryItem, CryptoCurrency, CryptoWithdrawalCurrency, UserBankCard, DepositPromo, Session, OfferFilterTabItem, Bank, HistoricalActivityItem, SidebarPromoItem, Language, Currency, WeeklyGameBannerData, Mission, HomeOffer, ActivityChest, UserCryptoAddress, JackpotWinner, JackpotReward, JackpotLeaderboardEntry, PromotionChannel, ReferredUser, CommissionRecord, KolAgentTab, CommissionEarningRule, InvitedKol } from './types';
import { 
    FireIcon, SparklesIcon, CubeIcon, CreditCardIcon, PuzzlePieceIcon, FilmIcon, ChartBarIcon, StarIcon, ClockIcon, CalendarDaysIcon,
    CircleStackIcon, TrophyIcon, BuildingStorefrontIcon, QuestionMarkCircleIcon, GiftIcon, UsersIcon, DownloadIcon, LanguageIcon, DevicePhoneMobileIcon, BanknotesIcon,
    SquaresFourIcon, ArrowPathIcon, TagIcon, ArrowDownTrayIcon, UserGroupIcon, DiceSymbolIcon, DollarBagIcon, SquaresIcon as GenericSquaresIcon, DiceIcon as GenericDiceIcon,
    CurrencyDollarIcon, ChevronDoubleRightIcon, ChartPieIcon, LinkIcon, QrCodeIcon, EnvelopeIcon, EllipsisHorizontalIcon, ChatBubbleLeftRightIcon, ClipboardCopyIcon, PresentationChartLineIcon, LightBulbIcon, HandThumbUpIcon, ShareIcon,
    UserCircleIcon, LockClosedIcon, ShieldCheckIcon, ListBulletIcon, CogIcon, ArrowRightOnRectangleIcon, BellIcon as GenericBellIcon, ChevronRightIcon,
    MenuIcon, CoinIcon, RocketLaunchIcon, ArrowLeftIcon, SearchIcon, CloseIcon, CheckIcon,
    PhotoIcon, ExclamationTriangleIcon, BtcIcon, EthIcon, UsdtIcon, DogeIcon, GcashIcon, ChevronDownIcon, HandThumbDownIcon, LightningBoltIcon, CheckboxIcon, CheckboxCheckedIcon, PlayCircleIcon, PhoneHorizontalIcon, PhoneVerticalIcon, ArrowUpTrayIcon, TrashIcon, GlobeAltIcon, PauseCircleIcon, PlusIcon,
    ArrowsUpDownIcon, UserPlusIcon, FilterIcon, InformationCircleIcon, PencilSquareIcon
} from './components/icons/GenericIcons';

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { id: '1', label: 'VIP 中心', imageSrc: 'https://picsum.photos/seed/vip/100/100', navigateTo: 'vipCenter' },
  { id: '2', label: '优惠活动', imageSrc: 'https://picsum.photos/seed/reward/100/100', navigateTo: 'offers' },
  { id: '3', label: '代理加盟', imageSrc: 'https://picsum.photos/seed/refer/100/100', navigateTo: 'kolOverview' },
  { id: '4', label: '任务中心', imageSrc: 'https://picsum.photos/seed/task/100/100', navigateTo: 'mission' },
];

export const CATEGORY_FILTERS: CategoryFilterItem[] = [
  { id: 'lobby', label: '大厅', Icon: SquaresFourIcon },
  { id: 'hot', label: '热门', Icon: FireIcon },
  { id: 'slot', label: '老虎机', Icon: CubeIcon },
  { id: 'live', label: '真人', Icon: FilmIcon },
  { id: 'fishing', label: '捕鱼', Icon: RocketLaunchIcon },
  { id: 'cards', label: '棋牌', Icon: PuzzlePieceIcon },
];

export const HOT_GAMES: Game[] = [
  { id: 'hot1', title: 'Sugar Rush', provider: 'Pragmatic Play', imageSrc: 'https://picsum.photos/seed/sugar/200/300', category: 'slot', providerId: 'pp', tags: ['hot'], orientation: 'portrait' },
  { id: 'hot2', title: 'Gates of Olympus', provider: 'Pragmatic Play', imageSrc: 'https://picsum.photos/seed/olympus/200/300', category: 'slot', providerId: 'pp', tags: ['hot'], orientation: 'portrait' },
  { id: 'hot3', title: 'Sweet Bonanza', provider: 'Pragmatic Play', imageSrc: 'https://picsum.photos/seed/sweet/200/300', category: 'slot', providerId: 'pp', tags: ['hot'], orientation: 'portrait' },
  { id: 'hot4', title: 'Crazy Time', provider: 'Evolution', imageSrc: 'https://picsum.photos/seed/crazy/200/300', category: 'live', providerId: 'evo', tags: ['hot'], orientation: 'portrait' },
  { id: 'hot5', title: 'Money Coming', provider: 'JILI', imageSrc: 'https://picsum.photos/seed/money/200/300', category: 'slot', providerId: 'jili', tags: ['hot'], orientation: 'portrait' },
];

export const ALL_GAMES_FOR_LIST_PAGE: Game[] = [
    ...HOT_GAMES,
    { id: 'new1', title: 'Mahjong Ways', provider: 'PG Soft', imageSrc: 'https://picsum.photos/seed/mahjong/200/300', category: 'slot', providerId: 'pg', tags: ['new'], orientation: 'portrait' },
    { id: 'new2', title: 'Super Ace', provider: 'JILI', imageSrc: 'https://picsum.photos/seed/superace/200/300', category: 'slot', providerId: 'jili', tags: ['new'], orientation: 'portrait' },
    { id: 'live1', title: 'Lightning Roulette', provider: 'Evolution', imageSrc: 'https://picsum.photos/seed/roulette/200/300', category: 'live', providerId: 'evo', tags: ['hot'], orientation: 'portrait' },
    { id: 'fish1', title: 'Mega Fishing', provider: 'JILI', imageSrc: 'https://picsum.photos/seed/fishing/200/300', category: 'fishing', providerId: 'jili', tags: [], orientation: 'portrait' },
    { id: 'card1', title: 'Baccarat', provider: 'Evolution', imageSrc: 'https://picsum.photos/seed/baccarat/200/300', category: 'cards', providerId: 'evo', tags: [], orientation: 'portrait' },
];

export const GAME_BRANDS: GameBrand[] = [
  { id: 'brand1', name: 'Pragmatic Play', logoUrl: 'https://picsum.photos/seed/pp/100/50', providerId: 'pp' },
  { id: 'brand2', name: 'JILI', logoUrl: 'https://picsum.photos/seed/jili/100/50', providerId: 'jili' },
  { id: 'brand3', name: 'PG Soft', logoUrl: 'https://picsum.photos/seed/pg/100/50', providerId: 'pg' },
  { id: 'brand4', name: 'Evolution', logoUrl: 'https://picsum.photos/seed/evo/100/50', providerId: 'evo' },
];

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: 'menu', label: '菜单', Icon: MenuIcon },
  { id: 'offers', label: '优惠', Icon: GiftIcon },
  { id: 'home', label: '游戏大厅', Icon: GenericDiceIcon },
  { id: 'jackpot', label: 'Jackpot', Icon: TrophyIcon },
  { id: 'profile', label: '我的', Icon: UserCircleIcon },
];

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'vip', label: 'VIP 俱乐部', Icon: TrophyIcon, navigateTo: 'vipCenter' },
  { id: 'affiliate', label: '合伙人计划', Icon: UserGroupIcon, navigateTo: 'kolOverview' },
  { id: 'promotions', label: '优惠中心', Icon: GiftIcon, navigateTo: 'offers' },
  { id: 'games', label: '全部游戏', Icon: GenericDiceIcon, subItems: [
          { id: 'game-slot', label: '老虎机', Icon: CubeIcon, navigateTo: 'gameList', categoryKey: 'slot' },
          { id: 'game-live', label: '真人视讯', Icon: FilmIcon, navigateTo: 'gameList', categoryKey: 'live' },
      ]
  },
];

export const SIDEBAR_PROMO_ITEMS: SidebarPromoItem[] = [
    { id: 'promo1', label: '邀请好友', description: '最高享 40% 佣金', imageSrc: 'https://picsum.photos/seed/refer/50/50', bgColorClass: 'bg-green-100', textColorClass: 'text-green-800', navigateTo: 'kolOverview' },
    { id: 'promo2', label: '每日签到', description: '免费领金币', imageSrc: 'https://picsum.photos/seed/daily/50/50', bgColorClass: 'bg-yellow-100', textColorClass: 'text-yellow-800', navigateTo: 'mission' },
];

export const OFFERS_TABS: OffersTabItem[] = [
  { id: 'event_list', label: '活动列表' },
  { id: 'my_bonuses', label: '奖金中心' },
  { id: 'mission', label: '每日任务' },
  { id: 'vip_center', label: 'VIP 中心' },
  { id: 'history', label: '参与记录' },
];

export const OFFERS_FILTER_TABS: OfferFilterTabItem[] = [
    { id: 'all', label: '全部' },
    { id: 'deposit', label: '充值' },
    { id: 'cashback', label: '返点' },
    { id: 'vip', label: 'VIP 专属' },
];

export const PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  { 
    id: 'banner-tiered-percentage', 
    title: '超级再存红利', 
    imageUrl: 'https://picsum.photos/seed/tiered/800/400', 
    offerType: 'deposit',
    amount: '最高 80%',
    subtitle: '多存多送，上不封顶',
    activityType: 'fixed',
    dateRange: '2023.10.01 - 2024.12.31',
    targetUsers: ['活跃用户', 'VIP用户'],
    targetPlatforms: ['Android', 'iOS', 'Web'],
    rewardConfig: {
        mechanism: 'tiered_percentage',
        rewardType: 'bonus',
        exchangeRate: '1 USDT ≈ 92.5 RUB',
        table: [
            { condition: '1,000 - 5,000 RUB', reward: '30%' },
            { condition: '5,001 - 20,000 RUB', reward: '50%' },
            { condition: '20,001 RUB 以上', reward: '80%' }
        ]
    },
    participationSteps: [
        { number: 1, htmlText: '在活动期间内单笔充值达到对应门槛。' },
        { number: 2, htmlText: '系统自动计算汇率并按照比例派发 <strong>Bonus</strong>。' }
    ]
  },
  { 
    id: 'banner-daily-cycle', 
    title: '晚间流水之星', 
    imageUrl: 'https://picsum.photos/seed/night/800/400', 
    offerType: 'cashback',
    amount: '固定 1.2%',
    subtitle: '越夜越精彩，流水双倍计',
    activityType: 'daily',
    cycleConfig: { startTime: '20:00', endTime: '23:59' },
    targetUsers: ['全部实名用户'],
    targetPlatforms: ['全部端'],
    rewardConfig: {
        mechanism: 'fixed_percentage',
        rewardType: 'bonus',
        fixedValue: '1.2%',
        minCondition: '10 RUB 起返'
    },
    participationSteps: [
        { number: 1, htmlText: '每日 20:00 - 23:59 期间参与老虎机游戏。' },
        { number: 2, htmlText: '该时段内产生的流水将按 1.2% 比例结算 <strong>Bonus</strong>。' }
    ]
  },
  { 
    id: 'banner-weekly-cycle', 
    title: '周末充值大狂欢', 
    imageUrl: 'https://picsum.photos/seed/weekend/800/400', 
    offerType: 'deposit',
    amount: '固定 2,000 RUB',
    subtitle: '每个周末，我们不见不散',
    activityType: 'weekly',
    cycleConfig: { startDay: '周五', endDay: '周日' },
    targetUsers: ['VIP 2 以上用户'],
    targetPlatforms: ['全部端'],
    rewardConfig: {
        mechanism: 'fixed_value',
        rewardType: 'voucher',
        fixedValue: '2,000 RUB',
        minCondition: '单笔充值满 10,000 RUB'
    },
    participationSteps: [
        { number: 1, htmlText: '每周五 00:00 至 周日 23:59 期间充值。' },
        { number: 2, htmlText: '满足条件的充值将自动获得 <strong>2,000 RUB 现金券</strong>。' }
    ]
  },
  { 
    id: 'banner-tiered-fixed', 
    title: '月度投注挑战', 
    imageUrl: 'https://picsum.photos/seed/challenge/800/400', 
    offerType: 'vip',
    amount: '最高 50,000 RUB',
    subtitle: '冲击更高流水，赢取现金卷',
    activityType: 'fixed',
    dateRange: '长期有效',
    targetUsers: ['全部实名用户'],
    targetPlatforms: ['全部端'],
    rewardConfig: {
        mechanism: 'tiered_fixed',
        rewardType: 'voucher',
        table: [
            { condition: '月流水 100k', reward: '500 RUB' },
            { condition: '月流水 500k', reward: '3,000 RUB' },
            { condition: '月流水 2M', reward: '15,000 RUB' },
            { condition: '月流水 10M', reward: '50,000 RUB' }
        ]
    },
    participationSteps: [
        { number: 1, htmlText: '在本月内进行老虎机或真人游戏。' },
        { number: 2, htmlText: '次月1号根据流水等级派发 <strong>现金卷 (Voucher)</strong>。' }
    ]
  }
];

export const HOME_OFFERS: HomeOffer[] = [
  { id: 'offer-reload', title: '55% 再存红利', description: '提升您的余额', ctaText: '立即领取', bgClassName: 'bg-gradient-to-r from-purple-600 to-indigo-600', action: { type: 'navigate', page: 'deposit' } },
];

export const HOME_PAGE_GAME_COLLECTIONS: GameCollection[] = [
    { id: 'live-collection', title: '真人视讯', categoryKey: 'live', Icon: FilmIcon, items: [] },
    { id: 'slots-collection', title: '热门老虎机', categoryKey: 'slot', Icon: CubeIcon, items: [] }
];

export const VIP_LEVELS: VipLevel[] = [
    {
        id: 'v1', level: 1, name: 'Bronze', colorClass: 'text-orange-400', bgColorClass: 'bg-orange-500', 
        gradientFromClass: 'from-orange-600', gradientToClass: 'to-orange-400',
        betRequirement: 0, depositRequirement: 0, levelUpBonus: 0, privileges: [],
        dailyRebate: { slot: 0.1, live: 0.1, sport: 0.1, fishing: 0.1 },
        monthlyRebate: { slot: 0.1, live: 0.1, sport: 0.1, fishing: 0.1 },
        dailyWithdrawalCount: 5, dailyWithdrawalLimit: 5000, weeklyBonus: 0, fastWithdrawal: false, highlightIdentifier: false
    },
    {
        id: 'v2', level: 2, name: 'Silver', colorClass: 'text-slate-300', bgColorClass: 'bg-slate-400', 
        gradientFromClass: 'from-slate-500', gradientToClass: 'to-slate-300',
        betRequirement: 50000, depositRequirement: 1000, levelUpBonus: 100, privileges: [],
        dailyRebate: { slot: 0.2, live: 0.2, sport: 0.2, fishing: 0.2 },
        monthlyRebate: { slot: 0.2, live: 0.2, sport: 0.2, fishing: 0.2 },
        dailyWithdrawalCount: 10, dailyWithdrawalLimit: 10000, weeklyBonus: 50, fastWithdrawal: true, highlightIdentifier: true
    },
    {
        id: 'v3', level: 3, name: 'Gold', colorClass: 'text-yellow-400', bgColorClass: 'bg-yellow-500', 
        gradientFromClass: 'from-yellow-600', gradientToClass: 'to-yellow-400',
        betRequirement: 250000, depositRequirement: 5000, levelUpBonus: 500, privileges: [],
        dailyRebate: { slot: 0.5, live: 0.5, sport: 0.5, fishing: 0.5 },
        monthlyRebate: { slot: 0.5, live: 0.5, sport: 0.5, fishing: 0.5 },
        dailyWithdrawalCount: 15, dailyWithdrawalLimit: 25000, weeklyBonus: 200, fastWithdrawal: true, highlightIdentifier: true
    },
];

export const VIP_WELCOME_BENEFITS = [];
export const VIP_WELCOME_FAQ = [];

export const NEWBIE_MISSIONS: Mission[] = [
    {
        id: 'm1', title: '完善个人资料', description: '上传头像并设置昵称', taskType: 'profile', Icon: UserCircleIcon, reward: '10 9XCoin', 
        progress: { current: 1, target: 1 }, action: { type: 'navigate', page: 'settings', ctaLabel: '去完成' }
    },
    {
        id: 'm2', title: '绑定电子邮箱', description: '验证邮箱以提升账号安全性', taskType: 'security', Icon: EnvelopeIcon, reward: '50 9XCoin', 
        progress: { current: 0, target: 1 }, action: { type: 'navigate', page: 'settings', ctaLabel: '去绑定' }
    },
    {
        id: 'm3', title: '首次充值奖励', description: '单笔充值满 1,000 RUB', taskType: 'deposit', Icon: BanknotesIcon, reward: '100 RUB Bonus', 
        progress: { current: 0, target: 1000 }, action: { type: 'navigate', page: 'deposit', ctaLabel: '去充值' }
    },
    {
        id: 'm4', title: '老虎机初体验', description: '在任一老虎机游戏中下注', taskType: 'bet', Icon: CubeIcon, reward: '20 9XCoin', 
        progress: { current: 0, target: 1 }, action: { type: 'navigate', page: 'home', categoryKey: 'slot', ctaLabel: '去下注' }
    }
];

export const WEEKLY_MISSIONS: Mission[] = [
    {
        id: 'w1', title: '每周打码挑战', description: '累计投注流水达 50,000 RUB', taskType: 'bet', Icon: TrophyIcon, reward: '500 RUB Bonus', 
        progress: { current: 12500, target: 50000 }, action: { type: 'navigate', page: 'home', ctaLabel: '继续游戏' }
    },
    {
        id: 'w2', title: '连续登录', description: '本周累计登录 5 天', taskType: 'login', Icon: CalendarDaysIcon, reward: '100 9XCoin', 
        progress: { current: 3, target: 5 }, action: { type: 'navigate', page: 'home', ctaLabel: '再接再厉' }
    },
    {
        id: 'w3', title: '邀请大使', description: '成功邀请 2 名好友完成充值', taskType: 'refer', Icon: UserPlusIcon, reward: '200 RUB 现金券', 
        progress: { current: 1, target: 2 }, action: { type: 'navigate', page: 'kolOverview', ctaLabel: '去邀请' }
    }
];

export const RECENTLY_PLAYED_GAMES: Game[] = [];

export const BANK_LIST: Bank[] = [
    { id: 'sber', name: 'Sberbank' },
    { id: 'tinkoff', name: 'Tinkoff' }
];

export const WITHDRAWAL_CRYPTO_CURRENCIES: CryptoWithdrawalCurrency[] = [
    { id: 'usdt', name: 'USDT', Icon: UsdtIcon, networks: [{id:'trc20', name:'TRC20'}, {id:'erc20', name:'ERC20'}] },
    { id: 'btc', name: 'BTC', Icon: BtcIcon, networks: [{id:'bitcoin', name:'Bitcoin'}] },
];

export const MOCK_TRANSACTION_HISTORY: TransactionHistoryItem[] = [
    {
        id: 'tx-1',
        type: 'deposit',
        amount: 9250.00,
        currency: 'RUB',
        method: 'USDT',
        status: 'completed',
        timestamp: Date.now() - 3600000,
        orderId: 'CRYP-1002938485',
        cryptoAmount: 100.00,
        cryptoCurrency: 'USDT',
        network: 'TRC20',
        exchangeRate: 92.50
    },
    {
        id: 'tx-2',
        type: 'deposit',
        amount: 4625.00,
        currency: 'RUB',
        method: 'USDT',
        status: 'pending',
        timestamp: Date.now() - 600000,
        orderId: 'CRYP-1002938499',
        cryptoAmount: 50.00,
        cryptoCurrency: 'USDT',
        network: 'ERC20',
        exchangeRate: 92.50,
        expiryTime: Date.now() + 1200000 // 20 mins later
    },
    {
        id: 'tx-3',
        type: 'withdrawal',
        amount: 15000.00,
        currency: 'RUB',
        method: 'USDT',
        status: 'completed',
        timestamp: Date.now() - 86400000,
        orderId: 'WD-882736451',
        cryptoAmount: 161.08,
        cryptoCurrency: 'USDT',
        network: 'TRC20',
        exchangeRate: 92.50,
        platformFee: 100, // RUB
        networkFee: 1.0, // USDT
    },
    {
        id: 'tx-4',
        type: 'deposit',
        amount: 1000.00,
        currency: 'RUB',
        method: 'Bank Card',
        status: 'failed',
        timestamp: Date.now() - 172800000,
        orderId: 'BANK-9928374'
    }
];
export const MOCK_BETTING_HISTORY: BettingHistoryItem[] = [];
export const TRANSACTION_HISTORY_TABS: TransactionHistoryTab[] = [
    { id: 'all', label: '全部' },
    { id: 'deposit', label: '充值' },
    { id: 'withdrawal', label: '提现' }
];
export const BETTING_HISTORY_TABS: BettingHistoryTab[] = [
    { id: 'all', label: '全部' },
    { id: 'won', label: '已中奖' },
    { id: 'lost', label: '未中奖' }
];

export const CURRENCIES: Currency[] = [
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
    { code: 'USDT', name: 'Tether', flag: '💵' }
];

export const LANGUAGES: Language[] = [
    { code: 'ru', name: 'Русский', nativeName: 'Русский' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
];

export const COUNTRIES = [
    { id: 'ru', name: 'Russia', flag: '🇷🇺', defaultCurrency: 'RUB', defaultLanguage: 'ru' },
    { id: 'pk', name: 'Pakistan', flag: '🇵🇰', defaultCurrency: 'PKR', defaultLanguage: 'ur' },
    { id: 'uz', name: 'Uzbekistan', flag: '🇺🇿', defaultCurrency: 'RUB', defaultLanguage: 'ru' },
    { id: 'int', name: 'International', flag: '🌐', defaultCurrency: 'USDT', defaultLanguage: 'en' }
];

export const MOCK_SESSIONS: Session[] = [
    { id: 's1', device: 'iPhone 15 Pro', location: 'Moscow, RU', ipAddress: '192.168.1.1', lastActive: 'Now', isCurrent: true }
];

export const MISSION_TABS = [
  { id: 'newbie', label: '新人任务' },
  { id: 'weekly', label: '每周挑战' }
];

export const ACTIVITY_CHESTS: ActivityChest[] = [];
export const USER_BANK_CARDS: UserBankCard[] = [];
export const USER_CRYPTO_ADDRESSES: UserCryptoAddress[] = [];
export const MOCK_PROMOTION_CHANNELS: PromotionChannel[] = [];
export const MOCK_REFERRED_USERS: ReferredUser[] = [];
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [];
export const KOL_AGENT_TABS = [
  { id: 'kolOverview', label: '概览' },
  { id: 'channelManagement', label: '渠道管理' },
  { id: 'friendList', label: '好友列表' },
  { id: 'commissionList', label: '佣金统计' }
];
export const COMMISSION_EARNING_RULES = [
  { id: 'r1', condition: '有效充值人数 > 5', unlockPercentage: 30 },
  { id: 'r2', condition: '有效充值人数 > 20', unlockPercentage: 35 },
  { id: 'r3', condition: '有效充值人数 > 50', unlockPercentage: 40 }
];

export const KOL_LEVELS = [
    { level: 1, ratio: 20 },
    { level: 2, ratio: 25 },
    { level: 3, ratio: 35 },
    { level: 4, ratio: 45 },
];

export const CURRENT_AGENT_DATA = { 
    nickname: 'ProPartner', 
    avatarUrl: 'https://i.pravatar.cc/150?u=propartner', 
    stats: { invites: 156, registrations: 42, deposits: 125000, commission: 12500 }, 
    withdrawalConditions: { met: true, reason: '' },
    level: 3,
    nextLevelProgress: { current: 125000, target: 200000, nextLevel: 4 },
    totalCommission: 60000,
    availableCommission: 4500
};

export const MOCK_INVITED_KOLS: InvitedKol[] = [
    { id: 'ik1', nickname: 'TopGamer_RU', avatarUrl: 'https://i.pravatar.cc/150?u=ik1', kolId: 'KOL-99283' },
    { id: 'ik2', nickname: 'LuckyStreamer', avatarUrl: 'https://i.pravatar.cc/150?u=ik2', kolId: 'KOL-11029' },
    { id: 'ik3', nickname: 'CryptoKing', avatarUrl: 'https://i.pravatar.cc/150?u=ik3', kolId: 'KOL-88374' },
    { id: 'ik4', nickname: 'BaccaratPro', avatarUrl: 'https://i.pravatar.cc/150?u=ik4', kolId: 'KOL-55612' },
];

export const AGENT_REFERRAL_LINK = 'https://3rr.com/r/lucky-partner-777';
export const AGENT_POSTER_TEMPLATE = { imageUrl: 'https://picsum.photos/seed/poster/800/1200' };
export const DEPOSIT_PROMOTIONS: DepositPromo[] = [];

export const MY_BONUSES: Bonus[] = [
    {
        id: 'b1', title: '55% 充值再存红利', category: 'bonus', status: 'active', expiresAt: Date.now() + 86400000 * 2, principal: 1000, maxWinnings: 10000, lockedWinnings: 2450.50, rules: '仅限指定老虎机厂商使用', supportedGames: ['PG Soft', 'Pragmatic Play', 'JILI'], wageringRequirement: { current: 12500, target: 25000 }
    },
    {
        id: 'b2', title: '新人首存礼包', category: 'bonus', status: 'locked', expiresAt: Date.now() + 86400000 * 5, principal: 500, maxWinnings: 5000, lockedWinnings: 0, rules: '需完成35倍流水', supportedGames: ['All Slots'], wageringRequirement: { current: 0, target: 17500 }
    },
    {
        id: 'b3', title: '每日签到奖励', category: 'voucher', status: 'active', expiresAt: Date.now() + 3600000 * 5, principal: 50, lockedWinnings: 50, rules: '1倍流水即可提取', supportedGames: ['PG Soft'], wageringRequirement: { current: 0, target: 50 }
    },
    {
        id: 'v-expired', title: '周末大转盘现金券', category: 'voucher', status: 'expired', expiresAt: Date.now() - 3600000, principal: 200, lockedWinnings: 0, rules: '有效期48小时', supportedGames: ['Pragmatic Play'], wageringRequirement: { current: 0, target: 200 }
    },
    {
        id: 'b4', title: '周五回馈红利', category: 'bonus', status: 'queued', expiresAt: Date.now() + 86400000 * 3, principal: 200, maxWinnings: 2000, lockedWinnings: 0, rules: '自动在排队结束后激活', supportedGames: ['JILI'], wageringRequirement: { current: 0, target: 4000 }
    },
    {
        id: 'b5', title: 'VIP 晋级礼金', category: 'bonus', status: 'completed', expiresAt: Date.now() - 86400000, principal: 500, lockedWinnings: 500, rules: '已转入主余额', supportedGames: ['Universal'], wageringRequirement: { current: 5000, target: 5000 }
    },
    {
        id: 'b-void', title: '放弃测试红利', category: 'bonus', status: 'void', expiresAt: Date.now() + 86400000, principal: 100, lockedWinnings: 0, rules: '手动放弃项展示', supportedGames: ['All'], wageringRequirement: { current: 0, target: 1000 }
    }
];

export const MOCK_HISTORICAL_ACTIVITIES: HistoricalActivityItem[] = [
    { id: 'h1', activityName: '世界杯竞猜大狂欢', reward: '1,000 RUB Bonus', participationTime: Date.now() - 86400000 * 10, status: 'Ended' },
    { id: 'h2', activityName: '新春充值特惠', reward: '500 RUB 现金券', participationTime: Date.now() - 86400000 * 5, status: 'Ended' },
    { id: 'h3', activityName: '每周打码挑战赛', reward: '200 RUB Bonus', participationTime: Date.now() - 86400000 * 2, status: 'Ongoing' }
];

export const JACKPOT_BANNER_GAMES: Game[] = [];

export const JACKPOT_LEADERBOARD_DATA: JackpotLeaderboardEntry[] = [
    { rank: 1, username: 'SlotMaster777', avatarUrl: 'https://i.pravatar.cc/150?u=slotmaster', contribution: 450800 },
    { rank: 2, username: 'LuckyRacer', avatarUrl: 'https://i.pravatar.cc/150?u=luckyracer', contribution: 380200 },
    { rank: 3, username: 'CryptoWhale', avatarUrl: 'https://i.pravatar.cc/150?u=cryptowhale', contribution: 355000 },
    { rank: 4, username: 'BaccaratKing', avatarUrl: 'https://i.pravatar.cc/150?u=baccaratking', contribution: 290000 },
    { rank: 5, username: 'SpinHero', avatarUrl: 'https://i.pravatar.cc/150?u=spinhero', contribution: 245000 },
    { rank: 6, username: 'JackpotSeeker', avatarUrl: 'https://i.pravatar.cc/150?u=seeker', contribution: 210000 },
    { rank: 7, username: 'DiamondPlayer', avatarUrl: 'https://i.pravatar.cc/150?u=diamond', contribution: 188000 },
    { rank: 8, username: 'RoyalFlush', avatarUrl: 'https://i.pravatar.cc/150?u=flush', contribution: 156000 },
    { rank: 9, username: 'BettingBot', avatarUrl: 'https://i.pravatar.cc/150?u=bot', contribution: 142000 },
    { rank: 10, username: 'HighRollerRU', avatarUrl: 'https://i.pravatar.cc/150?u=ru', contribution: 135000 },
];

export const GLOBAL_JACKPOT_DATA = { 
    lastWinner: { username: 'GoldenSlots', avatarUrl: 'https://i.pravatar.cc/150?u=goldenslots', amount: 152000.40 }, 
    prizePool: 10000379.52, 
    countdownEnd: Date.now() + 172800000, 
    myContribution: 8540,
    leaderboardThreshold: 156000 // 第8名的值
};

export const FEATURED_JACKPOT_DATA = { 
  myContribution: 450, 
  leaderboardThreshold: 1000, 
  scoringRule: 'Every 100 RUB bet = 1 point', 
  prizePool: 50000, 
  countdownEnd: Date.now() + 86400000, 
  heroImageUrl: 'https://picsum.photos/seed/jackpot/800/400' 
};

export const FEATURED_JACKPOT_GAMES: Game[] = [];

export const FEATURED_JACKPOT_LEADERBOARD_DATA: JackpotLeaderboardEntry[] = [
    { rank: 1, username: 'PragmaticPro', avatarUrl: 'https://i.pravatar.cc/150?u=pragpro', contribution: 1250 },
    { rank: 2, username: 'SugarRushLover', avatarUrl: 'https://i.pravatar.cc/150?u=sugar', contribution: 1100 },
    { rank: 3, username: 'ZeusBet', avatarUrl: 'https://i.pravatar.cc/150?u=zeus', contribution: 980 },
    { rank: 4, username: 'OlympicGold', avatarUrl: 'https://i.pravatar.cc/150?u=gold', contribution: 850 },
    { rank: 5, username: 'SweetTooth', avatarUrl: 'https://i.pravatar.cc/150?u=sweet', contribution: 720 },
];

export const RECENT_JACKPOT_WINNERS: JackpotWinner[] = [
    { id: 'w1', username: 'Alex_RU', avatarUrl: 'https://i.pravatar.cc/150?u=alex', amount: 5040, game: 'Sugar Rush' },
    { id: 'w2', username: 'Ivan99', avatarUrl: 'https://i.pravatar.cc/150?u=ivan', amount: 12800, game: 'Gates of Olympus' },
    { id: 'w3', username: 'Natasha_G', avatarUrl: 'https://i.pravatar.cc/150?u=natasha', amount: 3500, game: 'Crazy Time' },
    { id: 'w4', username: 'Viktor_K', avatarUrl: 'https://i.pravatar.cc/150?u=viktor', amount: 42000, game: 'Sweet Bonanza' },
    { id: 'w5', username: 'Masha_Lucky', avatarUrl: 'https://i.pravatar.cc/150?u=masha', amount: 8900, game: 'Mahjong Ways' },
];

export const MY_JACKPOT_REWARDS: JackpotReward[] = [];
export const WEEKLY_FEATURED_GAME: WeeklyGameBannerData = { id: 'w1', title: 'Featured', providerName: 'Pragmatic', game: HOT_GAMES[0] };

export const GLOBAL_JACKPOT_PRIZES = [
  { rank: 'Champion', amount: '50%' },
  { rank: '2nd Place', amount: '20%' },
  { rank: '3rd Place', amount: '10%' }
];

export const PROFILE_WALLET_SUMMARY: ProfileWalletSummary[] = [
  { id: 'total', label: 'Total Balance', amount: '12,345.67', currency: 'RUB', isTotal: true },
  { id: 'main', label: 'Main Wallet', amount: '11,845.67', currency: 'RUB' },
  { id: 'bonus', label: 'Bonus Wallet', amount: '500.00', currency: 'RUB' }
];

export const PROFILE_QUICK_LINKS: ProfileQuickLink[] = [
  { id: 'bet-history', label: 'Betting History', description: 'View your game history', Icon: ChartBarIcon, navigateTo: 'betHistory' },
  { id: 'tx-history', label: 'Transaction History', description: 'View your wallet history', Icon: ClockIcon, navigateTo: 'txHistory' },
  { id: 'settings', label: 'Settings', description: 'Security and profile', Icon: CogIcon, navigateTo: 'settings' },
  { id: 'distributor', label: '分销商计划', description: 'Earn More', Icon: RocketLaunchIcon, navigateTo: 'distributorOverview' }
];

export const SOCIAL_MEDIA_LINKS = [];
export const REWARD_HISTORY_ITEMS = [];
export const MOCK_SESSIONS_DATA = [];
