import { cookies } from 'next/headers';
import { BASE_URL } from '@/lib/config';

export const ACCESS_TOKEN_COOKIE = 'sms_access_token';
export const REFRESH_TOKEN_COOKIE = 'sms_refresh_token';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAuthTokens() {
  const cookieStore = cookies();
  return {
    access: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null,
    refresh: cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null,
  };
}

async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.access || null;
}

function buildUrl(path, params = {}) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.detail) return String(data.detail);
  if (data.message) return String(data.message);

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    if (Array.isArray(value)) return `${firstKey}: ${value.join(', ')}`;
    if (typeof value === 'string') return `${firstKey}: ${value}`;
  }

  return fallback;
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    params,
    accessToken,
    retryOnUnauthorized = true,
  } = options;

  const tokens = getAuthTokens();
  let token = accessToken ?? tokens.access;

  const headers = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (response.status === 401 && retryOnUnauthorized && tokens.refresh) {
    const newAccess = await refreshAccessToken(tokens.refresh);
    if (newAccess) {
      token = newAccess;
      response = await fetch(buildUrl(path, params), {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${newAccess}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      });
    }
  }

  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data
    );
  }

  return data;
}

export async function apiGet(path, params, options = {}) {
  return apiRequest(path, { ...options, method: 'GET', params });
}

export async function apiPost(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'POST', body });
}

export async function apiPut(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'PUT', body });
}

export async function apiPatch(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'PATCH', body });
}

export async function apiDelete(path, options = {}) {
  return apiRequest(path, { ...options, method: 'DELETE' });
}

export async function fetchAllPages(path, params = {}, options = {}) {
  const pageSize = params.page_size || 100;
  let page = 1;
  let allResults = [];
  let hasMore = true;

  while (hasMore) {
    const response = await apiGet(
      path,
      { ...params, page, page_size: pageSize },
      options
    );

    if (Array.isArray(response)) {
      return response;
    }

    const results = response.results || [];
    allResults = allResults.concat(results);
    hasMore = Boolean(response.next);
    page += 1;
  }

  return allResults;
}
