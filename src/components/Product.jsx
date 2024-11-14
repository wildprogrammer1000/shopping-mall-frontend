import React, { useState, useEffect } from "react";
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
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product_id) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch('http://localhost:8080/getProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: parseInt(product_id)
          })
        });

        if (!response.ok) {
          throw new Error('제품 정보를 가져오는데 실패했습니다');
        }

        const productData = await response.json();
        
        if (!productData) {
          throw new Error('제품 데이터가 없습니다');
        }

        setProduct(productData);
      } catch (error) {
        console.error("제품 정보를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  if (loading) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!product) {
    return <Typography>제품을 찾을 수 없습니다.</Typography>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button onClick={handleGoBack} sx={{ mb: 3 }}>
          목록으로 돌아가기
        </Button>

        <Grid2 container spacing={4}>
          {/* 상품 정보 */}
          <Grid2 xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.product_name}
              </Typography>

              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                {product.product_price.toLocaleString()}원
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" sx={{ my: 2 }}>
                {product.product_description}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Grid2 container sx={{ py: 1 }}>
                  <Grid2 xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      카테고리: 
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography variant="body2">{product.category}</Typography>
                  </Grid2>
                </Grid2>
                <Grid2 container sx={{ py: 1 }}>
                  <Grid2 xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      재고수량: 
                    </Typography>
                  </Grid2>
                  <Grid2 xs={8}>
                    <Typography variant="body2">{product.stock_quantity}개</Typography>
                  </Grid2>
                </Grid2>
              </Box>

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
