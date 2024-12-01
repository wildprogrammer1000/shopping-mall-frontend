import React, { useEffect, useState } from 'react';
import { requestFetch } from '../utils/fetch';
import { useUser } from '../store/context';
import { Grid2, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentList = () => {
  const [user, setUser] = useUser();
  const [paymentList, setPaymentList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await requestFetch('/user/session');
        if (!response) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return;
        }
        setUser(response);
        fetchPaymentList(response.id);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const fetchPaymentList = async (userId) => {
    try {
      const response = await requestFetch('/getPaymentAllList', {
        method: 'POST',
        data: { id: userId },
      });
      setPaymentList(response);
    } catch (error) {
      console.error('Failed to fetch payment list:', error);
    }
  };

  const handlePaymentClick = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const handleToggleExpand = () => {
    if (visibleCount > 5) {
      setVisibleCount(5);
    } else {
      handleLoadMore();
    }
  };

  if (!user) return <div>로딩중...</div>;

  return (
    <div>
      <h2>구매내역</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주문 상태</TableCell>
              <TableCell>결제 방법</TableCell>
              <TableCell>주문 상품 정보</TableCell>
              <TableCell>배송지 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentList.slice(0, visibleCount).map((payment) => (
              <TableRow 
                key={payment.order_id} 
                onClick={() => handlePaymentClick(payment.order_id)} 
                style={{ cursor: 'pointer', transition: 'background-color 0.3s' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <TableCell>{payment.order_status}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
                <TableCell>{payment.order_name} {payment.total_amount}원</TableCell>
                <TableCell>
                  <div>이름: {payment.name}</div>
                  <div>전화번호: {payment.phone}</div>
                  <div>배송지: {payment.shipping_address}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handleToggleExpand} sx={{ width: '20%' }}>
          {visibleCount > 5 ? '닫기' : '더보기'}
        </Button>
      </Box>
    </div>
  );
};

export default PaymentList;