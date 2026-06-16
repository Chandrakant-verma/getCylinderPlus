import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import Captainlogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import UserHome from "./pages/UserHome";

import CaptainHome from "./pages/CaptainHome";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LiveTracking from "./components/LiveTrackForUser";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import CaptainProtectWrapper from "./pages/CaptainProtectedWrapper";
import AdminProtectedWrapper from "./pages/AdminProtectedWrapper";
import UserSuccessful from "./components/UserSuccessful";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminUsersList from "./components/AdminUsersList";
import AdminCaptainsList from "./components/AdminCaptainsList";
import AdminOrdersList from "./components/AdminOrdersList";
import AdminAnalyze from "./components/AdminAnalyze";
import BottomNavbar from "./pages/BottomNavbar";
import UserProfile from "./pages/UserProfile";
import CaptainProfile from "./pages/CaptainProfile";
import AdminProfile from "./pages/AdminProfile";
import NotificationsPage from "./pages/NotificationsPage";
import LiveTrackForCaptain from "./components/LiveTrackForCaptain";
import WaitingPayment from "./pages/CaptainWaitingPayment";
import OrderReached from "./components/OrderReached";

import Payment from "./pages/Payment";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/users/login" element={<UserLogin />} />
        <Route path="/users/signup" element={<UserSignup />} />
        <Route path="/captains/login" element={<Captainlogin />} />
        <Route path="/captains/signup" element={<CaptainSignup />} />
        <Route path="/users/track-order" element={<LiveTracking />} />
        <Route path="/users/successful" element={<UserSuccessful />} />
        <Route path="/admins/login" element={<AdminLogin />} />
        <Route
          path="/admins/notifications"
          element={
            <AdminProtectedWrapper>
              <NotificationsPage />
            </AdminProtectedWrapper>
          }
        />
        <Route path="/users/payment" element={<Payment />} />
        <Route
          path="/users/notifications"
          element={
            <UserProtectWrapper>
              <NotificationsPage />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/captains/notifications"
          element={
            <CaptainProtectWrapper>
              <NotificationsPage />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/admins/profile"
          element={
            <AdminProtectedWrapper>
              <AdminProfile />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/admins/home"
          element={
            <AdminProtectedWrapper>
              <AdminHome />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/admins/analyze"
          element={
            <AdminProtectedWrapper>
              <AdminAnalyze />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/admins/usersList"
          element={
            <AdminProtectedWrapper>
              <AdminUsersList />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/admins/captainsList"
          element={
            <AdminProtectedWrapper>
              <AdminCaptainsList />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/admins/ordersList"
          element={
            <AdminProtectedWrapper>
              <AdminOrdersList />
            </AdminProtectedWrapper>
          }
        />
        <Route
          path="/users/profile"
          element={
            <UserProtectWrapper>
              <UserProfile />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/users/home"
          element={
            <UserProtectWrapper>
              <UserHome />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/captains/profile"
          element={
            <CaptainProtectWrapper>
              <CaptainProfile />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/captains/home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />

        <Route
          path="/captains/live-track"
          element={
            <CaptainProtectWrapper>
              <LiveTrackForCaptain />
            </CaptainProtectWrapper>
          }
        />

        <Route
          path="/captains/waiting-payment"
          element={
            <CaptainProtectWrapper>
              <WaitingPayment />
            </CaptainProtectWrapper>
          }
        />

        <Route
          path="/captains/reached"
          element={
            <CaptainProtectWrapper>
              <OrderReached />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
      <BottomNavbar />
    </div>
  );
}

export default App;
