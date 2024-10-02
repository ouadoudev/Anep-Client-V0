import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import useApiAxios from "../../config/axios";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Notifications from "@mui/icons-material/Notifications";
import People from "@mui/icons-material/People";
import AdminLayout from "../../layout/admin/AdminLayout";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";

const socket = io("https://anep-server.onrender.com");

const PresenceMenu = ({
  anchorEl,
  userPresence,
  handleMenuClose,
  handleDaysChange,
  handleSavePresence,
}) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          padding: "10px",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
        },
      }}
    >
      {userPresence.map((user) => (
        <MenuItem key={user._id} style={{ justifyContent: "space-between" }}>
          <Typography variant="body1" color="textSecondary">
            {user.name}
          </Typography>
          <Box>
            <TextField
              type="number"
              value={user.daysPresent}
              onChange={(e) => handleDaysChange(user._id, e.target.value)}
              label="Days Present"
              inputProps={{ min: 0 }}
              style={{ width: 100 }}
            />
          </Box>
        </MenuItem>
      ))}
      <MenuItem>
        <Button
          fullWidth
          onClick={handleSavePresence}
          color="primary"
          variant="contained"
          style={{ marginTop: 10 }}
        >
          Sauvegarder
        </Button>
      </MenuItem>
    </Menu>
  );
};

PresenceMenu.propTypes = {
  anchorEl: PropTypes.any,
  userPresence: PropTypes.array.isRequired,
  handleMenuClose: PropTypes.func.isRequired,
  handleDaysChange: PropTypes.func.isRequired,
  handleSavePresence: PropTypes.func.isRequired,
};

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userPresence, setUserPresence] = useState([]);

  useEffect(() => {
    fetchCourses();

    socket.on("notification", (message) => {
      alert(`Notification: ${message}`);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const handleMenuOpen = async (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
    try {
      const response = await useApiAxios.get(
        `/courses/${course._id}/assignedUsers`
      );
      const usersWithPresence = response.data.map(user => ({
        ...user,
        daysPresent: user.daysPresent || 0 // Ensure daysPresent is set
      }));
      setUserPresence(usersWithPresence);
    } catch (error) {
      console.error("Échec de la récupération des utilisateurs assignés:", error);
    }
  };

  const handleDaysChange = (userId, days) => {
    const daysPresent = parseInt(days, 10);
    setUserPresence(prevState =>
      prevState.map(user =>
        user._id === userId ? { ...user, daysPresent, status: daysPresent > 0 ? 'present' : 'absent' } : user
      )
    );
  };

  const handleSavePresence = async () => {
    const presenceData = userPresence.map((user) => ({
      userId: user._id,
      daysPresent: user.daysPresent,
    }));

    try {
      await useApiAxios.post(
        `/courses/${selectedCourse._id}/updatePresence`,
        {
          presence: presenceData,
        }
      );
      console.log("Présence mise à jour avec succès");
      handleMenuClose(); 
    } catch (error) {
      console.error("Échec de la mise à jour de la présence:", error);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const fetchCourses = async () => {
    try {
      const response = await useApiAxios.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Échec de la récupération des cours:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await useApiAxios.delete(`/courses/${id}`);
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Échec de la suppression du cours:", error);
    }
  };

  const handleDownloadAssignedUsers = async (courseId) => {
    try {
      const response = await useApiAxios.get(
        `/courses/${courseId}/assignedUsers/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assigned_users.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Nettoyer le DOM
      window.URL.revokeObjectURL(url); // Nettoyer l'objet URL
    } catch (error) {
      console.error("Échec du téléchargement des utilisateurs assignés:", error);
    }
  };

  const handleNotify = async (course) => {
    try {
      const response = await useApiAxios.get(
        `/courses/${course._id}/assignedUsers`
      );
      const userIds = response.data.map((user) => user._id);

      socket.emit("notify", {
        userIds,
        message: `Notification pour le cours: ${course.title}`,
        courseId: course._id,
      });

      console.log("Notification des utilisateurs pour le cours:", course.title);
    } catch (error) {
      console.error("Échec de la récupération des utilisateurs assignés pour la notification:", error);
    }
  };

  const handleDownloadEvaluations = async (courseId) => {
    try {
      const response = await useApiAxios.get(
        `/evaluations/${courseId}/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "evaluations.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Nettoyer le DOM
      window.URL.revokeObjectURL(url); // Nettoyer l'objet URL
    } catch (error) {
      console.error("Échec du téléchargement des évaluations:", error);
    }
  };

  const columns = [
    { field: "title", headerName: "Titre du cours", width: 150 },
    { field: "offline", headerName: "Mode", width: 100 },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <div dangerouslySetInnerHTML={{ __html: params.value }} />
      ),
    },
    { field: "hidden", headerName: "Statut", width: 100 },
    { field: "budget", headerName: "Budget", width: 100 },
    {
      field: "edit",
      headerName: "Éditer",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Éditer">
            <IconButton
              component={Link}
              to={`/EditCourse/${params.row._id}`}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "delete",
      headerName: "Supprimer",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title="Supprimer">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
     
    ),
  },
  {
    field: "notify",
    headerName: "Notifier les utilisateurs",
    sortable: false,
    width: 170,
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Notifier les utilisateurs">
          <IconButton onClick={() => handleNotify(params.row)} color="info">
            <Notifications />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: "manageAttendance",
    headerName: "Gérer la présence",
    sortable: false,
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Gérer la présence">
          <IconButton
            onClick={(event) => handleMenuOpen(event, params.row)}
            color="default"
          >
            <People />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: "downloadEvaluations",
    headerName: "Télécharger les évaluations",
    sortable: false,
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Télécharger les évaluations">
          <IconButton
            onClick={() => handleDownloadEvaluations(params.row._id)}
            color="primary"
          >
            <FileUploadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: "downloadAssignedUsers",
    headerName: "Télécharger les utilisateurs assignés",
    sortable: false,
    width: 180,
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Télécharger les utilisateurs assignés">
          <IconButton
            onClick={() => handleDownloadAssignedUsers(params.row._id)}
            color="primary"
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

return (
  <AdminLayout>
    <Paper sx={{ p: 2, margin: "auto",flexGrow: 1 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Gestion des cours</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to={`/CreateCourse`}
        >
          Créer un cours
        </Button>
      </Box>
      <DataGrid
        rows={courses}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        getRowId={(row) => row._id} 
      />
      {selectedCourse && (
        <PresenceMenu
          anchorEl={anchorEl}
          userPresence={userPresence}
          handleMenuClose={handleMenuClose}
          handleDaysChange={handleDaysChange}
          handleSavePresence={handleSavePresence}
        />
      )}
    </Paper>
  </AdminLayout>
);
}

export default CourseManagement;
