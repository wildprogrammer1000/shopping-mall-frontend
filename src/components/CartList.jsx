import React, { useState, useEffect } from 'react';
import { useUser } from "../store/context";
import { requestFetch } from "../utils/fetch";
import { 
  Box, 
  Checkbox, 
  Button,
  TextField,
  Typography 
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [editQuantities, setEditQuantities] = useState({});
  const [user, setUser] = useUser();
  const navigate = useNavigate();

  const refreshSession = async () => {
    try {
      const response = await requestFetch('/user/session');
      setUser(response);
    } catch (error) {
      console.error('세션 갱신 실패:', error);
    }
  }

  const fetchCartList = async () => {
    try {
      const response = await requestFetch('/getCartList', {
        method: "POST",
        data: {
          id: user.id
        }
      });
      setCartItems(response || []);
    } catch (error) {
      console.error('장바구니 목록 조회 실패:', error);
      setCartItems([]);
    } finally {
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshSession();
      if (user) {
        await fetchCartList();
      }
    };
    
    init();
  }, []);

  const handleCheckItem = (cart_id) => {
    setSelectedItems(prev => ({
      ...prev,
      [cart_id]: !prev[cart_id]
    }));
  };

  const getCurrentQuantity = (item) => {
    return editQuantities[item.cart_id] || item.quantity;
  };

  const getCurrentTotalPrice = (item) => {
    const currentQuantity = getCurrentQuantity(item);
    return Math.floor(currentQuantity * item.product_price);
  };

  const getTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems[item.cart_id])
      .reduce((sum, item) => sum + getCurrentTotalPrice(item), 0);
  };

  const handleQuantityChange = (cartId, value) => {
    setEditQuantities(prev => ({
      ...prev,
      [cartId]: Math.max(1, value)
    }));
  };

  const handleUpdateCart = async (item) => {
    try {
      const newQuantity = getCurrentQuantity(item);
      const updatedItem = {
        ...item,
        quantity: newQuantity,
        total_price: getCurrentTotalPrice(item)
      };

      await requestFetch('/updateCart', {
        method: 'POST',
        data: updatedItem
      });

      setCartItems(prev => prev.map(cartItem => 
        cartItem.cart_id === item.cart_id ? updatedItem : cartItem
      ));

      setEditQuantities(prev => {
        const newState = { ...prev };
        delete newState[item.cart_id];
        return newState;
      });

      alert('수량이 변경되었습니다.');
    } catch (error) {
      console.error('수량 업데이트 실패:', error);
      alert('수량 변경에 실패했습니다.');
    }
  };

  // 전체 선택 상태 확인
  const isAllSelected = () => {
    return cartItems.length > 0 && cartItems.every(item => selectedItems[item.cart_id]);
  };

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (isAllSelected()) {
      // 전체 해제
      setSelectedItems({});
    } else {
      // 전체 선택
      const newSelectedItems = {};
      cartItems.forEach(item => {
        newSelectedItems[item.cart_id] = true;
      });
      setSelectedItems(newSelectedItems);
    }
  };

  // 수정된 항목이 있는지 확인
  const hasModifiedItems = () => {
    return Object.keys(editQuantities).length > 0;
  };

  // 수정된 항목들의 데이터 준비
  const getModifiedItems = () => {
    return cartItems.map(item => {
      if (editQuantities[item.cart_id]) {
        return {
          ...item,
          quantity: editQuantities[item.cart_id],
          total_price: editQuantities[item.cart_id] * parseInt(item.product_price)
        };
      }
      return item;
    });
  };

  // 전체 수정 처리
  const handleUpdateAll = async () => {
    if (!hasModifiedItems()) {
      alert('수정된 항목이 없습니다.');
      return;
    }

    try {
      const modifiedItems = getModifiedItems();
      
      await requestFetch('/updateCartAll', {
        method: 'POST',
        data: modifiedItems
      });

      // 성공 시 cartItems 업데이트
      setCartItems(modifiedItems);
      // 임시 수량 상태 초기화
      setEditQuantities({});

      alert('모든 수량이 변경되었습니다.');
    } catch (error) {
      console.error('수량 일괄 업데이트 실패:', error);
      alert('수량 변경에 실패했습니다.');
    }
  };

  // 선택된 항목 삭제 처리
  const handleDeleteSelected = async () => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    if (selectedCount === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (window.confirm(`선택한 ${selectedCount}개의 제품을 삭제하시겠습니까?`)) {
      try {
        const itemsToDelete = cartItems.filter(item => selectedItems[item.cart_id]);
        
        await requestFetch('/deleteCart', {
          method: 'POST',
          data: itemsToDelete
        });

        // 삭제 후 장바구니 목록 새로고침
        await fetchCartList();
        // 선택 상태 초기화
        setSelectedItems({});
        
        alert('선택한 상품이 삭제되었습니다.');
      } catch (error) {
        console.error('장바구니 항목 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 주문하기 처리 함수 추가
  const handleOrder = () => {
    const selectedProducts = cartItems.filter(item => selectedItems[item.cart_id]);
    if (selectedProducts.length === 0) {
      console.log("selectedProducts: ", selectedProducts);
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    
    // 선택된 상품 정보를 state로 전달하며 주문 페이지로 이동
    navigate('/orderList', { 
      state: { 
        products: selectedProducts,
        totalPrice: getTotalPrice()
      } 
    });
  };

  if (!user) {
    return <Box sx={{ textAlign: 'center', padding: '2rem' }}>로그인이 필요합니다.</Box>;
  }

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{user.nickname}님의 장바구니</h2>
      {cartItems && cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: '2rem' }}>
          장바구니가 비어있습니다.
        </Box>
      ) : (
        <>
          {/* 전체선택 체크박스 추가 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '10px 0',
            borderBottom: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <Checkbox
              checked={isAllSelected()}
              onChange={handleSelectAll}
            />
            <Typography>전체선택</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems && cartItems.map((item) => (
              <Box 
                key={item.cart_id} 
                sx={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <Checkbox
                  checked={selectedItems[item.cart_id] || false}
                  onChange={() => handleCheckItem(item.cart_id)}
                />
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  flex: 1
                }}>
                  <Typography>상품 이름: {item.product_name}</Typography>
                  <Typography>가격: {Math.floor(item.product_price)}원</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography>수량:</Typography>
                    <Button 
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuantityChange(
                        item.cart_id, 
                        getCurrentQuantity(item) - 1
                      )}
                    >
                      -
                    </Button>
                    <TextField
                      size="small"
                      value={getCurrentQuantity(item)}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(item.cart_id, value);
                      }}
                      sx={{ width: '60px' }}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                    />
                    <Button 
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuantityChange(
                        item.cart_id, 
                        getCurrentQuantity(item) + 1
                      )}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleUpdateCart(item)}
                      disabled={editQuantities[item.cart_id] === undefined}
                    >
                      수정
                    </Button>
                  </Box>
                  <Typography>
                    총 금액: {Math.floor(getCurrentTotalPrice(item)).toLocaleString()}원
                  </Typography>
                  <Typography>등록일: {item.created_at}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ 
            marginTop: '20px', 
            padding: '15px',
            borderTop: '2px solid #ddd',
            textAlign: 'right'
          }}>
            <Typography variant="h6">
              선택된 상품 총액: {getTotalPrice().toLocaleString()}원
            </Typography>
          </Box>
          {cartItems && cartItems.length > 0 && (
            <Box sx={{ 
              marginTop: '20px', 
              padding: '15px',
              borderTop: '2px solid #ddd',
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateAll}
                    disabled={!hasModifiedItems()}
                    sx={{ marginRight: '10px' }}
                  >
                    전체 수정
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteSelected}
                    disabled={!Object.values(selectedItems).some(Boolean)}
                    sx={{ marginRight: '10px' }}
                  >
                    선택 삭제
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOrder}
                    disabled={!Object.values(selectedItems).some(Boolean)}
                  >
                    주문하기
                  </Button>
                </Box>
                <Typography variant="h6">
                  선택된 상품 총액: {getTotalPrice().toLocaleString()}원
                </Typography>
              </Box>
              {hasModifiedItems() && (
                <Typography 
                  color="primary" 
                  sx={{ marginTop: '10px', fontSize: '0.9rem' }}
                >
                  * 수정된 수량이 있습니다. 전체 수정 버튼을 눌러 저장해주세요.
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CartList;
