// ── Role helpers (better-auth stores multi-roles as comma-separated strings) ──

export function getRoles(roleString: string | undefined | null): string[] {
  if (!roleString) return [];
  return roleString.split(',').map(r => r.trim()).filter(Boolean);
}

export function hasRole(roleString: string | undefined | null, role: string): boolean {
  return getRoles(roleString).includes(role);
}

export function hasAnyRole(roleString: string | undefined | null, roles: string[]): boolean {
  const userRoles = getRoles(roleString);
  return roles.some(r => userRoles.includes(r));
}