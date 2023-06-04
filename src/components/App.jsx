import { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import ImagePopup from './ImagePopup';
import Main from './Main';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Authorization from './Authorization';
import { checkToken } from '../utils/auth';
import InfoTooltip from './InfoTooltip';

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ link: '', name: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: '' });
  const [cards, setCards] = useState([]);
  const [focusCardDelete, setFocusCardDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageInfo, setMessageInfo] = useState('');
  const navigate = useNavigate();

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setSelectedCard({ link: '', name: '' });
    setIsInfoPopupOpen(false);
  };

  const handleCardLike = (currCard) => {
    const isLiked = currCard.likes.some((like) => like._id === currentUser._id);
    
    !isLiked
      ? api.sendLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard : card));
          })
          .catch((err) => console.log(err))
      : api.deleteLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard : card));
          })
          .catch((err) => console.log(err));
  };

  const handleOpenConfirmDeletePopup = (currCard) => {
    setIsConfirmDeletePopupOpen(true);
    setFocusCardDelete(currCard);
  };

  const handleOpenInfoPopup = (isSuccess, message) => {
    setIsSuccess(isSuccess);
    setMessageInfo(message);
    setTimeout(() => {setIsInfoPopupOpen(true)}, 100);
  };

  const handleCardDelete = () => {
    setIsLoading(true);

    api.deleteCard(focusCardDelete._id)
      .then(() => {
        setCards((prevState) => prevState.filter((card) => card._id !== focusCardDelete._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateUser = (user) => {
    setIsLoading(true);

    api.updateUserInfo(user)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true);

    api.updateUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleAddPlace = (dataCard) => {
    setIsLoading(true);

    api.sendCard(dataCard)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleLogin = (isLogin) => {
    setLoggedIn(isLogin);
  }

  const handleTokenCheck = () => {
    const token = localStorage.getItem('token');

    if (token) {
      checkToken(token)
        .then(({data}) => {
          setEmail(data.email);
          setLoggedIn(true);
          navigate('/');
        })
        .catch((err) => handleOpenInfoPopup(false, err));
    }
  };

  useEffect(() => {
    api.getCards()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api.getUserInfo()
      .then(({ name, about, avatar, _id }) => {
        setCurrentUser({ name, about, avatar, _id });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    handleTokenCheck();
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header handleLogin={handleLogin} loggedIn={loggedIn} email={email} />

      <Routes>
        <Route path='/' element={
          <ProtectedRoute
            loggedIn={loggedIn}
            element={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onOpenConfirmDeletePopup={handleOpenConfirmDeletePopup}
            cards={cards}
          />}
        />
        <Route path='/sign-up' element={
            <Authorization
              textHeading='Регистрация'
              textButton='Зарегистрироваться'
              onOpenInfoPopup={handleOpenInfoPopup}
            />
          }
        />
        <Route path='/sign-in' element={
            <Authorization
              handleLogin={handleLogin}
              textHeading='Вход'
              textButton='Войти'
              onOpenInfoPopup={handleOpenInfoPopup}
            />
          }
        />
        <Route path='*' element={<Navigate to='/sign-up' />} />
      </Routes>

      <Footer />

      <InfoTooltip
        isOpen={isInfoPopupOpen}
        onClose={closeAllPopups}
        isSuccess={isSuccess}
        messageInfo={messageInfo}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace}
        isLoading={isLoading}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />
      <ConfirmDeletePopup
        isOpen={isConfirmDeletePopupOpen}
        onClose={closeAllPopups}
        onCardDelete={handleCardDelete}
        isLoading={isLoading}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}
