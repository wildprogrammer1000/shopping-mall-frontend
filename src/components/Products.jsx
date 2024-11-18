import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Grid2,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel
} from '@mui/material';
import { requestFetch } from '../utils/fetch';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const [searchParams, setSearchParams] = useState({
    start: 1,
    end: itemsPerPage,
    search_type: '',
    search_value: ''
  });

  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dateSearchType, setDateSearchType] = useState('full'); // 'full', 'year', 'month', 'day'

  const searchTypes = [
    { value: 'product_name', label: '상품명' },
    { value: 'category', label: '카테고리' },
    { value: 'created_at', label: '등록일' }
  ];

  const dateSearchTypes = [
    { value: 'full', label: '전체 날짜' },
    { value: 'year', label: '년도' },
    { value: 'month', label: '월' },
    { value: 'day', label: '일' }
  ];

  useEffect(() => {
    const start = (page - 1) * itemsPerPage + 1;
    const end = page * itemsPerPage;

    setSearchParams(prev => ({
      ...prev,
      start,
      end
    }));
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await requestFetch(`/getProductList`, {
        params: {
          start: searchParams.start.toString(),
          end: searchParams.end.toString(),
          search_type: searchParams.search_type,
          search_value: searchParams.search_value,
          date_search_type: searchParams.date_search_type || ''
        }
      });

      console.log('서버 응답:', response); // 디버깅용

      if (response && response.product_list) {
        setProducts(response.product_list);
        setTotalCount(response.total_count);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('상품 데이터 로딩 실패:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let searchValueToUse = searchValue;

    setPage(1);
    setSearchParams(prev => ({
      ...prev,
      start: 1,
      end: itemsPerPage,
      search_type: searchType,
      search_value: searchValueToUse,
      date_search_type: searchType === 'created_at' ? dateSearchType : ''
    }));
  };

  const handleReset = () => {
    setSearchType('');
    setSearchValue('');
    setDateSearchType('full');
    setPage(1);
    setSearchParams({
      start: 1,
      end: itemsPerPage,
      search_type: '',
      search_value: '',
      date_search_type: ''
    });
  };

  // 날짜 검색 입력 필드 렌더링
  const renderDateSearchInput = () => {
    switch (dateSearchType) {
      case 'year':
        return (
          <TextField
            type="number"
            label="년도"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="YYYY"
            inputProps={{ min: "1900", max: "2100" }}
            sx={{ flexGrow: 1 }}
          />
        );
      case 'month':
        return (
          <TextField
            type="number"
            label="월"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="MM"
            inputProps={{ min: "1", max: "12" }}
            sx={{ flexGrow: 1 }}
          />
        );
      case 'day':
        return (
          <TextField
            type="number"
            label="일"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="DD"
            inputProps={{ min: "1", max: "31" }}
            sx={{ flexGrow: 1 }}
          />
        );
      default:
        return (
          <TextField
            type="date"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
    }
  };

  // 검색 입력 필드 렌더링 함수
  const renderSearchInput = () => {
    if (searchType === 'created_at') {
      return (
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>날짜 검색 조건</InputLabel>
            <Select
              value={dateSearchType}
              onChange={(e) => {
                setDateSearchType(e.target.value);
                setSearchValue('');
              }}
              label="날짜 검색 조건"
            >
              {dateSearchTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {renderDateSearchInput()}
        </Box>
      );
    }

    return (
      <TextField
        label="검색어"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
    );
  };

  // 페이지네이션 표시 여부를 결정하는 함수
  const shouldShowPagination = () => {
    // 현재 페이지가 1이 아니거나, 상품이 itemsPerPage개 있으면 페이지네이션 표시
    return page > 1 || (products && products.length === itemsPerPage);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>로딩 중...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography color="error">에러가 발생했습니다: {error.message}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            mb: 4,
            display: 'flex',
            gap: 2,
            alignItems: 'center'
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>검색 조건</InputLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              label="검색 조건"
            >
              {searchTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {renderSearchInput()}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!searchType || !searchValue}
          >
            검색
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
          >
            초기화
          </Button>
        </Box>

        {searchType && searchValue && (
          <Typography sx={{ mb: 2 }}>
            검색 조건: {searchTypes.find(t => t.value === searchType)?.label}
            {searchType === 'created_at' && ` (${dateSearchTypes.find(t => t.value === dateSearchType)?.label})`} /
            검색어: {searchValue}
          </Typography>
        )}

        <Grid2 container spacing={3}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <Grid2 xs={12} sm={6} md={4} key={product.product_id}>
                <Card
                  component={Button}
                  onClick={() => handleProductClick(product.product_id)}
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {product.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.product_description}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {Number(product.product_price).toLocaleString()}원
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      재고: {product.stock_quantity}개
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      카테고리: {product.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      등록일: {new Date(product.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))
          ) : (
            <Grid2 xs={12}>
              <Typography>검색 결과가 없습니다.</Typography>
            </Grid2>
          )}
        </Grid2>

        {/* 페이지네이션 수정 */}
        {shouldShowPagination() && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4
          }}>
            <Pagination
              count={Math.ceil(totalCount / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ProductList;
