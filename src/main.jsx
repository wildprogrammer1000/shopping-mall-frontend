import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ContextProvider } from "./store/context.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PATH } from "./constants/path.js";
import LoginView from "./views/LoginView.jsx";
import SignUpView from "./views/SignUpView.jsx";

const router = createBrowserRouter([
  { path: PATH.ROOT, element: <App /> },
  { path: PATH.LOGIN, element: <LoginView /> },
  { path: PATH.SIGNUP, element: <SignUpView /> },
]);

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RouterProvider router={router} />
  </ContextProvider>
);
