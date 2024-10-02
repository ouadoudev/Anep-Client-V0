import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
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

const EditUser = () => {
  const { id } = useParams(); // Using useParams to get the id from the URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await useApiAxios.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (id) {
      // Ensure id is not undefined
      fetchUserData();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? value === "on" : value,
    }));
  };

  const handleVacationChange = (index, field, value) => {
    setUser((prev) => {
      const updatedVacations = [...prev.vacations];
      updatedVacations[index][field] = value;
      return { ...prev, vacations: updatedVacations };
    });
  };

  const handleRemoveVacation = (index) => {
    setUser((prev) => {
      const updatedVacations = prev.vacations.filter((_, i) => i !== index);
      return { ...prev, vacations: updatedVacations };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await useApiAxios.put(`/users/${id}`, user);
      console.log("User updated:", response.data);
      navigate("/UsersManagement");
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <Paper
        elevation={3}
        style={{ padding: "24px", maxWidth: "1000px", margin: "auto" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Edit User
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
                name="PPR"
                type="number"
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
                label="Date of Position"
                type="date"
                name="DAT_POS"
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
                label="Effective Date of Grade"
                type="date"
                name="DAT_EFF_GR"
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
                label="Ancient Grade"
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
                label="Effective Date of Echelon"
                type="date"
                name="DAT_EFF_ECHLON"
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
                label="Ancient Echelon"
                name="ANC_ECHELON"
                type="date"
                value={user.ANC_ECHELON || ""}
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
                label="Vacation"
                name="vacation"
                value={user.vacation}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {user.vacations &&
              user.vacations.map((vacation, index) => (
                <Grid key={index} container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      name={`startDate-${index}`}
                      value={vacation.startDate || ""}
                      onChange={(event) =>
                        handleVacationChange(
                          index,
                          "startDate",
                          event.target.value
                        )
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="End Date"
                      type="date"
                      name={`endDate-${index}`}
                      value={vacation.endDate || ""}
                      onChange={(event) =>
                        handleVacationChange(
                          index,
                          "endDate",
                          event.target.value
                        )
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Reason"
                      name={`reason-${index}`}
                      value={vacation.reason || ""}
                      onChange={(event) =>
                        handleVacationChange(
                          index,
                          "reason",
                          event.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveVacation(index)}
                      fullWidth
                    >
                      Remove Vacation
                    </Button>
                  </Grid>
                </Grid>
              ))}
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </AdminLayout>
  );
};

EditUser.propTypes = {
  email: PropTypes.string,
  roles: PropTypes.array,
  name: PropTypes.string,
  PPR: PropTypes.number,
  CIN: PropTypes.string,
  DATE_NAISSANCE: PropTypes.string,
  SITUATION: PropTypes.string,
  SEXE: PropTypes.string,
  SIT_F_AG: PropTypes.string,
  DATE_RECRUTEMENT: PropTypes.string,
  ANC_ADM: PropTypes.string,
  COD_POS: PropTypes.string,
  DAT_POS: PropTypes.string,
  GRADE_fonction: PropTypes.string,
  GRADE_ASSIMILE: PropTypes.string,
  DAT_EFF_GR: PropTypes.string,
  ANC_GRADE: PropTypes.string,
  ECHEL: PropTypes.number,
  ECHELON: PropTypes.number,
  INDICE: PropTypes.number,
  DAT_EFF_ECHLON: PropTypes.string,
  ANC_ECHELON: PropTypes.string,
  vacation: PropTypes.string,
  vacations: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      reason: PropTypes.string,
    })
  ),
};

export default EditUser;
