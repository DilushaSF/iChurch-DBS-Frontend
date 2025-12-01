import {useState} from "react";
import type {JSX, MouseEvent} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
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
  ManageAccounts,
  Diversity2,
  ConnectWithoutContact,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Church,
  Groups,
  SettingsAccessibility,
  AccountBalance,
  FamilyRestroom,
  Healing,
  SpatialAudioOff as SpatialAudioOffIcon,
  CalendarMonth,
} from "@mui/icons-material";
import {useAuth} from "../hooks/useAuth";
// import {useAuth} from "../context/AuthContext";

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
  const registrations: MenuItem[] = [
    // {text: "Home", icon: <DashboardIcon />, path: "/dashboard"},
    {
      text: "Member Registration",
      icon: <FamilyRestroom />,
      path: "/member-registrations",
    },
    {text: "Burials", icon: <Healing />, path: "/burials"},
    {text: "Marriages", icon: <Diversity2 />, path: "/marriages"},
  ];

  const committees: MenuItem[] = [
    {
      text: "Parish Committee",
      icon: <ConnectWithoutContact />,
      path: "/parish-committee",
    },
    {text: "Zonal Leaders", icon: <Groups />, path: "/zonal-leaders"},
    {text: "Unit Leaders", icon: <Groups />, path: "/unit-leaders"},
    {text: "Choir", icon: <SpatialAudioOffIcon />, path: "/choiristors"},
    {
      text: "Youth Association",
      icon: <SettingsAccessibility />,
      path: "/youth-association",
    },
    {
      text: "Sunday School Teachers",
      icon: <AccountBalance />,
      path: "/sunday-school-teachers",
    },
    {text: "Event Management", icon: <CalendarMonth />, path: "/ministry"},
  ];

  const drawer = (
    <Box>
      {/* Logo Section */}
      <Link to="/dashboard" style={{textDecoration: "none", color: "inherit"}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.8,
            gap: 1,
          }}>
          <Church sx={{fontSize: 35, color: "primary.main"}} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{fontWeight: 600}}>
            iChurch
          </Typography>
        </Box>
      </Link>
      <Divider />

      {/* Menu Items */}

      <Divider />

      <List sx={{px: 1, py: 2}}>
        {registrations.map((item) => (
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

      <List sx={{px: 1, py: 2}}>
        {committees.map((item) => (
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
              <ManageAccounts />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
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
                  {user?.churchName?.charAt(0).toUpperCase()}
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
                {user?.churchName}
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
