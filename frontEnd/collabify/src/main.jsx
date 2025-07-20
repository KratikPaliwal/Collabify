import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from '../src/AuthContext.jsx'; // Update path if needed
import UserInfo from '../Components/UserInfo.jsx';
import Project from '../Components/Project.jsx';
import Profile from '../Components/Profile.jsx';
import Login from '../Components/Login.jsx';
import Signup from '../Components/Signup.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <UserInfo />
      },
      {
        path: 'project',
        element: <Project />
      },
      {
        path: 'user',
        element: <Profile />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);