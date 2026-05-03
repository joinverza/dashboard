import type { NavItem } from "@/config/navigation";

export const ENTERPRISE_SIDEBAR_IMAGE_URL = "/sidebar-bg.png";
const DROPDOWN_GROUPS = new Set(["OPERATIONS", "OVERSIGHT", "PLATFORM"]);

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
  const isDashboard = new Set([
    "/app",
    "/verifier",
    "/enterprise",
    "/manager",
    "/admin",
  ]).has(itemPath);

  return isDashboard
    ? location === itemPath
    : location === itemPath ||
        (itemPath !== "/" && location.startsWith(itemPath));
}

export function isSidebarDropdownGroup(group: string, enabled: boolean) {
  return enabled && DROPDOWN_GROUPS.has(group);
}

export function groupHasActiveItem(items: NavItem[], location: string) {
  return items.some((item) => isSidebarItemActive(item.path, location));
}
