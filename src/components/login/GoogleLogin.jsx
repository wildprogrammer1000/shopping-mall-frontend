import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { PATH } from "../../constants/path";
import { requestFetch } from "../../utils/fetch";
export const GoogleLogin = ({ client_id, buttonText, onSuccess }) => {
  return (
    <GoogleOAuthProvider clientId={client_id}>
      <GoogleLoginButton buttonText={buttonText} />
    </GoogleOAuthProvider>
  );
};

const GoogleLoginButton = ({ buttonText }) => {
  const onSuccessLogin = () => {};
  const tryLogin = useGoogleLogin({
    redirect_uri: "http://localhost:8080/auth/google",
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const requestOptions = {
        method: "post",
        body: JSON.stringify({
          code: codeResponse.code,
        }),
      };
      const response = await requestFetch(PATH.SIGNIN_GOOGLE, requestOptions);
      console.log("response: ", response);
    },
  });
  return <button onClick={tryLogin}>{buttonText}</button>;
};
