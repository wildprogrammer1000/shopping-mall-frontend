import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestFetch } from "../utils/fetch";
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
import { PATH } from "../constants/path";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ProductDetail() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

  const refreshSession = async () => {
    const response = await requestFetch('/user/session');
    setUser(response);
  }

  const handlePurchase = async () => {
    if (!user) {
      setMessage("로그인이 필요한 서비스입니다");
      return;
    }

    navigate(PATH.ORDERLIST, {
      state: {
        products: [{
          id: user.id,
          product_id: parseInt(product_id),
          product_name: product.product_name,
          product_price: product.product_price,
          quantity: quantity,
        }],
        totalPrice: product.product_price * quantity
        
      }
    });
  };


  useEffect(() => {
    refreshSession();
    if (!product_id) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await requestFetch('/getProduct', {
          method: 'POST',
          data: {
            product_id: parseInt(product_id)
          }
        });

        if (!response) {
          throw new Error('제품 데이터가 없습니다');
        }

        setProduct(response);
      } catch (error) {
        console.error("제품 정보를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage("로그인이 필요한 서비스입니다");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/addCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          product_id: parseInt(product_id),
          product_price: product.product_price,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('장바구니 추가 실패');
      }

      const result = await response.text();
      setMessage(result === "added to cart" ? "장바구니에 추가되었습니다" : "장바구니가 업데이트되었습니다");

      // 팝업 창 표시 및 장바구니 페이지 이동
      if (window.confirm('장바구니로 이동하시겠습니까?')) {
        navigate(PATH.CARTLIST);
      }
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      setMessage("장바구니 추가 실패");
    }
  };

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
                개당 {product.product_price.toLocaleString()}원
              </Typography>

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  수량 선택
                </Typography>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ padding: '8px', width: '100px' }}
                >
                  {[...Array(Math.min(10, product.stock_quantity))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </Box>

              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                총 금액: {(product.product_price * quantity).toLocaleString()}원
              </Typography>

              {message && (
                <Typography color="primary" sx={{ my: 1 }}>
                  {message}
                </Typography>
              )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ flex: 1 }}
                  onClick={handlePurchase}
                >
                  구매하기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ flex: 1 }}
                  onClick={handleAddToCart}
                >
                  장바구니
                </Button>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}

export default ProductDetail;
