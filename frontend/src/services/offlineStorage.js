/**
 * Offline Local Storage Helper for GrowMate
 * Caches garden plans, tasks, and daily missions for offline balcony gardening.
 */

const STORAGE_KEYS = {
  GARDEN_PLAN: "growmate_cached_plan",
  TODAY_MISSION: "growmate_cached_mission",
  PENDING_TASKS: "growmate_cached_tasks",
  GARDEN_PROFILE: "growmate_cached_profile",
  OFFLINE_ACTIONS: "growmate_offline_sync_queue"
};

export const offlineStorage = {
  saveGardenPlan(plan) {
    try {
      localStorage.setItem(STORAGE_KEYS.GARDEN_PLAN, JSON.stringify({
        data: plan,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn("Could not cache plan locally:", e);
    }
  },

  getCachedGardenPlan() {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.GARDEN_PLAN);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  saveTodayMission(mission) {
    try {
      localStorage.setItem(STORAGE_KEYS.TODAY_MISSION, JSON.stringify({
        data: mission,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn("Could not cache mission locally:", e);
    }
  },

  getCachedTodayMission() {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.TODAY_MISSION);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_TASKS, JSON.stringify(tasks));
    } catch (e) {}
  },

  getCachedTasks() {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.PENDING_TASKS);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      return [];
    }
  },

  queueOfflineAction(action) {
    try {
      const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS) || "[]");
      queue.push({ ...action, queuedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(queue));
    } catch (e) {}
  },

  getOfflineActionQueue() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS) || "[]");
    } catch (e) {
      return [];
    }
  },

  clearOfflineQueue() {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS);
  }
};
