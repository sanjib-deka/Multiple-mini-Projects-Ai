  import React from 'react'
  import Header from '../Others/Header'
import CreateTask from '../Others/CreateTask'
import AllTask from '../Others/AllTask'

  const AdminDashboard = () => {
    return (
      <div>
        <Header/>
        <CreateTask/>
        <AllTask/>
        
      </div>
    )
  }

  export default AdminDashboard