import { useState, useEffect } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize the sidebar open state from localStorage
  const [open, setOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState === "true" ? true : false;
  });

  // Effect to update localStorage when 'open' state changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", open);
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}
    >
      <CssBaseline />
      <Navbar
        handleDrawerOpen={handleDrawerOpen}
        open={open}
        drawerWidth={drawerWidth}
        isMobile={isMobile}
      />
      <Sidebar
        open={open}
        handleClose={handleDrawerClose}
        drawerWidth={drawerWidth}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: open && !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%', 
          ml: open && !isMobile ? `${drawerWidth}px` : 0,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
              delay: '0.05s' // Delay the transition by 300 milliseconds
            }),
          overflow: "auto",
        }}
      >
        <div style={{ marginTop: "64px", padding: "20px" }}>{children}</div>
      </Box>
    </Box>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
