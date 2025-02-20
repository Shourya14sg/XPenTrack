import React from 'react'
import ResponsiveDrawer from '../Drawer'
import NestedList from './GroupsTable'
import { Box } from '@mui/material'
import CreateGroupForm from './CreateGroup.jsx'

const SplitBills = () => {
  return (
    <>
    <ResponsiveDrawer/>
    <Box sx={{marginLeft:"15rem", marginTop:"4rem"}}>
        {/* <CreateGroupForm/> */}
        <NestedList/>
    </Box>
    </>
  )
}

export default SplitBills
