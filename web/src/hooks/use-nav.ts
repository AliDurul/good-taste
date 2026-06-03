// hooks/use-nav.ts
import { useMemo } from "react"
import navConfig from "@/lib/nav-config"
import { hasAnyRole } from "@/lib/utils"

export function useFilteredNav(roleString: string | undefined | null) {
  return useMemo(() => {
    return navConfig
      .filter((item) => hasAnyRole(roleString, item.roles))
      .map((item) => ({
        ...item,
        items: item.items?.filter((sub) => hasAnyRole(roleString, sub.roles)),
      }))
  }, [roleString])
}