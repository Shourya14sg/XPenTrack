import React from 'react'
import ResponsiveDrawer from '../Navbar'
import ExpenseTable from './ExpenseTable'

export const Dashboard = () => {
  return (
    <div>
      <ResponsiveDrawer/>
      <ExpenseTable/>
    </div>
  )
}
