/**
 * GrowMate API Client Layer
 */

import { offlineStorage } from "./offlineStorage.js";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getGuestId() {
  let guestId = localStorage.getItem("growmate_guest_id");
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("growmate_guest_id", guestId);
  }
  return guestId;
}

async function request(endpoint, options = {}) {
  const headers = {
    "x-guest-id": getGuestId(),
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.error || `HTTP ${res.status}: Failed request`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If offline, check if we have cached data for GET requests
    if (!navigator.onLine && options.method === undefined || options.method === "GET") {
      console.warn(`Device is offline. Attempting local cache for ${endpoint}`);
    }
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => request("/health"),

  // Garden Profile
  getGarden: () => request("/garden"),
  saveGarden: (gardenData) => request("/garden", {
    method: "PUT",
    body: JSON.stringify(gardenData)
  }),

  // Plants
  getPlants: () => request("/plants"),
  getPlantById: (id) => request(`/plants/${id}`),
  createPlant: (plantData) => request("/plants", {
    method: "POST",
    body: JSON.stringify(plantData)
  }),
  updatePlant: (id, updateData) => request(`/plants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateData)
  }),
  deletePlant: (id) => request(`/plants/${id}`, {
    method: "DELETE"
  }),

  // Garden Planner (Gemma 3 4B IT)
  generatePlan: (planParams) => request("/garden/plan", {
    method: "POST",
    body: JSON.stringify(planParams)
  }),
  getLatestPlan: () => request("/garden/plan/latest"),
  adoptPlanPlants: (plants) => request("/garden/plan/adopt", {
    method: "POST",
    body: JSON.stringify({ plants })
  }),

  // Plant Health Scanner (PlantVillage ViT)
  diagnoseLeaf: (formData) => request("/plants/diagnose", {
    method: "POST",
    body: formData
  }),
  getDiagnoses: () => request("/diagnoses"),

  // Touch Grass Missions
  getTodayMission: () => request("/missions/today"),
  completeMission: (id, note, photo) => request(`/missions/${id}/complete`, {
    method: "POST",
    body: JSON.stringify({ completionNote: note, completionPhoto: photo })
  }),
  getMissionHistory: () => request("/missions/history"),

  // Care Tasks
  getTasks: (status = "all") => request(`/tasks?status=${status}`),
  createTask: (taskData) => request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData)
  }),
  completeTask: (id, isCompleted = true) => request(`/tasks/${id}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ isCompleted })
  }),
  deleteTask: (id) => request(`/tasks/${id}`, {
    method: "DELETE"
  })
};
