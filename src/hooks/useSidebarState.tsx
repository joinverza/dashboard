import { useState, useEffect } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("verza-sidebar-collapsed");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("verza-sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed((prev: boolean) => !prev);

  return { collapsed, toggle, setCollapsed };
}
