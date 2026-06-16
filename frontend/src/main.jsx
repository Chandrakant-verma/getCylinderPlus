import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./contexts/UserContxt.jsx";
import CaptainContext from "./contexts/CaptainContext.jsx";
import OrderContext from "./contexts/OrderContext.jsx";
import AdminContext from "./contexts/AdminContext.jsx";
import SocketProvider from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <AdminContext>
    <OrderContext>
      <CaptainContext>
        <UserContext>
          <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SocketProvider>
        </UserContext>
      </CaptainContext>
    </OrderContext>
  </AdminContext>,
);
