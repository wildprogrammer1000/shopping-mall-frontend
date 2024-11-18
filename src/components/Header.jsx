import { Box } from "@mui/material";
import { useUser } from "../store/context";
import { Link } from "react-router-dom";
import { PATH } from "../constants/path";
import { useEffect } from "react";
import { requestFetch } from "../utils/fetch";
const Header = () => {
  const [user, setUser] = useUser();

  const refreshSession = async () => {
    const response = await requestFetch('/user/session');
    setUser(response);
  }
  useEffect(() => {
    refreshSession();
  }, [])
  return (
    <Box
      sx={{ position: "relative", display: "flex", justifyContent: "flex-end" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        <Link to={PATH.ROOT}>쇼핑몰</Link>
      </Box>
      {user ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div>{user.nickname}</div>
          <Link to={PATH.MYPAGE}>마이페이지</Link>
          <Link to={PATH.CARTLIST}>장바구니</Link>
        </div>
      ) : (
        <div>
          <Link to={PATH.LOGIN}>로그인</Link>
        </div>
      )}
    </Box>
  );
};

export default Header;
