import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser, Child, Mission, DailyMissionTemplate, Reward, StampType, StampEntry, RewardExchange } from '../types';
import {
  getCurrentUser,
  updateUser,
  setCurrentUserId as storageSaveUserId,
  setCurrentChildId as storageSaveChildId,
  getCurrentChildId,
} from '../utils/storage';
import { getTodayString, getYesterdayString } from '../utils/dateUtils';

export const DEFAULT_MISSIONS: DailyMissionTemplate[] = [
  { id: 'm1', title: '양치하기', icon: '🪷', target: 1 },
  { id: 'm2', title: '책 읽기', icon: '📚', target: 1 },
  { id: 'm3', title: '정리하기', icon: '🧺', target: 1 },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', name: '공룡 인형', description: '규여운 공룡 친구', cost: 20, emoji: '🦕', available: true },
  { id: 'r2', name: '특별 노트', description: '반짝이는 스티커 노트', cost: 15, emoji: '📓', available: true },
  { id: 'r3', name: '크레용 세트', description: '알록달록 12색 크레용', cost: 25, emoji: '🖍️', available: true },
  { id: 'r4', name: '칭찬 스티커 팬', description: '다양한 칭찬 스티커', cost: 10, emoji: '⭐', available: true },
];

interface AppContextType {
  currentUser: AppUser | null;
  currentChild: Child | null;
  loginUser: (id: string, childId?: string) => void;
  logoutUser: () => void;
  setActiveChild: (childId: string) => void;
  refreshUser: () => void;
  getTodayMissions: () => Mission[];
  completeMission: (missionId: string) => void;
  giveStamp: (childId: string, stampType: StampType) => void;
  updateMissionTemplates: (templates: DailyMissionTemplate[]) => void;
  updateRewards: (rewards: Reward[]) => void;
  exchangeReward: (rewardId: string) => RewardExchange | null;
  addChild: (child: Child) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);

  const refreshUser = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const childId = getCurrentChildId();
      const child = childId ? user.children.find(c => c.id === childId) || null : null;
      setCurrentChild(child);
    } else {
      setCurrentChild(null);
    }
  };

  useEffect(() => { refreshUser(); }, []);

  const loginUser = (id: string, childId?: string) => {
    storageSaveUserId(id);
    if (childId) storageSaveChildId(childId);
    refreshUser();
  };

  const logoutUser = () => {
    storageSaveUserId(null);
    storageSaveChildId(null);
    setCurrentUser(null);
    setCurrentChild(null);
  };

  const setActiveChild = (childId: string) => {
    storageSaveChildId(childId);
    refreshUser();
  };

  const persistUser = (user: AppUser) => {
    updateUser(user);
    setCurrentUser(user);
    const childId = getCurrentChildId();
    const child = childId ? user.children.find(c => c.id === childId) || null : null;
    setCurrentChild(child);
  };

  const getTodayMissions = (): Mission[] => {
    if (!currentUser) return [];
    const today = getTodayString();
    const existing = currentUser.dailyMissions[today];
    if (existing) return existing;
    return currentUser.missionTemplates.map(t => ({
      id: t.id, title: t.title, icon: t.icon, target: t.target, completed: 0, date: today,
    }));
  };

  const completeMission = (missionId: string) => {
    if (!currentUser) return;
    const today = getTodayString();
    const missions = getTodayMissions();
    const updated = missions.map(m =>
      m.id === missionId && m.completed < m.target ? { ...m, completed: m.completed + 1 } : m
    );
    persistUser({ ...currentUser, dailyMissions: { ...currentUser.dailyMissions, [today]: updated } });
  };

  const giveStamp = (childId: string, stampType: StampType) => {
    if (!currentUser) return;
    const stamp: StampEntry = { id: Date.now().toString(), type: stampType, earnedAt: new Date().toISOString() };
    const today = getTodayString();
    const yesterday = getYesterdayString();
    const updatedChildren = currentUser.children.map(c => {
      if (c.id !== childId) return c;
      const newStreak = c.lastCompletedDate === yesterday ? c.streak + 1 :
        c.lastCompletedDate === today ? c.streak : 1;
      return { ...c, stamps: [...c.stamps, stamp], stars: c.stars + 1, streak: newStreak, lastCompletedDate: today };
    });
    persistUser({ ...currentUser, children: updatedChildren });
  };

  const updateMissionTemplates = (templates: DailyMissionTemplate[]) => {
    if (!currentUser) return;
    persistUser({ ...currentUser, missionTemplates: templates });
  };

  const updateRewards = (rewards: Reward[]) => {
    if (!currentUser) return;
    persistUser({ ...currentUser, rewards });
  };

  const exchangeReward = (rewardId: string): RewardExchange | null => {
    if (!currentUser || !currentChild) return null;
    const reward = currentUser.rewards.find(r => r.id === rewardId);
    if (!reward || currentChild.stars < reward.cost) return null;
    const exchange: RewardExchange = {
      id: Date.now().toString(), rewardId, rewardName: reward.name,
      childId: currentChild.id, exchangedAt: new Date().toISOString(),
    };
    const updatedChildren = currentUser.children.map(c =>
      c.id === currentChild.id ? { ...c, stars: c.stars - reward.cost } : c
    );
    persistUser({ ...currentUser, children: updatedChildren, rewardExchanges: [...currentUser.rewardExchanges, exchange] });
    return exchange;
  };

  const addChild = (child: Child) => {
    if (!currentUser) return;
    const updated = { ...currentUser, children: [...currentUser.children, child] };
    updateUser(updated);
    setCurrentUser(updated);
    storageSaveChildId(child.id);
    setCurrentChild(child);
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentChild, loginUser, logoutUser, setActiveChild, refreshUser,
      getTodayMissions, completeMission, giveStamp, updateMissionTemplates, updateRewards, exchangeReward, addChild,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
