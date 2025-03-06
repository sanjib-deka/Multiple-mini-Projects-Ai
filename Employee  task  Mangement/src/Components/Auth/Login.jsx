import React, { useState } from 'react'

const Login = ({handleLogin}) => {



 const [email,setEmail] = useState('');
 const [password,setPassword] = useState('');

  const submitHandler = (e)=> {
    e.preventDefault();
    handleLogin(email,password)
    
    setEmail("")
    setPassword("")
  }


  
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='border-2 border-cyan-500 p-20'>
        <form onSubmit={(e) => submitHandler(e)} className='text-white flex flex-col items-center justify-center'>
            <input value={email}
              onChange={(e)=>{
                setEmail(e.target.value)
              }}        
            required type="email"  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200 placeholder:text-gray-400'  placeholder='Enter your Holder'/>
            <input 
            value={password}
            onChange={(e)=>{
              setPassword(e.target.value)
            }}            
            required type="password"  className='w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200  placeholder:text-gray-400  ' placeholder='Enter your password'/>
             <button  type='submit' className='w-full mt-3 border-none  bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400'>Login in</button>
        </form>        
         </div>
    </div>
  )
}

export default Login
