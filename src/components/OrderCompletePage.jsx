import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
        결제가 완료되었습니다!
      </Typography>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        주문하신 소중한 상품을 곧 보내 드릴게요!
      </Typography>

      {/* 배송지 정보 테이블 */}
      <TableContainer sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  배송지 정보
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography sx={{ mb: 2 }}>
                  <span style={{ fontWeight: 'bold' }}>받으시는 분: </span>
                  {orderData.shippingInfo.name}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <span style={{ fontWeight: 'bold' }}>연락처: </span>
                  {orderData.shippingInfo.phone}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 'bold' }}>주소: </span>
                  {orderData.shippingInfo.shipping_address}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 결제 정보 테이블 */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  결제 정보
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', mb: 2 }}>
                  {orderData.order_name}
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    배송비
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {orderData.shippingFee.toLocaleString()}원
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 'bold' }}>
                    총 결제 금액
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {orderData.totalAmount.toLocaleString()}원
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OrderCompletePage; 