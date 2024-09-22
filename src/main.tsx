import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
// import HomeRoute from './routes/home';
import EventsRoute from './routes/events';
import SignupRoute from './routes/sign-up';

const router = createBrowserRouter([
  {
    path: "/",
    element: <EventsRoute />,
  },
  {
    path: "/events",
    element: <EventsRoute />,
  },
  {
    path: "/sign-up",
    element: <SignupRoute />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
