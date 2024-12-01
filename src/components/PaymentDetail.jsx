import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { requestFetch } from "../utils/fetch";
import { Box, Typography, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper } from '@mui/material';

const PaymentDetail = () => {
  const [paymentDetail, setPaymentDetail] = useState([]);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        const response = await requestFetch('/getPaymentOneList', {
          method: 'POST',
          data: { order_id: orderId },
        });
        setPaymentDetail(response);
      } catch (error) {
        console.error('Failed to fetch payment detail:', error);
      }
    };

    if (orderId) {
      fetchPaymentDetail();
    }
  }, [orderId]);

  if (paymentDetail.length === 0) return <div>로딩중...</div>;

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>결제 상세 정보</Typography>
      <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>항목</strong></TableCell>
              <TableCell><strong>내용</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentDetail.length > 0 && (
              <>
                <TableRow>
                  <TableCell>주문 상태</TableCell>
                  <TableCell>{paymentDetail[0].order_status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>결제 방법</TableCell>
                  <TableCell>{paymentDetail[0].payment_method}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>주문 ID</TableCell>
                  <TableCell>{paymentDetail[0].order_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>주문 이름</TableCell>
                  <TableCell>{paymentDetail[0].order_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>{paymentDetail[0].name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>전화번호</TableCell>
                  <TableCell>{paymentDetail[0].phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>배송지</TableCell>
                  <TableCell>{paymentDetail[0].shipping_address}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">주문 상품 정보</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>상품명</TableCell>
              <TableCell align='right'>수량</TableCell>
              <TableCell align='right'>가격</TableCell>
              <TableCell align='right'>총 가격</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentDetail.map(item => (
              <TableRow key={item.order_item_id}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell align='right'>{item.quantity}</TableCell>
                <TableCell align='right'>{item.product_price}원</TableCell>
                <TableCell align='right'>{item.total_price}원</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>배송비</TableCell>
              <TableCell align='right'>{paymentDetail[0].shipping_fee}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>총 금액</TableCell>
              <TableCell align='right'>{paymentDetail[0].total_amount}원</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentDetail; 