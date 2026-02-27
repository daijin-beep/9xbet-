
import React from 'react';

export interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export type WalletType = 'cash' | 'bonus';

export type PageView =
  | 'home'
  | 'offers'
  | 'offerDetails'
  | 'jackpot'
  | 'kolOverview'
  | 'channelManagement'
  | 'friendList'
  | 'commissionList'
  | 'agentAll'
  | 'profile'
  | 'vipCenter'
  | 'gameList'
  | 'betHistory'
  | 'txHistory'
  | 'settings'
  | 'withdrawalMethods'
  | 'mission'
  | 'myBonuses'
  | 'history'
  | 'distributorOverview';
  
export type AuthModalView = 'login' | 'register';

export type UserRole = 'kol' | 'agent_all' | 'distributor' | 'normal';

export interface User {
    nickname: string;
    avatarUrl: string;
    currency: string;
    balance: number; // 总现金余额
    lockedBalance: number; // 锁定现金余额
    bonusBalance: number;
    points: number; // 9Xcoin
    allAgentWithdrawable: number; // 全民代理可提现
    allAgentLocked: number; // 全民代理锁定
    kolCommission: number; // KOL 专属佣金
    vipLevel: number;
    isPaidUser: boolean;
    roles: UserRole[];
}

// 新增：用于转账的 KOL 简要信息
export interface InvitedKol {
    id: string;
    nickname: string;
    avatarUrl: string;
    kolId: string;
}

export interface QuickAccessItem {
  id: string;
  label:string;
  Icon?: React.FC<SVGIconProps>; 
  imageSrc: string; 
  description?: string; 
  navigateTo?: PageView;
}

export interface CategoryFilterItem {
  id: string;
  label: string;
  Icon: React.FC<SVGIconProps>;
  active?: boolean;
}

export type HomeCategory = 'slot' | 'live' | 'quick';
export type GameCategory = 'slot' | 'cards' | 'live' | 'quick' | 'blockchain' | 'table' | 'demo' | 'fishing' | 'sport' | 'hot' | 'recent' | 'favorite';

export interface Game {
  id: string;
  title: string;
  provider: string;
  imageSrc: string;
  category: GameCategory;
  providerId: string;
  tags?: string[];
  isFavorite?: boolean;
  orientation?: 'portrait' | 'landscape';
}

export interface GameBrand {
  id: string;
  name: string;
  logoUrl: string;
  providerId: string;
}

export interface BottomNavItem {
  id: string;
  label: string;
  Icon: React.FC<SVGIconProps>;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  Icon: React.FC<SVGIconProps>;
  subItems?: SidebarNavItem[];
  navigateTo?: PageView;
  categoryKey?: string;
  action?: () => void;
}

export interface SidebarPromoItem {
    id: string;
    label: string;
    description: string;
    imageSrc: string;
    bgColorClass: string;
    textColorClass: string;
    navigateTo: PageView;
}

export interface OffersTabItem {
  id: 'event_list' | 'my_bonuses' | 'vip_center' | 'mission' | 'history';
  label: string;
}

export interface OfferFilterTabItem {
    id: string;
    label: string;
}

// 奖励机制类型
export type RewardMechanismType = 'tiered_percentage' | 'tiered_fixed' | 'fixed_percentage' | 'fixed_value';
export type RewardItemType = 'bonus' | 'voucher';

export interface RewardTableEntry {
    condition: string; // 达到条件，如 "1000+" 或 "VIP 3"
    reward: string;    // 奖励数值，如 "10%" 或 "500"
}

export interface RewardConfig {
    mechanism: RewardMechanismType;
    rewardType: RewardItemType;
    exchangeRate?: string; // 如 "1 USDT ≈ 92.5 RUB"
    table?: RewardTableEntry[];
    fixedValue?: string;   // 固定值/比例时的数值
    minCondition?: string; // 最低参与门槛
}

// 活动周期配置
export type ActivityType = 'fixed' | 'daily' | 'weekly';
export interface CycleConfig {
    startTime?: string; // 格式 "HH:mm"
    endTime?: string;   // 格式 "HH:mm"
    startDay?: string;  // 如 "周五"
    endDay?: string;    // 如 "周日"
}

export interface PromotionalBanner {
    id: string;
    title: string;
    imageUrl: string;
    logoIcon?: React.FC<SVGIconProps>;
    logoText?: string;
    detailsTitle?: string;
    dateRange?: string; // 针对固定时间活动
    description?: string;
    participationSteps?: { number: number, htmlText: string }[];
    offerType?: string;
    amount?: string;
    subtitle?: string;
    targetUsers?: string[];
    targetPlatforms?: string[];
    rewardConfig?: RewardConfig;
    // 新增周期性配置
    activityType?: ActivityType;
    cycleConfig?: CycleConfig;
}

export interface GameProviderCollectionItem {
    id: string;
    name: string;
    subProviderName: string;
    imageSrc: string;
    providerId: string;
    orientation: 'portrait' | 'landscape';
}

export interface GameCollection {
    id: string;
    title: string;
    categoryKey: string;
    Icon: React.FC<SVGIconProps>;
    items: GameProviderCollectionItem[];
}

export interface WeeklyGameBannerData {
    id: string;
    title: string;
    providerName: string;
    game: Game;
}

export interface ProfileWalletSummary {
  id: string;
  label: string;
  amount: string;
  currency: string;
  isTotal?: boolean;
}

export interface ProfileQuickLink {
  id: string;
  label: string;
  description: string;
  Icon: React.FC<SVGIconProps>;
  navigateTo?: PageView;
  action?: () => void;
}

export type RewardCategory = 'bonus' | 'voucher';
export type BonusStatus = 'active' | 'locked' | 'pending_claim' | 'queued' | 'completed' | 'expired' | 'void';

export interface Bonus {
  id: string;
  title: string;
  category: RewardCategory;
  status: BonusStatus;
  expiresAt: number;
  principal: number; // 卷面金额 / Bonus本金
  maxWinnings?: number; // 最高可赢额 (针对 Bonus)
  lockedWinnings: number; // 当前余额 (针对 Bonus)
  rules: string;
  supportedGames?: string[]; // 支持的游戏/厂商列表
  wageringRequirement: {
    current: number;
    target: number;
  };
}

export interface VipPrivilege {
  id: string;
  name: string;
  description: string;
  icon: React.FC<SVGIconProps>;
}

export interface VipLevel {
  id: string;
  level: number;
  name: string;
  colorClass: string;
  bgColorClass: string;
  gradientFromClass: string;
  gradientToClass: string;
  betRequirement: number;
  depositRequirement: number;
  levelUpBonus: number;
  privileges: VipPrivilege[];
  dailyRebate: {
    slot: number;
    live: number;
    sport: number;
    fishing: number;
  };
  monthlyRebate: {
    slot: number;
    live: number;
    sport: number;
    fishing: number;
  };
  dailyWithdrawalCount: number;
  dailyWithdrawalLimit: number;
  weeklyBonus: number;
  fastWithdrawal: boolean;
  highlightIdentifier: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BettingHistoryTab {
  id: 'all' | 'won' | 'lost';
  label: string;
}

export interface BettingHistoryItem {
  id: string;
  gameName: string;
  gameProvider: string;
  gameType: 'slot' | 'live' | 'quick' | 'table';
  betAmount: number;
  payoutAmount: number;
  currency: string;
  status: 'won' | 'lost' | 'pending';
  betTime: number;
}

export interface TransactionHistoryTab {
  id: 'all' | 'deposit' | 'withdrawal';
  label: string;
}

export interface TransactionHistoryItem {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number; // 业务基础金额 (RUB)
  currency: string; // "RUB"
  method: string; // "USDT", "Bank Card" 等
  status: 'completed' | 'pending' | 'failed' | 'expired';
  timestamp: number;
  orderId: string;
  // 加密货币特定字段
  cryptoAmount?: number; // 充值：用户支付；提现：实际到账
  cryptoCurrency?: string;
  network?: string;
  exchangeRate?: number;
  platformFee?: number; // RUB
  networkFee?: number; // Crypto
  expiryTime?: number; // 如果是 pending 状态的支付有效期限
}

export interface Bank {
  id: string;
  name: string;
}

export interface UserBankCard {
  id: string;
  bankName: string;
  accountNumber: string;
  logoUrl: string;
}

export interface CryptoNetwork {
  id: string;
  name: string;
}

export interface CryptoWithdrawalCurrency {
  id: string;
  name: string;
  Icon: React.FC<SVGIconProps>;
  networks: CryptoNetwork[];
}

export interface UserCryptoAddress {
  id: string;
  label: string;
  currency: string;
  network: string;
  address: string;
}

export interface DepositPromo {
  id: string;
  title: string;
  description: string;
  minDeposit: number;
  bonusType: 'fixed' | 'percentage';
  bonusValue: number;
  bonusText: string;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface HistoricalActivityItem {
  id: string;
  activityName: string;
  reward: string;
  participationTime: number;
  status: 'Ongoing' | 'Ended';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface MissionAction {
  type: 'navigate' | 'external';
  page?: string;
  categoryKey?: string;
  offerId?: string;
  ctaLabel?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  taskType: string;
  Icon: React.FC<SVGIconProps>;
  reward: string;
  progress?: {
    current: number;
    target: number;
  };
  action: MissionAction;
}

export interface ActivityChest {
  id: number;
  level: number;
  points: number;
  bonus: string;
}

export interface JackpotWinner {
  id: string;
  username: string;
  avatarUrl: string;
  amount: number;
  game: string;
}

export interface JackpotReward {
  id: string;
  title: string;
  source: string;
  amount: number;
  status: 'claimable' | 'claimed';
  expiry?: number;
  claimedAt?: number;
}

export interface JackpotLeaderboardEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  contribution: number;
}

export type ChannelGroup = 'VK' | 'Facebook' | 'Twitter' | 'Telegram';
export type ChannelStatus = 'active' | 'paused' | 'removed';

export interface PromotionChannel {
  id: string;
  name: string;
  group: ChannelGroup;
  link: string;
  qrCodeUrl: string;
  effectiveUsers: number;
  registrations: number;
  status: ChannelStatus;
}

export interface ReferredUser {
  id: string;
  userId: string;
  registrationTime: number;
  depositAmount: number;
  principalBettingMultiple: number;
  commissionContribution: number;
  channel: string;
}

export interface CommissionRecord {
  id: string;
  date: number;
  currency: string;
  dailyRecharge: number;
  dailyBet: number;
  totalCommission: number;
  breakdown: {
    status: 'Paid' | 'Hold' | 'Reviewing';
    notes?: string;
    byChannel: { name: string; amount: number }[];
    byPlayer: { name: string; amount: number }[];
  };
}

export type KolAgentTab = 'kolOverview' | 'channelManagement' | 'friendList' | 'commissionList';

export interface CommissionEarningRule {
  id: string;
  condition: string;
  unlockPercentage: number;
}

export interface HomeOffer {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  bgClassName: string;
  graphicImageUrl?: string;
  action: MissionAction;
}

export interface GameListProviderFilter { id: string; name: string; Icon?: React.FC<SVGIconProps>; }
export interface AgentTopTabItem { id: string; label: string; }
export interface SocialShareIconType { id: string; Icon: React.FC<SVGIconProps>; }
export interface RewardHistoryItem { id: string; type: string; date: string; amount: string; }
export interface AgentMonthlyStats { month: string; profit: number; commission: number; }
export interface CommissionDetailItem { label: string; value: string; }
export interface PosterTemplate { imageUrl: string; }
export interface InvitationGuideStep { number: number; text: string; Icon: React.FC<SVGIconProps>; }
export interface CryptoCurrency { id: string; name: string; Icon: React.FC<SVGIconProps>; }
