import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Paper } from '@mui/material';

function OrderCompletePage() {
  const location = useLocation();
  const { orderData, paymentResponse } = location.state || {};

  if (!orderData) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          주문 정보를 찾을 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        주문하신 소중한 상품을 곧 보내 드릴게요!
      </Typography>
      
      <Grid container spacing={4}>
        {/* 배송지 정보 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              배송지 정보
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography>
                <span style={{ fontWeight: 'bold' }}>받으시는 분: </span>
                {orderData.shippingInfo.name}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold' }}>연락처: </span>
                {orderData.shippingInfo.phone}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold' }}>주소: </span>
                {orderData.shippingInfo.shipping_address}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 결제 금액 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              결제 금액
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {orderData.totalAmount.toLocaleString()}원
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrderCompletePage; 