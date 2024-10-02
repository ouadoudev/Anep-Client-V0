import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
}));

const CustomListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: '4px',
  backgroundColor: '#fff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
}));

function AdminUserNeeds() {
  const [userNeeds, setUserNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchUserNeeds() {
      try {
        const response = await useApiAxios.get('/user-needs');
        setUserNeeds(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des besoins des utilisateurs:', error);
        setError('Erreur lors de la récupération des besoins des utilisateurs.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserNeeds();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDialog = (need) => {
    setSelectedNeed(need);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNeed(null);
  };

  const handleDelete = async () => {
    try {
      await useApiAxios.delete(`/user-needs/${selectedNeed._id}`);
      setUserNeeds((prevNeeds) => prevNeeds.filter((need) => need._id !== selectedNeed._id));
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la suppression du besoin utilisateur:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <RootContainer>
          <Typography variant="h6" gutterBottom>
            Chargement des besoins en cours...
          </Typography>
          <CircularProgress />
        </RootContainer>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <RootContainer>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </RootContainer>
      </AdminLayout>
    );
  }

  const totalPages = Math.ceil(userNeeds.length / itemsPerPage);
  const paginatedNeeds = userNeeds.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <AdminLayout>
      <RootContainer>
        <Typography variant="h4" gutterBottom>
          Besoins des Utilisateurs
        </Typography>
        {paginatedNeeds.length > 0 ? (
          <List>
            {paginatedNeeds.map((need) => (
              <CustomListItem button key={need._id} onClick={() => handleOpenDialog(need)}>
                <ListItemText
                  primary={need.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Émetteur: {need.senderName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(need.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {need.message.substring(0, 100)}...
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: 'textSecondary' }}
                />
              </CustomListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Aucun besoin utilisateur trouvé.</Typography>
        )}
        {userNeeds.length > itemsPerPage && (
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedNeed?.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1" gutterBottom>
                Émetteur: {selectedNeed?.senderName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date: {new Date(selectedNeed?.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Message: {selectedNeed?.message}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
            <CustomButton onClick={handleDelete}>
              Supprimer
            </CustomButton>
          </DialogActions>
        </Dialog>
      </RootContainer>
    </AdminLayout>
  );
}

export default AdminUserNeeds;