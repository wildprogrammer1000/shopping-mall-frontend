import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid2,
  Divider,
  Paper,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 예시 상품 데이터 (실제로는 API에서 받아올 데이터)
  const product = {
    id: id,
    name: "상품 이름",
    price: 50000,
    description: "상품에 대한 자세한 설명이 들어갑니다.",
    imageUrl: "https://via.placeholder.com/400x400", // 예시 이미지
    specs: [
      { label: "제조사", value: "제조사명" },
      { label: "카테고리", value: "카테고리명" },
      { label: "재고", value: "100개" },
    ],
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* 뒤로가기 버튼 */}
        <Button
          // startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          목록으로 돌아가기
        </Button>

        <Grid2 container spacing={4}>
          {/* 상품 이미지 */}
          <Grid2 xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
            </Card>
          </Grid2>

          {/* 상품 정보 */}
          <Grid2 xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                {product.price.toLocaleString()}원
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" sx={{ my: 2 }}>
                {product.description}
              </Typography>

              <Box sx={{ mt: 4 }}>
                {product.specs.map((spec, index) => (
                  <Grid2 container key={index} sx={{ py: 1 }}>
                    <Grid2 xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {spec.label}
                      </Typography>
                    </Grid2>
                    <Grid2 xs={8}>
                      <Typography variant="body2">{spec.value}</Typography>
                    </Grid2>
                  </Grid2>
                ))}
              </Box>

              {/* 구매 버튼 */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 4 }}
                onClick={() => {
                  /* 구매 로직 구현 */
                }}
              >
                구매하기
              </Button>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}

export default ProductDetail;
