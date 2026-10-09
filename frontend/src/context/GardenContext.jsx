import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";
import { offlineStorage } from "../services/offlineStorage.js";

const GardenContext = createContext(null);

export function GardenProvider({ children }) {
  const [garden, setGarden] = useState(null);
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todayMission, setTodayMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notification, setNotification] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("You're back online! Syncing latest data...", "success");
      refreshAll();
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("You are offline. Showing cached plans & missions.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  const refreshGarden = useCallback(async () => {
    try {
      const res = await api.getGarden();
      if (res.success && res.data) {
        setGarden(res.data);
      }
    } catch (e) {
      console.warn("Could not load garden:", e);
    }
  }, []);

  const refreshPlants = useCallback(async () => {
    try {
      const res = await api.getPlants();
      if (res.success && res.data) {
        setPlants(res.data);
      }
    } catch (e) {
      console.warn("Could not load plants:", e);
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const res = await api.getTasks();
      if (res.success && res.data) {
        setTasks(res.data);
        offlineStorage.saveTasks(res.data);
      }
    } catch (e) {
      const cached = offlineStorage.getCachedTasks();
      if (cached.length > 0) setTasks(cached);
    }
  }, []);

  const refreshTodayMission = useCallback(async () => {
    try {
      const res = await api.getTodayMission();
      if (res.success && res.data) {
        setTodayMission(res.data);
        offlineStorage.saveTodayMission(res.data);
      }
    } catch (e) {
      const cached = offlineStorage.getCachedTodayMission();
      if (cached?.data) {
        setTodayMission(cached.data);
      }
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      refreshGarden(),
      refreshPlants(),
      refreshTasks(),
      refreshTodayMission()
    ]);
    setLoading(false);
  }, [refreshGarden, refreshPlants, refreshTasks, refreshTodayMission]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const completeTaskItem = async (taskId, isCompleted = true) => {
    try {
      await api.completeTask(taskId, isCompleted);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted, completedAt: isCompleted ? new Date() : null } : t))
      );
      showToast(isCompleted ? "Task completed! Great job." : "Task marked pending.", "success");
      refreshPlants();
    } catch (e) {
      showToast("Could not update task. Check connection.", "error");
    }
  };

  const completeMissionItem = async (missionId, note, photo) => {
    try {
      const res = await api.completeMission(missionId, note, photo);
      if (res.success) {
        setTodayMission((prev) => prev ? { ...prev, isCompleted: true, completedAt: new Date(), completionNote: note } : null);
        showToast("🌿 Touch Grass mission completed! Awesome outdoor action.", "success");
      }
    } catch (e) {
      showToast("Could not record mission completion.", "error");
    }
  };

  return (
    <GardenContext.Provider
      value={{
        garden,
        plants,
        tasks,
        todayMission,
        loading,
        isOnline,
        notification,
        showToast,
        refreshAll,
        refreshGarden,
        refreshPlants,
        refreshTasks,
        refreshTodayMission,
        completeTaskItem,
        completeMissionItem,
        setGarden
      }}
    >
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error("useGarden must be used within a GardenProvider");
  }
  return context;
}
