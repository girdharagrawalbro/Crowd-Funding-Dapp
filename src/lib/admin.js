// Admin utility — no longer wallet-based

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").map(id => id.trim()).filter(Boolean);

export function isAdminUser(userId) {
  if (!userId) return false;
  return ADMIN_USER_IDS.includes(userId);
}