import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    const url = `http://${
      process.env.BACKEND_HOST || 'localhost:7000'
    }/seckill/products`
    fetch(url)
      .then((response) => response.json())
      .then((data) => setProducts(data.data))
  }, [])

  const handleClick = () => {
    const url = `http://${
      process.env.BACKEND_HOST || 'localhost:7000'
    }/seckill/product/${productId}/`
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ quantity: Number(quantity) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          const newProduct = data.data
          const oldProduct = products.findIndex(
            (product) => product.product_id === newProduct.product_id
          )
          if (oldProduct !== -1) {
            setProducts([
              ...products.slice(0, oldProduct),
              newProduct,
              ...products.slice(oldProduct + 1),
            ])
          } else {
            setProducts([...products, newProduct])
          }
        }
      })
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-600'>
      <div className='w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <form>
          <div className='flex flex-wrap -mx-3 mb-3'>
            <div className='w-full sm:w-1/2 px-3 mb-6 sm:mb-0'>
              <label
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                htmlFor='productId'
              >
                Product ID
              </label>
              <input
                className='shadow block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                id='productId'
                type='text'
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder='1'
              />
            </div>
            <div className='w-full sm:w-1/2 px-3'>
              <label
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                htmlFor='quantity'
              >
                Quantity
              </label>
              <input
                className='shadow block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='quantitye'
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder='50'
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
              disabled={!productId || !quantity}
              type='button'
              onClick={handleClick}
            >
              Add product
            </button>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
              type='button'
              onClick={() => {
                fetch('http://localhost:7000/seckill/reset/', {
                  method: 'POST',
                })
                setProducts([])
              }}
            >
              Reset database
            </button>
          </div>
        </form>
        <hr className='my-3' />

        <ul className='border border-gray-200 rounded-lg'>
          {products.map((product) => (
            <li
              className='block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
              key={product.product_id}
            >
              <Link to={product.product_id}>
                Product ID {product.product_id} has {product.quantity} in stock
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
