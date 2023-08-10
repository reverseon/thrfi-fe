import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.scss';
import Landing from './pages/Landing';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Go from './pages/Go';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <div> 404 </div>
  },
  {
    path: '/:key',
    element: <Go />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
