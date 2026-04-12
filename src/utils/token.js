import { request } from './request';

export async function refreshToken() {
  const refreshData = await request('auth/token', {
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

  localStorage.setItem('accessToken', refreshData.accessToken);
  localStorage.setItem('refreshToken', refreshData.refreshToken);

  return refreshData;
}

export async function fetchWithRefresh(endpoint, options) {
  try {
    return await request(endpoint, options);
  } catch (error) {
    if (
      error.statusCode === 401 ||
      (error.statusCode === 403 && localStorage.getItem('refreshToken'))
    ) {
      const refreshData = await refreshToken();

      return request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken,
        },
      });
    } else {
      throw error;
    }
  }
}
