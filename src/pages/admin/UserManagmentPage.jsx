import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, useTheme, Tooltip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel operations
import useApiAxios from '../../config/axios';
import AdminLayout from '../../layout/admin/AdminLayout';

function GestionUtilisateurs() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useApiAxios.get('users');
        const formattedData = response.data.map((user) => ({
          ...user,
          DATE_NAISSANCE: user.DATE_NAISSANCE ? new Date(user.DATE_NAISSANCE) : null,
          DATE_RECRUTEMENT: user.DATE_RECRUTEMENT ? new Date(user.DATE_RECRUTEMENT) : null,
        }));
        setUsers(formattedData);
      } catch (error) {
        console.error('Échec de la récupération des utilisateurs:', error);
      }
    };
  
    fetchData();
  }, []);

  // Function to handle importing users from Excel
  const handleImport = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });
  
      const formattedData = json.map((user) => ({
        ...user,
        DATE_NAISSANCE: user.DATE_NAISSANCE ? new Date(user.DATE_NAISSANCE) : null,
        DATE_RECRUTEMENT: user.DATE_RECRUTEMENT ? new Date(user.DATE_RECRUTEMENT) : null,
      }));
  
      try {
        // Send the formatted data to the backend to be saved in the database
        const response = await useApiAxios.post('users/import', formattedData);
        // Update the state with the new users
        const newUsers = formattedData.filter(user => !users.some(existingUser => existingUser.email === user.email));
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        alert(`Users imported: ${response.data.imported}, skipped: ${response.data.skipped}`);
        window.location.reload();
      } catch (error) {
        console.error('Échec de l\'importation des utilisateurs:', error.response?.data || error.message);
      }
    };
  
    reader.readAsBinaryString(file);
  };

  const columns = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'name', headerName: 'Nom', width: 150 },
    { field: 'roles', headerName: 'Rôles', width: 120 },
    { field: 'PPR', headerName: 'PPR', width: 100 },
    { field: 'CIN', headerName: 'CIN', width: 100 },
    { field: 'DATE_NAISSANCE', headerName: 'Date de Naissance', width: 120, type: 'date' },
    { field: 'SITUATION', headerName: 'Situation', width: 130 },
    { field: 'SEXE', headerName: 'Sexe', width: 100 },
    { field: 'SIT_F_AG', headerName: 'Situation Financière', width: 180 },
    { field: 'DATE_RECRUTEMENT', headerName: 'Date de Recrutement', width: 150, type: 'date' },
    { field: 'GRADE_fonction', headerName: 'Grade/Fonction', width: 150 },
    { field: 'AFFECTATION', headerName: 'Affectation', width: 150 },
    { field: 'DEPARTEMENT_DIVISION', headerName: 'Département/Division', width: 180 },
    { field: 'SERVICE', headerName: 'Service', width: 150 },
    { field: 'Localite', headerName: 'Localité', width: 150 },
    { field: 'FONCTION', headerName: 'Fonction', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Éditer">
            <IconButton component={Link} to={`/EditUser/${params.row._id}/`} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton onClick={() => handleDeleteUser(params.row._id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      width: 180,
    },
  ];

  const handleDeleteUser = async (id) => {
    try {
      await useApiAxios.delete(`users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Échec de la suppression de l\'utilisateur:', error);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
    const exportFileName = 'utilisateurs.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          p: 3,
          width: '100%',
          mb: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3, color: 'text.primary' }}>
          Gestion des Utilisateurs
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            startIcon={<AddIcon />}
            to="/CreateUser"
            sx={{ textTransform: 'none' }}
          >
            Créer un Nouvel Utilisateur
          </Button>
          <Button
            variant="contained"
            component="label"
            color="info"
            sx={{ textTransform: 'none' }}
          >
            Importer depuis Excel
            <input
              type="file"
              hidden
              onChange={handleImport}
              accept=".xlsx,.xls"
            />
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            startIcon={<ImportExportIcon />}
            sx={{ textTransform: 'none' }}
          >
            Exporter vers Excel
          </Button>
        </Box>
        <Paper sx={{ height: 400, width: '100%', p: 2, boxShadow: theme.shadows[3] }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row) => row._id} // This line tells DataGrid to use `_id` as the unique row identifier
            sx={{
              '& .MuiDataGrid-cell:hover': {
                color: theme.palette.primary.main,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export default GestionUtilisateurs;
