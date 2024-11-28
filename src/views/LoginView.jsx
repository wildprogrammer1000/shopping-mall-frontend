import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "../modules/login/GoogleLogin";
import { useUser } from "../store/context";
import { PATH } from "../constants/path";
const LoginView = () => {
  const navigate = useNavigate();
  const [, setUser] = useUser();
  const onSuccess = (response) => {
    setUser(response);
    if (response.nickname) navigate(PATH.ROOT);
    else navigate(PATH.SIGNUP);
  };
  return (
    <>
      <GoogleLogin
        client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        buttonText={"구글로 로그인"}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default LoginView;
