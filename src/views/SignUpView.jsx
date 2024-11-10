import { Box, Button, TextField } from "@mui/material";
import { useUser } from "../store/context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/path";

const SignUpView = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    nickname: "",
  });
  const [validated, setValidated] = useState(false);
  const [user] = useUser();

  const validate = async () => {
    // TODO BE: 닉네임 중복 체크 API 구현
  };
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return navigate(PATH.ROOT);
    }
  }, []);
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box sx={{ textAlign: "center", fontSize: 18 }}>프로필 설정</Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          placeholder="닉네임"
          value={formState.nickname}
          onChange={(e) => {
            setValidated(false);
            setFormState({ ...formState, nickname: e.target.value });
          }}
        />
        <Button onClick={validate}>중복확인</Button>
      </Box>
      <Button fullWidth variant="contained" disabled={!validated}>
        완료
      </Button>
    </Box>
  );
};

export default SignUpView;
