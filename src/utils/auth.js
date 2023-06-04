const BASE_URL = 'https://auth.nomoreparties.co';

const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => res.json())
    .then(({error}) => error && Promise.reject(error));
};

const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) return Promise.reject(data.message);
      if (data.token) return localStorage.setItem('token', data.token);
    });
};

const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      }
    })
    .then((res) => res.json())
    .then((data) => {
      data.message && Promise.reject(data.message);
      return data;
    });
};

export { register, authorize, checkToken };