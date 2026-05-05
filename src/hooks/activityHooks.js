import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches activities for a specific module.
 * @param {string} module - Module name (e.g., 'lead', 'firm', 'client', 'invoice', 'organization', 'user', 'tax').
 * @param {number} [page=1] - Page number.
 * @param {number} [limit=50] - Items per page.
 */
export const getActivitiesByModule = async (module, page = 1, limit = 50) => {
  const response = await axios.get(`/activities/module/${module}?page=${page}&limit=${limit}`);
  return response;
};

/**
 * Fetches activities for all modules.
 * @param {number} [page=1] - Page number.
 * @param {number} [limit=10] - Items per page.
 */
export const getAllModuleActivities = async (page = 1, limit = 10) => {
  const modules = ["organization", "firm", "lead", "invoice", "client", "tax", "user"];
  const results = await Promise.allSettled(
    modules.map((mod) => axios.get(`/activities/module/${mod}?page=${page}&limit=${limit}`))
  );

  const activities = [];
  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    const payload = result.value?.data;
    const arr = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.activities)
        ? payload.activities
        : [];
    arr.forEach((activity) => {
      activities.push({ ...activity, module: activity.module || modules[index] });
    });
  });

  return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Deletes an activity by ID.
 * @param {string} id - Activity ID.
 */
export const deleteActivity = async (id) => {
  const response = await axios.delete(`/activities/${id}`);
  return response;
};
