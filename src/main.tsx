import ReactDOM from 'react-dom/client';
import './main.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Protected from './context/Protected';

import WelcomePage from "./routes/auth/Welcome";

import Root from "./routes/app/Root";
import ErrorPage from './ErrorPage';
import Transactions from './routes/app/Transactions';

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/",
    element: (
      <Root />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
