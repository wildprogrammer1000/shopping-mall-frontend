import { GoogleLogin } from "../components/login/GoogleLogin";
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
const SignUpView = () => {
  const onSuccess = () => {
    // Call Register API
  };
  return (
    <div>
      <GoogleLogin
        client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        buttonText={"구글로 가입하기"}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default SignUpView;
