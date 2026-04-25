import type { NavItem } from "@/config/navigation";

export const ENTERPRISE_SIDEBAR_IMAGE_URL = "/sidebar-bg.png";

export function groupNavItems(
  items: NavItem[],
): { group: string; items: NavItem[] }[] {
  const map = new Map<string, NavItem[]>();

  for (const item of items) {
    const key = item.group ?? "";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  }

  return Array.from(map.entries()).map(([group, groupItems]) => ({
    group,
    items: groupItems,
  }));
}

export function isSidebarItemActive(itemPath: string, location: string) {
  const isDashboard = itemPath === "/enterprise" || itemPath === "/app";

  return isDashboard
    ? location === itemPath
    : location === itemPath ||
        (itemPath !== "/" && location.startsWith(itemPath));
}
