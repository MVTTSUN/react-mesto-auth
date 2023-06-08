const BASE_URL = 'https://auth.nomoreparties.co';

const getResponseData = (res, errorMessage) => {
  return res.ok ? res.json() : Promise.reject(errorMessage);
};

const register = async (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => getResponseData(res, 'При регистрации произошла ошибка. Попробуйте еще раз.'));
};

const authorize = async (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => getResponseData(res, 'При авторизации произошла ошибка. Попробуйте еще раз.'));
};

const checkToken = async (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      }
    })
    .then((res) => getResponseData(res, 'Не удалось проверить токен'));
};

export { register, authorize, checkToken };