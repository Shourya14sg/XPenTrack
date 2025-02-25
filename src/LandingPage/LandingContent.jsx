import Typography from "@mui/material/Typography";
import React from 'react'

const LandingContent = () => {
  return (
    <div className='mt-20 flex justify-center'>
        <div className='pl-10'>
      <Typography variant='h4' component="div" sx={{marginTop:"7rem"}}>
        Track, Analyze & Succeed !!
      </Typography>
      <p className='text-wrap'>
      The SplitUp is a web-based application designed to help users efficiently manage and track their expenses. Users can log their expenses by entering details such as cost, item type, location, and expenditure category. The application provides a tabular view of all expenses with intuitive filters for easy searching and editing.

Additionally, the tracker offers visual insights through graphs and metrics, enabling users to analyze spending patterns. The platform supports expense-sharing, allowing users to split expenses and track shared transactions with others. A built-in debt management feature lets users keep track of money owed and simplifies repayments.
      </p>
      </div>
      <img src='/homepage.png' alt='temp'/>
    </div>
  )
}

export default LandingContent
