import { INGREDIENTS_URL } from './constants';

export const getIngredients = () => {
  return fetch(INGREDIENTS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(`Ошибка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        return data.data;
      } else {
        return Promise.reject('API вернуло success: false');
      }
    });
};
