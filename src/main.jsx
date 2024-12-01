import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ContextProvider } from "./store/context.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { PATH } from "./constants/path.js";
import LoginView from "./views/LoginView.jsx";
import SignUpView from "./views/SignUpView.jsx";
import MyPage from "./components/Mypage.jsx";
import Product from "./components/Product.jsx";
import CartList from "./components/CartList.jsx";
import OrderList from "./components/OrderList.jsx";
import AddressListModal from "./components/AddressListModal.jsx";
import Header from "./components/Header.jsx";
import OrderCompletePage from "./components/OrderCompletePage.jsx";
import PaymentList from "./components/PaymentList.jsx";
import PaymentDetail from "./components/PaymentDetail.jsx";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: PATH.ROOT, element: <App /> },
      { path: PATH.SIGNUP, element: <SignUpView /> },
      { path: PATH.LOGIN, element: <LoginView /> },
      { path: PATH.MYPAGE, element: <MyPage /> },
      { path: `${PATH.PRODUCT}/:product_id`, element: <Product /> },
      { path: PATH.CARTLIST, element: <CartList /> },
      { path: PATH.ORDERLIST, element: <OrderList /> },
      { path: PATH.ADDRESSLISTMODAL, element: <AddressListModal /> },
      { path: PATH.ORDERCOMPLETE, element: <OrderCompletePage /> },
      { path: PATH.PAYMENTLIST, element: <PaymentList /> },
      { path: `/payment/:orderId`, element: <PaymentDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RouterProvider router={router} />
  </ContextProvider>
);
