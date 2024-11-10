import { useEffect, useState } from "react";
import { requestFetch } from "../utils/fetch";
import { PATH } from "../constants/path";
import { Grid2 } from "@mui/material";

const pageSize = 50;
const Products = () => {
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const requestOptions = {
      params: {
        start: pageSize * page,
        end: pageSize * (page + 1),
      },
    };
    const response = await requestFetch(PATH.LIST_PRODUCTS, requestOptions);
    setProducts(response.product_list);
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div>
      <Grid2 container spacing={2}>
        {products.map((product, index) => (
          <Grid2 key={index} sx={{ border: "1px solid #eee", p: 2 }}>
            <div>{product.product_name}</div>
            <div>{product.product_description}</div>
            <div>{product.product_price}원</div>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default Products;
