import ReactDOM from 'react-dom/client';
import './main.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Protected from './context/Protected';

import WelcomePage from "./routes/Welcome";

import Root from "./routes/app/Root";
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Root />
      </Protected>
    ),
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
