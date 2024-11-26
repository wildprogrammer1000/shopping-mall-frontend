import { Modal, Box, Typography, List, ListItem, ListItemText, Radio, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';
import { requestFetch } from '../utils/fetch';

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

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: user.id || '',
    name: '',
    phone: '',
    address: '',
    is_default: 0,
    nickname: '',
    zonecode: ''
  });
  const [detailAddress, setDetailAddress] = useState('');

  const handleSelect = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      handleClose();
    }
  };

  const handleAddAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setNewAddress(prev => ({
          ...prev,
          address: data.address,
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
          address: newAddress.address + (detailAddress ? ` ${detailAddress}` : ''),
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
        address: '',
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

  const handleDefaultAddressChange = async (address) => {
    if (window.confirm('이 주소를 기본 배송지로 설정하시겠습니까?')) {
      try {
        await requestFetch('/user/insertShippingInfo', {
          method: 'POST',
          data: {
            id: user.id,
            shipping_id: address.shipping_id,
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
            <List sx={{
              mb: 2,
              maxHeight: '400px',  // 최대 높이 설정
              overflow: 'auto'     // 스크롤 추가
            }}>
              {addressList.map((address, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid #eee',
                    mb: 1,
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer'  // 클릭 가능함을 표시
                  }}
                  onClick={() => onSelectAddress(address)}  // 클릭 시 배송지 선택
                >
                  <div>
                    <Typography variant="subtitle1" component="div">
                      {address.nickname || '배송지 ' + (index + 1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.name} | {address.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.address}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={(e) => e.stopPropagation()}  // 라디오 버튼 클릭 시 배송지 선택 방지
                  >
                    {address.is_default === 1 ? (
                      <Typography variant="body2" color="primary">
                        기본배송지
                      </Typography>
                    ) : (
                      <Radio
                        checked={false}
                        onChange={() => handleDefaultAddressChange(address)}
                        name="default-address"
                        size="small"
                      />
                    )}
                  </div>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleClose}>
                취소
              </Button>
              <Button
                variant="contained"
                onClick={handleSelect}
                disabled={!selectedAddress}
              >
                선택
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
              <TextField
                label="주소"
                value={newAddress.address}
                InputProps={{ readOnly: true }}
                fullWidth
                required
              />
              {newAddress.address && (
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
                      address: '',
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
                  disabled={!newAddress.name || !newAddress.phone || !newAddress.address}
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