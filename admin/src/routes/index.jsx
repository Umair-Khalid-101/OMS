import {
  Route,
  Routes,
} from "react-router-dom";

import React, { lazy, Suspense } from "react";

const Layout = lazy(() => import("./layout"));
const Designer = lazy(() => import("../pages/designer"));
const ViewTask = lazy(() => import("../pages/tasks/details"));
const CreateOrder = lazy(() => import("../pages/orders/create"));
const Confirm = lazy(() => import("../pages/orders/confirm"));
const UpdatePo = lazy(() => import("../pages/orders/updatepo"));

const Login = lazy(() => import("../pages/auth/login"));
const Tasks = lazy(() => import("../pages/tasks"));
const Orders = lazy(() => import("../pages/orders"));
const Admin = lazy(() => import("../pages/admin"));
const Invite = lazy(() => import("../pages/auth/invite"));
const Settings = lazy(() => import("../pages/settings"));
const AuthRoute = lazy(() => import("./authRoute"));
const ProtectedRoute = lazy(() => import("./portectedRoute"));


export default function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ProtectedRoute component={<Tasks />} />} />
          <Route path="/account-manager" element={<ProtectedRoute component={<Admin />} />} />
          <Route path="/designer" element={<ProtectedRoute component={<Designer />} />} />
          <Route path="/orders" element={<ProtectedRoute component={<Orders />} />} />
          <Route path="/tasks" element={<ProtectedRoute component={<Tasks />} />} />
          <Route path="/settings" element={<ProtectedRoute component={<Settings />} />} />

        </Route>
        <Route path="/login" element={<AuthRoute component={<Login />} />} />
        <Route path="/accept-invitation/:token" element={<Invite />} />
        <Route path="/task/:task/:token" element={<ViewTask />} />

        <Route
          path="/create-new-order"
          element={<CreateOrder />}
        />
        <Route
          path="/confirm-order"
          element={<Confirm />}
        />
        <Route
          path="/update-po/:id"
          element={<UpdatePo />}
        />
      </Routes >
    </Suspense>
  )
}
