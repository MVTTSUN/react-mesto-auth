import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logo.svg';

export default function Header({ loggedIn, email, handleLogin }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logoutOfProfile = () => {
    localStorage.removeItem('token');
    handleLogin(false);
    navigate('/sign-in');
  };

  return (
    <header className="header">
      <Link to='' className="header__logo-link">
        <img src={logo} alt="Логотип сайта" className="header__logo"/>
      </Link>
      <div className="header__profile">
        {loggedIn && (
          <>
            <p className="header__email">{email}</p>
            <button onClick={logoutOfProfile} className="header__button-exit button">Выход</button>
          </>
        )}
        {!loggedIn && pathname === '/sign-up' && (<Link to='sign-in' className="header__link">Войти</Link>)}
        {!loggedIn && pathname === '/sign-in' && (<Link to='sign-up' className="header__link">Регистрация</Link>)}
      </div>
    </header>
  );
}