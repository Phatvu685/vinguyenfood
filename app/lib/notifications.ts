export type NotificationType =
  | "order"
  | "product"
  | "category"
  | "voucher"
  | "customer"
  | "finance"
  | "inventory"
  | "promotion"
  | "content"
  | "permissions"
  | "system";

export interface AdminNotification {
  id: string;
  title: string;
  type: NotificationType;
  time: string;
  read: boolean;
  message?: string;
  targetTab?: string;
}

export const NOTIFICATIONS_STORAGE_KEY = "gao-ngon-notifications";
export const NOTIFICATIONS_UPDATED_EVENT = "gao-ngon-notifications-updated";

export function getAdminNotifications(): AdminNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addAdminNotification(
  title: string,
  type: NotificationType = "system",
  message?: string,
  targetTab?: string
): AdminNotification {
  const newNotif: AdminNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    type,
    time: new Date().toISOString(),
    read: false,
    message,
    targetTab,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getAdminNotifications();
      const next = [newNotif, ...current].slice(0, 100);
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
    } catch {
      // safe fallback
    }
  }

  return newNotif;
}

export function markNotificationAsRead(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getAdminNotifications();
    const next = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  } catch {}
}

export function markAllNotificationsAsRead() {
  if (typeof window === "undefined") return;
  try {
    const current = getAdminNotifications();
    const next = current.map((n) => ({ ...n, read: true }));
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  } catch {}
}

export function deleteNotification(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getAdminNotifications();
    const next = current.filter((n) => n.id !== id);
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  } catch {}
}

export function clearAllNotifications() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  } catch {}
}

export function formatNotificationTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
