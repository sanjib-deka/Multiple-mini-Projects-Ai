import React from 'react'

const TasklistNumber = () => {
  return (
    <div className='flex mt-10  gap-5 justify-between screen'>
      <div className=' w-[45%] border-2 border-amber-50 der- ml-10 px-9 py-6 mb-5 rounded-xl bg-[#B6BD35] transition-transform duration-300 hover:scale-90'>  
        <h2 className='text-2xl'>0</h2>
        <h3 className='text-xl font-medium'>New Task</h3>       
          </div>

          <div className=' w-[45%]  border-2 border-amber-50 ml-10 px-9 py-6 mb-5 rounded-xl bg-[#97230B] transition-transform duration-300 hover:scale-90'>  
        <h2 className='text-2xl'>1</h2>
        <h3 className='text-xl font-medium'>New Task</h3>       
          </div>

          <div className=' w-[45%]  border-2 border-amber-50 ml-10 px-9 py-6 mb-5 rounded-xl bg-lime-400 transition-transform duration-300 hover:scale-90'>  
        <h2 className='text-2xl'>2</h2>
        <h3 className='text-xl font-medium'>New Task</h3>       
          </div>

          <div className=' w-[45%]  border-2 border-amber-50 ml-10 px-9 py-6 mb-5 mr-8 rounded-xl bg-emerald-500 transition-transform duration-300 hover:scale-90'>  
        <h2 className='text-2xl'>3</h2>
        <h3 className='text-xl font-medium'>New Task</h3>       
          </div>
    </div>

    
  )
}

export default TasklistNumber
