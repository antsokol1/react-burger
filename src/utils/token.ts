import { request } from './request';

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  success: boolean;
};

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const refreshData = await request<RefreshTokenResponse>('auth/token', {
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const accessToken = refreshData.accessToken.replace('Bearer ', '');
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshData.refreshToken);

  return refreshData;
}

export async function fetchWithRefresh<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await request<T>(endpoint, options);
  } catch (error: unknown) {
    // Проверяем тип ошибки
    const err = error as { statusCode?: number; message?: string };

    const needRefresh =
      err.statusCode === 401 ||
      (err.statusCode === 403 && localStorage.getItem('refreshToken'));

    if (needRefresh) {
      const refreshData = await refreshToken();

      const newHeaders = {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
        authorization: `Bearer ${refreshData.accessToken}`,
      };

      return await request<T>(endpoint, {
        ...options,
        headers: newHeaders,
      });
    }

    throw error;
  }
}
