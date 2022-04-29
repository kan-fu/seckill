import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Product() {
  let params = useParams()
  const [quantity, setQuantity] = useState(null)
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')
  const url = `http://${process.env.BACKEND_HOST || 'localhost:7000'}/seckill/${
    params.productId
  }/`
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        setQuantity(Number(data.quantity) <= 0 ? 0 : Number(data.quantity))
      )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    fetch(url, { method: 'POST', body: JSON.stringify({ user: userId }) })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data)
        if (data.status) {
          setQuantity(quantity - 1)
        }
      })
  }

  return (
    <>
      <div className='flex justify-center items-center h-screen bg-gray-600'>
        <div className='w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <h1 className='text-lg'>Product ID {params.productId}</h1>
          <hr className='my-2' />
          {quantity !== null && (
            <p>
              Currently there {quantity > 1 ? 'are' : 'is'} {quantity} quantit
              {quantity > 1 ? 'ies' : 'y'} in stock.
            </p>
          )}
          <div className='w-full my-3'>
            <label
              className=' w-1/3 uppercase tracking-wide text-gray-700 text-base font-bold mr-2'
              htmlFor='userId'
            >
              User ID
            </label>
            <input
              className='shadow  w-2/3 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              id='userId'
              type='text'
              placeholder='1'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className='flex justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
              type='button'
              disabled={quantity === 0}
              onClick={handleClick}
            >
              Get it
            </button>
            <Link to={`/order/${params.productId}`}>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
                type='button'
              >
                Check order
              </button>
            </Link>
          </div>
          <Link to='/'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
              type='button'
            >
              Back to Homepage
            </button>
          </Link>
          {message && (
            <p className={message.status ? 'text-green-500' : 'text-red-500'}>
              {message.message}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
