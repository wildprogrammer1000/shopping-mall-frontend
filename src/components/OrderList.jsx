import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { requestFetch } from "../utils/fetch";
import AddressListModal from './AddressListModal';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';

const OrderList = () => {
  const location = useLocation();
  const { products, totalPrice } = location.state || { products: [], totalPrice: 0 };
  const [shippingInfo, setShippingInfo] = useState(null);
  const DELIVERY_FEE = 3000; // 배송비 OrderList
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [open, setOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const refreshSession = async () => {
    try {
      const response = await requestFetch('/user/session');
      setUser(response);
    } catch (error) {
      console.error('Session 조회 실패:', error);
    }
  }
  const fetchAddressList = async () => {
    try {
      const response = await requestFetch('/user/shippingInfosList', {
        method: 'POST',
        data: { id: user.id }
      });
      setAddressList(response);  // API 응답으로 받은 주소 목록 저장
    } catch (error) {
      console.error('배송지 목록을 불러오는데 실패했습니다:', error);
    }
  };
  const handleAddressSelect = async (selectedAddress) => {
    console.log('Selected address:', selectedAddress);
    try {
      setShippingInfo(selectedAddress);

      setOpen(false);
      // 성공 메시지 표시
      setSnackbar({
        open: true,
        message: '배송지가 변경되었습니다.',
        severity: 'success'
      });
    } catch (error) {
      console.error('배송지 변경에 실패했습니다:', error);
      setSnackbar({
        open: true,
        message: '배송지 변경에 실패했습니다.',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  // Modal 열릴 때 주소 목록 가져오기
  useEffect(() => {
    if (open) {
      fetchAddressList();
    }
  }, [open]);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      try {
        if (!user || !user.id) {
          console.error('사용자 정보가 없습니다:', user);
          return;
        }

        const response = await requestFetch('/user/shippingInfosList', {
          method: 'POST',
          data: { id: user.id }
        });

        if (response && response.length > 0) {
          const defaultAddress = response.find(info => info.is_default === 1);
          setShippingInfo(defaultAddress || response[0]);
        }
      } catch (error) {
        console.error('배송지 정보 조회 실패:', error);
      }
    };

    if (user) {
      fetchShippingInfo();
    }
  }, [user]);

  if (!products.length) {
    return <Box sx={{ textAlign: 'center', padding: '2rem' }}>주문할 상품이 없습니다.</Box>;
  }

  return (
    <Box sx={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* 주문서 제목 추가 */}
      <Typography 
        variant="h4" 
        sx={{ 
          marginBottom: '30px', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        주문서
      </Typography>

      {/* 주문 상품 테이블 */}
      <TableContainer component={Paper} sx={{ marginBottom: '30px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주문상품 {products.length}개</TableCell>
              <TableCell align="right">수량</TableCell>
              <TableCell align="right">가격</TableCell>
              <TableCell align="right">총 제품 가격</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.cart_id}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{Math.floor(item.product_price).toLocaleString()}원</TableCell>
                <TableCell align="right">
                  {Math.floor(item.quantity * item.product_price).toLocaleString()}원
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box sx={{ flex: 2 }}>
          {/* 배송 정보 테이블 */}
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>배송 정보</Typography>
          {shippingInfo ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2}>{shippingInfo.nickname}</TableCell>
                    <TableCell
                      align="right"
                      colSpan={2}
                      sx={{
                        textAlign: 'right',
                        paddingRight: 2  // 필요한 경우 여백 조정
                      }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setOpen(true)}
                      >
                        배송지 변경
                      </Button>
                    </TableCell>
                  </TableRow>
                  <AddressListModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    addressList={addressList}
                    onSelectAddress={handleAddressSelect}
                    fetchAddressList={fetchAddressList}
                    user={user}
                  />
                  <TableRow>
                    <TableCell colSpan={3}>{shippingInfo.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{shippingInfo.name}</TableCell>
                    <TableCell colSpan={2}>{shippingInfo.phone}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="error">
              등록된 배송지가 없습니다. 배송지를 먼저 등록해주세요.
            </Typography>
          )}
          {/* Snackbar 추가 */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* 주문 요약 정보 */}
          <Box sx={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>결제 금액</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Typography>상품금액</Typography>
              <Typography>{Math.floor(totalPrice).toLocaleString()}원</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Typography>배송비</Typography>
              <Typography>{Math.floor(DELIVERY_FEE).toLocaleString()}원</Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <Typography variant="h6">총 결제금액</Typography>
              <Typography variant="h6" color="primary">
                {Math.floor(totalPrice + DELIVERY_FEE).toLocaleString()}원
              </Typography>
            </Box>

            {/* 결제하기 버튼 */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: '56px', fontSize: '1.1rem', marginTop: '20px' }}
              onClick={() => {/* [ ] 결제 처리 로직 추가 */ }}
            >
              결제하기
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderList;