import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserInfo from '../Components/UserInfo.jsx'
import Project from '../Components/Project.jsx'
import Profile from '../Components/Profile.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    children:[
      {
        path:"",
        element:<UserInfo />
      },
      {
        path: "project",
        element:<Project />
      },
      {
        path:'user',
        element:<Profile />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}>
  </RouterProvider>
  </StrictMode>,
)
