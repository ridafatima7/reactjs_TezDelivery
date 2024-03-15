import React, { useEffect } from 'react'

const Loader = () => {
    useEffect(()=>{
        
    })
  return (
    <div className='loader'>
       <div className='image-loader'>
         <img src="/Images/icon.png" alt='' />   
         <h5>Opening App ...</h5>  
       </div>
      
    </div>
  )
}

export default Loader
