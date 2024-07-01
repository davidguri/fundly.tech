import ReactDOM from 'react-dom/client';
import './main.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './ErrorPage';
import { AuthProvider } from './context/AuthProvider';
import Protected from './context/Protected';

import WelcomePage from "./routes/auth/Welcome";
import Signup from './routes/auth/Signup';
import Login from './routes/auth/Login';

import Root from "./routes/app/Root";
import Transactions from './routes/app/Transactions';
import Add from './routes/app/Add';
import Team from './routes/app/Team';
import Wallet from './routes/app/Wallet';
import Settings from './routes/app/Settings';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

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
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);

serviceWorkerRegistration.register();
