import { URL } from '@utils/constants.js';

// Кастомная ошибка для ошибок с сервера
class ServerError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Функция проверки ответа от сервера
export async function checkResponse(response) {
  const res = await response.json();

  if (response.ok) {
    return res;
  }

  throw new ServerError(res.message, response.status);
}

// Функция отправки запроса
export async function request(endpoint, options) {
  const response = await fetch(`${URL}/api/${endpoint}`, {
    ...options,
  });

  return await checkResponse(response);
}
