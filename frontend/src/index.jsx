import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Product from './routes/Product'
import Orders from './routes/Orders'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path=':productId' element={<Product />} />
      <Route path='/order/:productId' element={<Orders />} />
    </Routes>
  </BrowserRouter>
)
