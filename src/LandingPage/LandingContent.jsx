import { Typography } from '@mui/material'
import React from 'react'

const LandingContent = () => {
  return (
    <div className='mt-20 flex justify-center'>
        <div className='pl-10'>
      <Typography variant='h4' component="div" sx={{marginTop:"7rem"}}>
        Track, Analyze & Succeed !!
      </Typography>
      <p className='text-wrap'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, alias voluptas ipsam quas magnam omnis odio quos consequuntur reprehenderit, deserunt adipisci nesciunt, cum porro repellat repellendus eos minus delectus. Officia porro facilis soluta minima alias eius, dolor, molestiae ullam explicabo corporis repudiandae velit! Exercitationem dolores dolore debitis reiciendis maiores tempore eos, commodi eligendi quod, eaque rem esse, necessitatibus illum perferendis!
      </p>
      </div>
      <img src='/homepage.png' alt='temp'/>
    </div>
  )
}

export default LandingContent
