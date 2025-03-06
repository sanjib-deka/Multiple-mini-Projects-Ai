import React from 'react'

const Header = () => {
   
 const setoi = ({data}) =>{
    console.log("hiiii")
  }

  return (
    <div className='flex items-end justify-between px-10  h-28 py-7'> 
      <h1 className='text-2xl text-amber-50 '> Hello <br/> <span className='text-3xl font-semibold'>Dear {data.firstName}</span>  </h1>
      <button onClick={setoi} className='border-4 transition active:scale-90 border-rose-600 p-2 rounded-4xl bg-rose-50 border-rounded'>Log Out</button>
    </div>
  )
}

export default Header
