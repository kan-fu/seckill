import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const Orders = () => {
  let params = useParams()
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const url = `http://${
      process.env.BACKEND_HOST || 'localhost:7000'
    }/seckill/order/${params.productId}`
    fetch(url)
      .then((response) => response.json())
      .then((data) => setOrders(data.data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='flex justify-center items-center h-screen bg-gray-600'>
      <div className='w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 '>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='inline-block'>Product ID {params.productId}</h1>
          <h1 className='inline-block'>Total orders: {orders.length}</h1>
        </div>
        <div className='relative overflow-x-auto sm:rounded-lg overflow-auto max-h-80'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 '>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Order timstamp
                </th>
                <th scope='col' className='px-6 py-3'>
                  User ID
                </th>
              </tr>
            </thead>
            <tbody className=''>
              {/* <th
                  scope='row'
                  class='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'
                >
                  Apple MacBook Pro 17"
                </th> */}
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                >
                  <td className='px-6 py-4'>{order.order_timestamp}</td>
                  <td className='px-6 py-4'>{order.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to={`/${params.productId}`}>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
            type='button'
          >
            Back to Order
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Orders
