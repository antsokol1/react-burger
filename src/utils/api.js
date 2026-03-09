import { INGREDIENTS_URL } from './constants';

export const getIngredients = () => {
  console.log('Начинаем запрос к:', INGREDIENTS_URL); // Добавьте для отладки

  return fetch(INGREDIENTS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('Ответ получен:', response); // Добавьте для отладки
      if (!response.ok) {
        return Promise.reject(`Ошибка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Данные:', data); // Добавьте для отладки
      if (data.success) {
        return data.data;
      } else {
        return Promise.reject('API вернуло success: false');
      }
    });
};
