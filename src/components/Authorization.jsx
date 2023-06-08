import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authorize, register } from '../utils/auth';

export default function Authorization({ textHeading, textButton, handleLogin, onOpenInfoPopup }) {
  const [formValue, setFormValue] = useState({email: '', password: ''});
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const {name, value} = evt.target;

    setFormValue({...formValue, [name]: value});
  };

  const handleRegister = () => {
    register(formValue.email, formValue.password)
      .then(() => {
        setFormValue({email: '', password: ''});
        navigate('/sign-in');
        onOpenInfoPopup(true, 'Вы успешно зарегистрировались!');
      })
      .catch((err) => onOpenInfoPopup(false, err));
  };

  const handleAuthorize = () => {
    authorize(formValue.email, formValue.password)
      .then((data) => {
        localStorage.setItem('token', data.token);
        setFormValue({email: '', password: ''});
        handleLogin(true);
        navigate('/');
      })
      .catch((err) => onOpenInfoPopup(false, err));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    textHeading === 'Регистрация' && handleRegister();
    textHeading === 'Вход' && handleAuthorize();
  };

  return (
    <main className="content">
      <form onSubmit={handleSubmit} className="authorize" action="#">
        <h1 className="authorize__heading">{textHeading}</h1>
        <input required onChange={handleChange} value={formValue.email} name='email' className="authorize__input" type="email" placeholder="Email"/>
        <input required onChange={handleChange} value={formValue.password} name='password' className="authorize__input" type="password" placeholder="Пароль"/>
        <button className="authorize__button button">{textButton}</button>
        {textHeading === 'Регистрация' && <Link className="authorize__link" to='/sign-in'>Уже зарегистрированы? Войти</Link>}
      </form>
    </main>
  );
}