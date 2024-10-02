import PropTypes from "prop-types";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useLocation, Link } from "react-router-dom";
import { useState, useContext } from "react";
import UserContext from "../../auth/user-context";

const Sidebar = ({ open, handleClose, drawerWidth, isMobile }) => {
  const location = useLocation();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentUser] = useContext(UserContext);

  const upperCaseName = currentUser.name.toUpperCase();

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
    handleMenuClose();
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
    {
      text: "Gestion des cours",
      icon: <LibraryBooksIcon />,
      path: "/CoursesManagement",
    },
    {
      text: "Gestion des utilisateurs",
      icon: <PersonOutlineIcon />,
      path: "/UsersManagement",
    },
    {
      text: "Besoins des utilisateurs",
      icon: <PersonOutlineIcon />,
      path: "/UserNeedAdmin",
    },
  ];

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          padding: "10px 0",
          backgroundColor: "#f5f5f5",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          "::-webkit-scrollbar": {
            width: "0.4em",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        },
      }}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: (theme) => theme.spacing(2),
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6" noWrap>
          Panneau d'administration
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: (theme) => theme.spacing(2),
          borderBottom: "1px solid #ddd",
          cursor: "pointer",
        }}
        onClick={handleMenuOpen}
      >
        <Avatar
          alt={upperCaseName}
          src="/static/images/avatar/1.jpg"
          sx={{
            width: 56,
            height: 56,
            marginBottom: (theme) => theme.spacing(1),
          }}/>
        <Typography variant="subtitle1">{currentUser.name}</Typography>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.path}
            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          >
            <Tooltip title={item.text} placement="right">
              <ListItem
                button
                sx={{
                  margin: (theme) => theme.spacing(1, 0),
                  padding: (theme) => theme.spacing(1.5, 2),
                  backgroundColor: location.pathname === item.path ? "#1565c0" : "inherit",
                  color: location.pathname === item.path ? "primary.contrastText" : "inherit",
                  borderRadius: 0,
                  boxShadow: location.pathname === item.path ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "primary.contrastText",
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: location.pathname === item.path ? "primary.contrastText" : "inherit",
                  },
                  "& .MuiListItemText-root": {
                    flex: "1 1 auto",
                    textAlign: "left",
                    fontWeight: location.pathname === item.path ? "bold" : "regular",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? "primary.contrastText" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? "bold" : "regular",
                  }}
                />
              </ListItem>
            </Tooltip>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

// Define PropTypes
Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Sidebar;
