import { URL } from '@utils/constants.js';

type ApiResponse<T> = {
  success: boolean; // true или false
  data?: T; // данные (если успех)
  message?: string; // ошибка (если неудача)
};

// Кастомная ошибка для ошибок с сервера
class ServerError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Функция проверки ответа от сервера
export async function checkResponse<T>(response: Response): Promise<T> {
  const res: ApiResponse<T> = await response.json();

  if (response.ok) {
    return res as T;
  }

  throw new ServerError(res.message || 'Unknown error', response.status);
}

// Функция отправки запроса
export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${URL}/api/${endpoint}`, {
    ...options,
  });

  return await checkResponse<T>(response);
}
