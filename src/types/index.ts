export type StampType = 'good' | 'nice' | 'great' | 'wow' | 'perfect';

export interface StampEntry {
  id: string;
  type: StampType;
  earnedAt: string;
}

export interface Child {
  id: string;
  name: string;
  avatarEmoji: string;
  stars: number;
  stamps: StampEntry[];
  streak: number;
  lastCompletedDate: string;
}

export interface Mission {
  id: string;
  title: string;
  icon: string;
  target: number;
  completed: number;
  date: string;
}

export interface DailyMissionTemplate {
  id: string;
  title: string;
  icon: string;
  target: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  available: boolean;
}

export interface RewardExchange {
  id: string;
  rewardId: string;
  rewardName: string;
  childId: string;
  exchangedAt: string;
}

export interface AppUser {
  id: string;
  username: string;
  password: string;
  parentPin: string;
  children: Child[];
  missionTemplates: DailyMissionTemplate[];
  rewards: Reward[];
  rewardExchanges: RewardExchange[];
  dailyMissions: { [date: string]: Mission[] };
}
