import {useState, type JSX} from "react";
import {useNavigate, useLocation, Outlet} from "react-router-dom";
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
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  Groups as GroupsIcon,
  AppRegistration as RegistrationIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Church as ChurchIcon,
  FavoriteBorder as FavoriteIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
  MusicNote as MusicIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  Upcoming as UpcomingIcon,
} from "@mui/icons-material";
import {useAuth} from "../context/AuthContext";

const drawerWidth = 280;

interface SubMenuItem {
  text: string;
  path: string;
  icon: JSX.Element;
}

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  subItems?: SubMenuItem[];
}

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();
  const location = useLocation();
  const {user, logout} = useAuth();

  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Registrations",
      icon: <RegistrationIcon />,
      subItems: [
        {
          text: "Member Registration",
          path: "/registrations/members",
          icon: <PersonIcon />,
        },
        {
          text: "Baptism",
          path: "/registrations/baptism",
          icon: <ChurchIcon />,
        },
        {
          text: "Burials & Deaths",
          path: "/burials",
          icon: <FavoriteIcon />,
        },
        {
          text: "Marriages",
          path: "/marriages",
          icon: <FavoriteIcon />,
        },
      ],
    },
    {
      text: "Associations",
      icon: <GroupsIcon />,
      subItems: [
        {
          text: "Parish Committee",
          path: "/associations/parish-committee",
          icon: <CategoryIcon />,
        },
        {
          text: "Choir",
          path: "/associations/choir",
          icon: <MusicIcon />,
        },
        {
          text: "Youth",
          path: "/associations/youth",
          icon: <GroupIcon />,
        },
        {
          text: "Zonal Leaders",
          path: "/associations/zonal-leaders",
          icon: <LocationIcon />,
        },
        {
          text: "Unit Leaders",
          path: "/associations/unit-leaders",
          icon: <GroupIcon />,
        },
        {
          text: "Sunday School Teachers",
          path: "/associations/sunday-school",
          icon: <SchoolIcon />,
        },
      ],
    },
    {
      text: "Event Management",
      icon: <EventIcon />,
      subItems: [
        {
          text: "Weekly Schedule",
          path: "/events/weekly-schedule",
          icon: <CalendarIcon />,
        },
        {
          text: "Upcoming Events",
          path: "/events/upcoming",
          icon: <UpcomingIcon />,
        },
        {
          text: "Past Events",
          path: "/events/past",
          icon: <EventIcon />,
        },
      ],
    },
    {
      text: "Members",
      icon: <PeopleIcon />,
      path: "/members",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.subItems) {
      // Toggle submenu
      setOpenMenus((prev) => ({
        ...prev,
        [item.text]: !prev[item.text],
      }));
    } else if (item.path) {
      // Navigate to page
      navigate(item.path);
      setMobileOpen(false);
    }
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}>
        <ChurchIcon sx={{mr: 2, fontSize: 32}} />
        <Typography variant="h6" noWrap component="div">
          Church CMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{px: 1, py: 2}}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItem disablePadding sx={{mb: 0.5}}>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                selected={item.path === location.pathname}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}>
                <ListItemIcon
                  sx={{
                    color:
                      item.path === location.pathname
                        ? "primary.main"
                        : "inherit",
                  }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems &&
                  (openMenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {/* Submenu Items */}
            {item.subItems && (
              <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding sx={{mb: 0.5}}>
                      <ListItemButton
                        onClick={() => handleSubMenuClick(subItem.path)}
                        selected={subItem.path === location.pathname}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          "&.Mui-selected": {
                            backgroundColor: "primary.light",
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "primary.light",
                            },
                          },
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color:
                              subItem.path === location.pathname
                                ? "primary.main"
                                : "text.secondary",
                          }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: "0.875rem",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{display: "flex"}}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: {sm: `calc(100% - ${drawerWidth}px)`},
          ml: {sm: `${drawerWidth}px`},
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          color: "text.primary",
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{mr: 2, display: {sm: "none"}}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              menuItems
                .flatMap((item) => item.subItems || [])
                .find((subItem) => subItem.path === location.pathname)?.text ||
              "Dashboard"}
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} sx={{ml: 2}}>
            <Avatar sx={{bgcolor: "primary.main"}}>
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}>
            <Box sx={{px: 2, py: 1}}>
              <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
        aria-label="navigation">
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
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: "none", sm: "block"},
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid #e0e0e0",
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
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

export default Layout;
