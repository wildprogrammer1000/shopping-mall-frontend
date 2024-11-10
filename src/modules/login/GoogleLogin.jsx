import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { PATH } from "../../constants/path";
import { requestFetch } from "../../utils/fetch";
export const GoogleLogin = ({ client_id, buttonText, onSuccess }) => {
  return (
    <GoogleOAuthProvider clientId={client_id}>
      <GoogleLoginButton buttonText={buttonText} onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  );
};

const GoogleLoginButton = ({ buttonText, onSuccess }) => {
  const tryLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const requestOptions = {
        method: "post",
        data: {
          code: codeResponse.code,
        },
      };
      const response = await requestFetch(PATH.SIGNIN_GOOGLE, requestOptions);
      onSuccess(response);
    },
  });
  return <button onClick={tryLogin}>{buttonText}</button>;
};
