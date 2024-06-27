import ReactDOM from 'react-dom/client';
import './main.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './ErrorPage';
import Protected from './context/Protected';

import WelcomePage from "./routes/auth/Welcome";
import Signup from './routes/auth/Signup';
import Login from './routes/auth/Login';

import Root from "./routes/app/Root";
import Transactions from './routes/app/Transactions';
import Settings from './routes/app/Settings';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Root />
      </Protected>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: (
      <Protected>
        <Settings />
      </Protected>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/transactions",
    element: (
      <Protected>
        <Transactions />
      </Protected>
    ),
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);

serviceWorkerRegistration.register();
