import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1"  
});

export const fetchStatsSummary = async (params = {}) => {
  const { data } = await api.get("/stats/summary", { params });
  return data;
};

export const fetchStatsActivity = async (params = {}) => {
  const { data } = await api.get("/stats/chart/activity", { params });
  return data;
};

export const fetchStatsDecisions = async (params = {}) => {
  const { data } = await api.get("/stats/chart/decisions", { params });
  return data;
};

export const fetchStatsCategories = async (params = {}) => {
  const { data } = await api.get("/stats/chart/categories", { params });
  return data;
};
