import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import UploadProducts from './pages/Upload'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoutes'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* pública */}
        <Route path="/login" element={<Login />} />

        {/* protegidas */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/produtos" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />

        <Route path="/produtos/novo" element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        } />

        <Route path="/produtos/upload" element={
          <PrivateRoute>
            <UploadProducts />
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}