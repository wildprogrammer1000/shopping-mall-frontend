import { Modal, Box, Typography, List, ListItem, Radio, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';
import { requestFetch } from '../utils/fetch';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AddressListModal = ({ open, handleClose, addressList, onSelectAddress, fetchAddressList, user }) => {

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: user.id || '',
    name: '',
    phone: '',
    shipping_address: '',
    is_default: 0,
    nickname: '',
    zonecode: ''
  });
  const [detailAddress, setDetailAddress] = useState('');

  const handleAddressClick = (shippingAddress) => {
    if (window.confirm('이 주소를 배송지로 선택하시겠습니까?')) {
      onSelectAddress(shippingAddress);
      handleClose();
    }
  };

  const handleAddAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setNewAddress(prev => ({
          ...prev,
          shipping_address: data.address,
          zonecode: data.zonecode
        }));
        setShowAddressForm(true);
      }
    }).open();
  };

  const handleSubmitAddress = async () => {
    // 전화번호 형식 검증
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(newAddress.phone)) {
      alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    try {
      await requestFetch('/user/insertShippingInfo', {
        method: 'POST',
        data: {
          id: user.id,
          name: newAddress.name,
          phone: newAddress.phone,
          shipping_address: newAddress.shipping_address + (detailAddress ? ` ${detailAddress}` : ''),
          is_default: newAddress.is_default,
          nickname: newAddress.nickname
        }
      });

      // 성공적으로 저장된 후 처리
      alert('배송지가 저장되었습니다.');
      // 배송지 목록 새로고침
      fetchAddressList();
      // 폼 초기화 및 닫기
      setShowAddressForm(false);
      setNewAddress({
        id: user.id,
        name: '',
        phone: '',
        shipping_address: '',
        is_default: 0,
        nickname: '',
        zonecode: ''
      });
      setDetailAddress('');
    } catch (error) {
      console.error('Error:', error);
      alert('배송지 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDefaultAddressChange = async (shippingAddress) => {
    if (window.confirm('이 주소를 기본 배송지로 설정하시겠습니까?')) {
      try {
        await requestFetch('/user/insertShippingInfo', {
          method: 'POST',
          data: {
            id: user.id,
            shipping_id: shippingAddress.shipping_id,
            is_default: 1,
          }
        });
        alert('기본 배송지가 변경되었습니다.');
        fetchAddressList();
      } catch (error) {
        console.error('Error:', error);
        alert('기본 배송지 변경에 실패했습니다.');
      }
    }
  };

  const handleDeleteAddress = async (shippingAddress, e) => {
    e.stopPropagation();

    if (window.confirm('이 주소를 삭제하시겠습니까?')) {
      try {
        await requestFetch('/user/deleteShippingInfo', {
          method: 'POST',
          data: {
            id: user.id,
            shipping_id: shippingAddress.shipping_id
          }
        });

        alert('배송지가 삭제되었습니다.');
        fetchAddressList();
      } catch (error) {
        console.error('Error:', error);
        alert('배송지 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="address-list-modal"
    >
      <Box sx={style}>
        {!showAddressForm ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                배송지 목록
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAddress}
                size="small"
              >
                배송지 추가
              </Button>
            </Box>

            {addressList.length === 0 ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                border: '1px dashed #ccc',
                borderRadius: 1,
                backgroundColor: '#f8f8f8'
              }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  등록된 배송지가 없습니다.
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  배송지를 추가해주세요.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderBottom: '2px solid #eee',
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#666'
                }}>
                  <Box sx={{ flex: 1 }}>배송지</Box>
                  <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ width: '70px', textAlign: 'center' }}>기본배송지</Box>
                    <Box sx={{ width: '30px', textAlign: 'center' }}>삭제</Box>
                  </Box>
                </Box>
                <List sx={{
                  mb: 2,
                  maxHeight: '400px',
                  overflow: 'auto'
                }}>
                  {addressList.map((shippingAddress, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        border: '1px solid #eee',
                        mb: 1,
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        },
                        '&:active': {
                          backgroundColor: '#e8e8e8',
                          transform: 'translateY(0)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => handleAddressClick(shippingAddress)}
                    >
                      <div>
                        <Typography variant="subtitle1" component="div">
                          {shippingAddress.nickname || '배송지 ' + (index + 1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingAddress.name} | {shippingAddress.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingAddress.shipping_address}
                        </Typography>
                      </div>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {shippingAddress.is_default === 1 ? (
                          <Typography variant="body2" color="primary">
                            기본배송지
                          </Typography>
                        ) : (
                          <Radio
                            checked={false}
                            onChange={() => handleDefaultAddressChange(shippingAddress)}
                            name="default-address"
                            size="small"
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteAddress(shippingAddress, e)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleClose}>
                취소
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
              배송지 정보 입력
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="받는 분"
                value={newAddress.name}
                onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="연락처"
                value={newAddress.phone}
                onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                fullWidth
                required
                placeholder="010-0000-0000"
              />
              {newAddress.shipping_address && (
                <TextField
                  label="주소"
                  value={newAddress.shipping_address}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  required
                />
              )}
              {newAddress.shipping_address && (
                <TextField
                  fullWidth
                  size="small"
                  label="상세주소"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                label="배송지명"
                value={newAddress.nickname}
                onChange={(e) => setNewAddress(prev => ({ ...prev, nickname: e.target.value }))}
                fullWidth
                placeholder="예: 집, 회사"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newAddress.is_default === 1}
                    onChange={(e) => setNewAddress(prev => ({
                      ...prev,
                      is_default: e.target.checked ? 1 : 0
                    }))}
                  />
                }
                label="기본 배송지로 설정"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowAddressForm(false);
                    setNewAddress({
                      name: '',
                      phone: '',
                      shipping_address: '',
                      is_default: 0,
                      nickname: '',
                      zonecode: ''
                    });
                    setDetailAddress('');
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitAddress}
                  disabled={!newAddress.name || !newAddress.phone || !newAddress.shipping_address}
                >
                  저장
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AddressListModal; 