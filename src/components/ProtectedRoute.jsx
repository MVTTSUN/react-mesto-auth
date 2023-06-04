import { useNavigate } from "react-router-dom";


export default function ProtectedRoute({element: Component, ...props}) {
  const navigate = useNavigate();

  return (
    props.loggedIn ? <Component {...props} /> : navigate('/sign-in')
  );
}