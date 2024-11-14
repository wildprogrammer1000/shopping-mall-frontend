import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Grid2, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Box 
} from '@mui/material';

function ProductList() {
  const navigate = useNavigate();
  
  // 예시 상품 데이터
  const products = [
    { id: 1, name: '상품1', price: 10000 },
    { id: 2, name: '상품2', price: 20000 },
    { id: 3, name: '상품3', price: 30000 },
  ];

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid2 container spacing={3}>
          {products.map((product) => (
            <Grid2 xs={12} sm={6} md={4} key={product.id}>
              <Card
                component={Button}
                onClick={() => handleProductClick(product.id)}
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'block',
                  textTransform: 'none', // 버튼의 기본 대문자 변환 제거
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {product.price.toLocaleString()}원
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
}

export default ProductList;
