import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppUser, Child, Mission, DailyMissionTemplate,
  Reward, StampType, StampEntry, RewardExchange,
} from '../types';
import {
  getCurrentUserId, setCurrentUserId,
  getCurrentChildId, setCurrentChildId,
} from '../utils/storage';
import {
  findUserByCredentials, getUserById,
  checkUsernameAvailable, saveUser, syncUser,
} from '../utils/firestore';
import { getTodayString, getYesterdayString } from '../utils/dateUtils';

export const DEFAULT_MISSIONS: DailyMissionTemplate[] = [
  { id: 'm1', title: '양치하기', icon: '🪷', target: 1 },
  { id: 'm2', title: '책 읽기',  icon: '📚', target: 1 },
  { id: 'm3', title: '정리하기', icon: '🧺', target: 1 },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', name: '공룡 인형',     description: '규여운 공룡 친구',     cost: 20, emoji: '🦕', available: true },
  { id: 'r2', name: '특별 노트',     description: '반짝이는 스티커 노트', cost: 15, emoji: '📓', available: true },
  { id: 'r3', name: '크레용 세트',  description: '알록달록 12색 크레용',   cost: 25, emoji: '🖍️', available: true },
  { id: 'r4', name: '칭찬 스티커 팬', description: '다양한 칭찬 스티커',  cost: 10, emoji: '⭐', available: true },
];

interface AppContextType {
  currentUser: AppUser | null;
  currentChild: Child | null;
  isLoading: boolean;
  isParentAuthed: boolean;
  setParentAuthed: (value: boolean) => void;
  loginUser: (username: string, pin: string) => Promise<AppUser | null>;
  registerUser: (username: string, pin: string) => Promise<'success' | 'taken' | 'error'>;
  logoutUser: () => void;
  setActiveChild: (childId: string) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isParentAuthed, setIsParentAuthed] = useState(false);

  useEffect(() => {
    const id = getCurrentUserId();
    if (!id) { setIsLoading(false); return; }
    getUserById(id).then(user => {
      if (user) {
        setCurrentUser(user);
        const childId = getCurrentChildId();
        const child = childId ? user.children.find(c => c.id === childId) || null : null;
        setCurrentChild(child);
      } else {
        setCurrentUserId(null);
        setCurrentChildId(null);
      }
      setIsLoading(false);
    });
  }, []);

  const applyUser = (user: AppUser, persist = true) => {
    setCurrentUser(user);
    const childId = getCurrentChildId();
    const child = childId ? user.children.find(c => c.id === childId) || null : null;
    setCurrentChild(child);
    if (persist) syncUser(user);
  };

  const loginUser = async (username: string, pin: string): Promise<AppUser | null> => {
    const user = await findUserByCredentials(username, pin);
    if (!user) return null;
    setCurrentUserId(user.id);
    const childId = user.children[0]?.id || null;
    if (childId) setCurrentChildId(childId);
    setCurrentUser(user);
    const child = childId ? user.children.find(c => c.id === childId) || null : null;
    setCurrentChild(child);
    setIsParentAuthed(false);
    return user;
  };

  const registerUser = async (
    username: string,
    pin: string
  ): Promise<'success' | 'taken' | 'error'> => {
    const available = await checkUsernameAvailable(username);
    if (!available) return 'taken';
    const newUser: AppUser = {
      id: Date.now().toString(),
      username, password: pin, parentPin: pin,
      children: [],
      missionTemplates: [...DEFAULT_MISSIONS],
      rewards: [...DEFAULT_REWARDS],
      rewardExchanges: [],
      dailyMissions: {},
    };
    const ok = await saveUser(newUser);
    if (!ok) return 'error';
    setCurrentUserId(newUser.id);
    setCurrentUser(newUser);
    setCurrentChild(null);
    setIsParentAuthed(false);
    return 'success';
  };

  const logoutUser = () => {
    setCurrentUserId(null);
    setCurrentChildId(null);
    setCurrentUser(null);
    setCurrentChild(null);
    setIsParentAuthed(false);
  };

  const setParentAuthed = (value: boolean) => {
    setIsParentAuthed(value);
  };

  const setActiveChild = (childId: string) => {
    setCurrentChildId(childId);
    if (currentUser) {
      const child = currentUser.children.find(c => c.id === childId) || null;
      setCurrentChild(child);
    }
  };

  const getTodayMissions = (): Mission[] => {
    if (!currentUser) return [];
    const today = getTodayString();
    const existing = currentUser.dailyMissions[today] || [];

    const synced = currentUser.missionTemplates.map(t => {
      const found = existing.find(m => m.id === t.id);
      return found
        ? { ...found, title: t.title, icon: t.icon, target: t.target, date: today }
        : { id: t.id, title: t.title, icon: t.icon, target: t.target, completed: 0, date: today };
    });

    return synced;
  };

  const completeMission = (missionId: string) => {
    if (!currentUser) return;
    const today = getTodayString();
    const missions = getTodayMissions();
    const updated = missions.map(m =>
      m.id === missionId && m.completed < m.target ? { ...m, completed: m.completed + 1 } : m
    );
    applyUser({ ...currentUser, dailyMissions: { ...currentUser.dailyMissions, [today]: updated } });
  };

  const giveStamp = (childId: string, stampType: StampType) => {
    if (!currentUser) return;
    const stamp: StampEntry = { id: Date.now().toString(), type: stampType, earnedAt: new Date().toISOString() };
    const today = getTodayString();
    const yesterday = getYesterdayString();
    const updatedChildren = currentUser.children.map(c => {
      if (c.id !== childId) return c;
      const newStreak =
        c.lastCompletedDate === yesterday ? c.streak + 1 :
        c.lastCompletedDate === today    ? c.streak     : 1;
      return { ...c, stamps: [...c.stamps, stamp], stars: c.stars + 1, streak: newStreak, lastCompletedDate: today };
    });
    applyUser({ ...currentUser, children: updatedChildren });
  };

  const updateMissionTemplates = (templates: DailyMissionTemplate[]) => {
    if (!currentUser) return;
    const today = getTodayString();
    const existing = currentUser.dailyMissions[today] || [];
    const syncedTodayMissions = templates.map(t => {
      const found = existing.find(m => m.id === t.id);
      return found
        ? { ...found, title: t.title, icon: t.icon, target: t.target, date: today }
        : { id: t.id, title: t.title, icon: t.icon, target: t.target, completed: 0, date: today };
    });

    applyUser({
      ...currentUser,
      missionTemplates: templates,
      dailyMissions: {
        ...currentUser.dailyMissions,
        [today]: syncedTodayMissions,
      },
    });
  };

  const updateRewards = (rewards: Reward[]) => {
    if (!currentUser) return;
    applyUser({ ...currentUser, rewards });
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
    applyUser({ ...currentUser, children: updatedChildren, rewardExchanges: [...currentUser.rewardExchanges, exchange] });
    return exchange;
  };

  const addChild = (child: Child) => {
    if (!currentUser) return;
    const updated = { ...currentUser, children: [...currentUser.children, child] };
    setCurrentChildId(child.id);
    setCurrentChild(child);
    setCurrentUser(updated);
    syncUser(updated);
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentChild, isLoading, isParentAuthed, setParentAuthed,
      loginUser, registerUser, logoutUser, setActiveChild,
      getTodayMissions, completeMission, giveStamp,
      updateMissionTemplates, updateRewards, exchangeReward, addChild,
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
