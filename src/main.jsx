import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages.jsx/Login'
import Layout from './Layout'
import AdminDashboard from './Pages.jsx/AdminDashboard'




const router = createBrowserRouter([
{
  path:"/",
  element:<Layout />,
  children:[
    {
      path:"/",
      element:<Login />
    },
    {
      path:"AdminDashboard",
      element:<AdminDashboard />
    },
   
  
    // {
    //   path:"AddToCart",
    //   element: <ProtectedRoutes component={<AddToCart/>}/>
      
    // },
 
    {
      path:"*",
      element: <h1>NOT FOUND</h1>
    }
  ]
}
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
  </RouterProvider>  
)
