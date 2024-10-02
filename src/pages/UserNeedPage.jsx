import React, { useState, useContext } from "react";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import MainLayout from "../layout/MainLayout";
import { Container, TextField, Button, Typography, Alert, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: theme.spacing(4),
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  margin: '0 auto',
}));

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
  },
});

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d32f2f',
  color: '#fff',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#c62828',
  },
}));

const UserNeedsPage = () => {
  const [currentUser] = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState(currentUser?.name || currentUser?.username || "");
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await useApiAxios.post(
        "/user-needs",
        {
          emetteur: senderName || "Utilisateur",
          title,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);
      setSubmitStatus("success");
      setTitle("");
      setMessage("");
      setSenderName("");
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <MainLayout>
      {/* Banner section */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h3" gutterBottom>Exprimer Un Besoin</Typography>
        <Typography variant="body1" color="textSecondary">
          Accueil &gt; Exprimer Un Besoin
        </Typography>
      </Container>

      {/* User needs form section */}
      <Container maxWidth="sm">
        <FormContainer>
          {submitStatus === "success" && (
            <Alert severity="success" sx={{ mb: 2 }}>Votre besoin a été envoyé avec succès.</Alert>
          )}
          {submitStatus === "error" && (
            <Alert severity="error" sx={{ mb: 2 }}>Une erreur s'est produite lors de l'envoi du besoin.</Alert>
          )}
          <form onSubmit={handleFormSubmit} noValidate>
            <StyledTextField
              label="Votre nom"
              variant="outlined"
              fullWidth
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
              sx={{ display: 'none' }}
              disabled
            />
            <StyledTextField
              label="Titre de votre besoin"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <StyledTextField
              label="Décrivez votre besoin"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <SubmitButton type="submit" variant="contained">Envoyer</SubmitButton>
              <CancelButton type="button" variant="contained" onClick={() => { setTitle(""); setMessage(""); }}>
                Annuler
              </CancelButton>
            </Box>
          </form>
        </FormContainer>
      </Container>
    </MainLayout>
  );
};

export default UserNeedsPage;