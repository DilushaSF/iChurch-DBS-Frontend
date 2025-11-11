import {useState} from "react";
import type {JSX, MouseEvent} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as AttendanceIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Church,
  Groups,
  VolunteerActivism,
  School,
  Description,
} from "@mui/icons-material";
import {useAuth} from "../context/AuthContext";

const drawerWidth = 260;

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation menu items
  const menuItems: MenuItem[] = [
    {text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard"},
    {text: "Members", icon: <PeopleIcon />, path: "/members"},
    {text: "Groups", icon: <Groups />, path: "/groups"},
    {text: "Events", icon: <EventIcon />, path: "/events"},
    {text: "Attendance", icon: <AttendanceIcon />, path: "/attendance"},
    {text: "Donations", icon: <MoneyIcon />, path: "/donations"},
    {text: "Volunteers", icon: <VolunteerActivism />, path: "/volunteers"},
    {text: "Ministry", icon: <Church />, path: "/ministry"},
    {text: "Resources", icon: <School />, path: "/resources"},
    {text: "Reports", icon: <Description />, path: "/reports"},
  ];

  const drawer = (
    <Box>
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          gap: 1,
        }}>
        <Church sx={{fontSize: 35, color: "primary.main"}} />
        <Typography variant="h6" noWrap component="div" sx={{fontWeight: 600}}>
          Church MS
        </Typography>
      </Box>
      <Divider />

      {/* Menu Items */}
      <List sx={{px: 1, py: 2}}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{mb: 0.5}}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.light",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                  "& .MuiListItemText-primary": {
                    color: "white",
                  },
                },
              }}>
              <ListItemIcon sx={{minWidth: 40, color: "text.secondary"}}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{px: 1, py: 2}}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings")}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "primary.light",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "& .MuiListItemText-primary": {
                  color: "white",
                },
              },
            }}>
            <ListItemIcon sx={{minWidth: 40, color: "text.secondary"}}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{display: "flex"}}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: {sm: `calc(100% - ${drawerWidth}px)`},
          ml: {sm: `${drawerWidth}px`},
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{mr: 2, display: {sm: "none"}}}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            Church Management System
          </Typography>

          {/* Right side icons */}
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenuOpen} color="inherit">
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    bgcolor: "primary.main",
                    fontSize: 16,
                  }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            transformOrigin={{horizontal: "right", vertical: "top"}}
            anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
            <Box sx={{px: 2, py: 1}}>
              <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {xs: "block", sm: "none"},
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}>
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: "none", sm: "block"},
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {sm: `calc(100% - ${drawerWidth}px)`},
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
