import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import BaseLayout from "../layouts/BaseLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Chat = lazy(() => import("../pages/Chat"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BaseLayout />}>
      <Route
        index
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Chat />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="login"
        element={
          <PublicRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="signup"
        element={
          <PublicRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Signup />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
        }
      />
    </Route>
  )
);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
