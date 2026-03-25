import User from "@/lib/models/User";

export function normalizeWallet(wallet = "") {
  return String(wallet).trim().toLowerCase();
}

export function isConfiguredAdminWallet(wallet) {
  const normalized = normalizeWallet(wallet);
  if (!normalized) return false;
  const allowed = (process.env.ADMIN_WALLETS || "")
    .split(",")
    .map((entry) => normalizeWallet(entry))
    .filter(Boolean);
  return allowed.includes(normalized);
}

export async function isAdminWallet(wallet) {
  const normalized = normalizeWallet(wallet);
  if (!normalized) return false;

  if (isConfiguredAdminWallet(normalized)) {
    return true;
  }

  const user = await User.findOne({ metaid: normalized }).select("role");
  return user?.role === "admin";
}
