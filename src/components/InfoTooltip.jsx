import authSuccess from '../images/auth-success.svg';
import authError from '../images/auth-error.svg';
import useClosePopup from '../hooks/useClosePopup';

export default function InfoTooltip({ isOpen, onClose, isSuccess, messageInfo }) {
  useClosePopup(isOpen, onClose);

  return (
    <div id='popup-notification' className={`popup ${isOpen && 'popup_opened'}`}>
      <div className="popup__container popup__container_type_auth">
        <button onClick={onClose} type="button" className="popup__close-button button" aria-label="Закрытие оповещения"></button>
        <img className="popup__icon-notification" src={isSuccess ? authSuccess : authError} alt={isSuccess ? 'auth-success' : 'auth-error'} />
        <p className="popup__message-notification">{messageInfo}</p>
      </div>
    </div>
  );
}