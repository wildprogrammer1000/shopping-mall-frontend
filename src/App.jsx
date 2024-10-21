import { Link } from "react-router-dom";
import { useUser } from "./store/context";
import { PATH } from "./constants/path";

function App() {
  const [user] = useUser();
  return (
    <>
      {user ? (
        <div>{user.id}</div>
      ) : (
        <div>
          <Link to={PATH.LOGIN}>로그인</Link>
          <Link to={PATH.SIGNUP}>회원가입</Link>
        </div>
      )}
    </>
  );
}

export default App;
