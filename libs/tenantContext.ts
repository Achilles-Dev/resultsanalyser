import { AsyncLocalStorage } from 'async_hooks';

interface TenantStore {
  tenantId: string | null; // UUID string
}

const asyncLocalStorage = new AsyncLocalStorage<TenantStore>();

export function getCurrentTenantId(): string | null {
  const store = asyncLocalStorage.getStore();
  return store?.tenantId ?? null;
}

export function runWithTenant<T>(tenantId: string | null, callback: () => T): T {
  return asyncLocalStorage.run({ tenantId }, callback);
}

// Optional: for scripts / tests where no request context exists
let fallbackTenantId: string | null = null;
export function setFallbackTenantId(id: string | null) {
  fallbackTenantId = id;
}
export function getFallbackTenantId(): string | null {
  return fallbackTenantId;
}