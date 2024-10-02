import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/admin/AdminLayout";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import useApiAxios from "../../config/axios";

const rolesOptions = ["user", "admin"];

const CreateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    roles: ["user"],
    name: "",
    PPR: "",
    CIN: "",
    DATE_NAISSANCE: null,
    SITUATION: "",
    SEXE: "",
    SIT_F_AG: "",
    DATE_RECRUTEMENT: null,
    ANC_ADM: null,
    COD_POS: "",
    DAT_POS: null,
    GRADE_fonction: "",
    GRADE_ASSIMILE: "",
    DAT_EFF_GR: null,
    ANC_GRADE: null,
    ECHEL: "",
    ECHELON: "",
    INDICE: "",
    DAT_EFF_ECHLON: null,
    ANC_ECHLON: null,
    AFFECTATION: "",
    DEPARTEMENT_DIVISION: "",
    SERVICE: "",
    Localite: "",
    FONCTION: "",
    LIBELLE_SST: "",
    DAT_S_ST: null,
    phoneNumber: "",
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? value === "on" : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await useApiAxios.post("/users", user);
      console.log("User created:", response.data);
      navigate("/UsersManagement");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <AdminLayout>
      <Paper
        elevation={3}
        style={{ padding: "24px", maxWidth: "10000px", margin: "auto" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create User
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
        
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Roles</InputLabel>
                <Select
                  name="roles"
                  multiple
                  value={user.roles || []}
                  onChange={handleChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {rolesOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PPR"
                type="number"
                name="PPR"
                value={user.PPR}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CIN"
                name="CIN"
                value={user.CIN}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Birth"
                type="date"
                name="DATE_NAISSANCE"
                value={user.DATE_NAISSANCE || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Situation"
                name="SITUATION"
                value={user.SITUATION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sex"
                name="SEXE"
                value={user.SEXE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SIT_F_AG"
                name="SIT_F_AG"
                value={user.SIT_F_AG}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Recruitment"
                type="date"
                name="DATE_RECRUTEMENT"
                value={user.DATE_RECRUTEMENT || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ANC_ADM"
                name="ANC_ADM"
                type="date"
                value={user.ANC_ADM || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Code"
                name="COD_POS"
                value={user.COD_POS}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="DAT_POS"
                name="DAT_POS"
                type="date"
                value={user.DAT_POS || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Function Grade"
                name="GRADE_fonction"
                value={user.GRADE_fonction}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Assimilated Grade"
                name="GRADE_ASSIMILE"
                value={user.GRADE_ASSIMILE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="DAT_EFF_GR"
                name="DAT_EFF_GR"
                type="date"
                value={user.DAT_EFF_GR || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ANC_GRADE"
                name="ANC_GRADE"
                type="date"
                value={user.ANC_GRADE || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Scale"
                name="ECHEL"
                type="number"
                value={user.ECHEL}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Echelon"
                name="ECHELON"
                type="number"
                value={user.ECHELON}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Index"
                name="INDICE"
                type="number"
                value={user.INDICE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="DAT_EFF_ECHLON"
                name="DAT_EFF_ECHLON"
                type="date"
                value={user.DAT_EFF_ECHLON || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ANC_ECHLON"
                name="ANC_ECHLON"
                type="date"
                value={user.ANC_ECHLON || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Assignment"
                name="AFFECTATION"
                value={user.AFFECTATION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Department/Division"
                name="DEPARTEMENT_DIVISION"
                value={user.DEPARTEMENT_DIVISION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Service"
                name="SERVICE"
                value={user.SERVICE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Locality"
                name="Localite"
                value={user.Localite}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Function"
                name="FONCTION"
                value={user.FONCTION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SST Label"
                name="LIBELLE_SST"
                value={user.LIBELLE_SST}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="DAT_S_ST"
                name="DAT_S_ST"
                type="date"
                value={user.DAT_S_ST || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
              >
                Ajouter Utilisateur
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </AdminLayout>
  );
};

CreateUser.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CreateUser;
