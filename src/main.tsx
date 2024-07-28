import ReactDOM from "react-dom/client";
import "./main.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { AuthProvider } from "./context/AuthProvider";
import Protected from "./context/Protected";

import WelcomePage from "./routes/auth/Welcome";
import Signup from "./routes/auth/Signup";
import Info from "./routes/auth/Info";
import Login from "./routes/auth/Login";
import Forgot from "./routes/auth/Forgot";
import Payment from "./routes/auth/Payment";

import Root from "./routes/app/Root";
import Transactions from "./routes/app/Transactions";
import Add from "./routes/app/Add";
import AddTemplate from "./routes/app/AddTemplate";
import Team from "./routes/app/Team";
import AddMember from "./routes/app/AddMember";
import Wallet from "./routes/app/Wallet";
import Calendar from "./routes/app/Calendar";
import Settings from "./routes/app/Settings";
import Vote from "./routes/app/Vote";
import Analytics from "./routes/app/Analytics";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: (
      <AuthProvider>
        <WelcomePage />
      </AuthProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthProvider>
        <Signup />
      </AuthProvider>
    ),
  },
  {
    path: "/info",
    element: (
      <AuthProvider>
        <Info />
      </AuthProvider>
    ),
  },
  {
    path: "/payment",
    element: (
      <AuthProvider>
        <Payment />
      </AuthProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/forgot",
    element: (
      <AuthProvider>
        <Forgot />
      </AuthProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <Protected>
          <Root />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: (
      <AuthProvider>
        <Protected>
          <Settings />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/vote",
    element: (
      <AuthProvider>
        <Protected>
          <Vote />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/transactions",
    element: (
      <AuthProvider>
        <Protected>
          <Transactions />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/add",
    element: (
      <AuthProvider>
        <Protected>
          <Add />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/add_template",
    element: (
      <AuthProvider>
        <Protected>
          <AddTemplate />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/team",
    element: (
      <AuthProvider>
        <Protected>
          <Team />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/add_member",
    element: (
      <AuthProvider>
        <Protected>
          <AddMember />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/wallet",
    element: (
      <AuthProvider>
        <Protected>
          <Wallet />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/calendar",
    element: (
      <AuthProvider>
        <Protected>
          <Calendar />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytics",
    element: (
      <AuthProvider>
        <Protected>
          <Analytics />
        </Protected>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);

serviceWorkerRegistration.register();
