import React from 'react'
import Header from '../Others/Header'
import TasklistNumber from '../Others/TasklistNumber'
import Tasklist from '../Tasklist/Tasklist'



const Employee = ({data}) => {
  console.log(data)
  return (
    <div>
     <div className='bg-[#232F3E]'>
        <Header data={data}/>
        <TasklistNumber data={data}/>
         <Tasklist data={data}/>

     </div>
    </div>
  )
}

export default Employee
