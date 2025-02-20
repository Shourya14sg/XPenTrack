import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Link } from 'react-router-dom';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      {/* Removed extra Toolbar to eliminate space above sidebar */}
      {/* <Typography>XPenTrack</Typography> */}
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, link:"/dashboard" },
          { text: 'Split Bills', icon: <CardMembershipIcon />, link:"/splitbills" },
          { text: 'Debt Analysis', icon: <CurrencyExchangeIcon />, link:"/debtaly" },
          { text: 'Expense Analysis', icon: <BarChartIcon />, link:"/expensegraphs" },
          { text: 'User Profile', icon: <AccountCircleIcon />, link:"/userpro" },
        ].map(({ text, icon, link }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={link}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar Fixed at the Top */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: 56, // Reduced AppBar height
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ minHeight: 56, display: 'flex', alignItems: 'center' }}>
          {/* Menu Button for Mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* App Name */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            XPenTrack
          </Typography>

          {/* Notification & Profile Icons */}
          <NotificationsIcon sx={{marginRight:"2rem", cursor:"pointer"}} />
          <AccountCircleIcon sx={{cursor:"pointer"}} />
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar menu"
      >
        {/* Mobile Sidebar */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: `calc(100vh - 56px)`, // Sidebar adjusted to fit under AppBar
              mt: '56px',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
