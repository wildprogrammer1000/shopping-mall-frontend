import { Box } from "@mui/material";
import { useUser } from "../store/context";
import { Link } from "react-router-dom";
import { PATH } from "../constants/path";
const Header = () => {
  const [user] = useUser();
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
        <div>{user.nickname}</div>
      ) : (
        <div>
          <Link to={PATH.LOGIN}>로그인</Link>
        </div>
      )}
    </Box>
  );
};

export default Header;
