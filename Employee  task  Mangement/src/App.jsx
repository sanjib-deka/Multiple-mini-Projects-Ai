import React, { useContext, useEffect, useState } from 'react'
import Login from './Components/Auth/Login'
import Employee from './Components/DashBoard/Employee'
import AdminDashboard from './Components/DashBoard/AdminDashboard'
import { getLocalStorage, setLocalStorage } from './utils/localStorage'
import { AuthContext } from './Context/AuthProvider'

const App = () => {
 
  const [user , setUser] = useState(null)

  const [loggedInUserData , setloggedInUserData]  = useState(null)

  
  const AuthData = useContext(AuthContext)

// useEffect(()=>{
//   if(AuthData){
//     const loggedInUser = localStorage.getItem("loggedInUser")
//     if(loggedInUser){
//       setUser(loggedInUser)
//     }
//   }
// },[AuthData])

  

  const handleLogin = (email, password) => {
    if (email === 'admin@me.com' && password === '123') {
      console.log("This is admin");
      setUser('admin')
      localStorage.setItem('loggedInUser',JSON.stringify({role:'admin'}))
      
    } else if (AuthData) {
          const employee = AuthData.employees.find((e)=>email == e.email && password == e.password)
          if(employee){
            console.log("This is user");
            setUser('employee')
            setloggedInUserData(employee)
            localStorage.setItem('loggedInUser',JSON.stringify({role:'employee'}))
          }    
      
    } else {
      alert('Invalid Credentials');
    }
  };

  
  return (
    <div >
            { !user?<Login  handleLogin={handleLogin}/> : ''}
            {user == 'admin'?<AdminDashboard/> : (user == Employee ? <Employee data={loggedInUserData} /> : null) }
       
       {/*<Employee/>*/}

       {/* <AdminDashboard/> */}

    </div>
  )
}

export default App
