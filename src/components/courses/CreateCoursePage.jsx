import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/admin/AdminLayout";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Grid,
  Typography,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon

import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useApiAxios from "../../config/axios";

function CreateCoursePage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    location: "",
    category: null, // Change to object containing id and name
    offline: "",
    description: "",
    hidden: "",
    budget: "",
    times: [
      {
        startTime: "",
        endTime: "",
        instructor: "",
        instructorName: "",
        instructorType: "intern",
        externalInstructorDetails: {
          phone: "",
          position: "",
          cv: null,
        },
      },
    ],
    image: null,
  });

  const [categories, setCategories] = useState([]); // State to hold categories from the database
  const [internalInstructors, setInternalInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const internalResponse = await useApiAxios.get("/users");
        setInternalInstructors(
          internalResponse.data.map((instructor) => ({
            label: instructor.name,
            id: instructor._id,
          }))
        );
      } catch (error) {
        console.error("Échec de la récupération des instructeurs:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await useApiAxios.get("/category");
        setCategories(
          data.map((category) => ({
            id: category._id,
            name: category.name,
          }))
        ); // Now we're storing both id and name
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchInstructors();
    fetchCategories();
  }, []);

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  const handleCategoryChange = async (event, newValue) => {
    let categoryValue;

    if (typeof newValue === "string") {
      categoryValue = { name: newValue };
    } else if (newValue && newValue.inputValue) {
      categoryValue = { name: newValue.inputValue };
    } else {
      categoryValue = newValue;
    }

    if (categoryValue && categoryValue.name) {
      // Check if the category exists
      const existingCategory = categories.find(
        (cat) => cat.name === categoryValue.name
      );
      if (existingCategory) {
        setCourse({ ...course, category: existingCategory });
      } else {
        // If it's a new category, add it to the database
        try {
          const response = await useApiAxios.post("/category", {
            name: categoryValue.name,
          });
          const newCategory = {
            id: response.data._id,
            name: categoryValue.name,
          };
          setCategories([...categories, newCategory]);
          setCourse({ ...course, category: newCategory });
          console.log("New category added:", newCategory);
        } catch (error) {
          console.error("Failed to add new category:", error);
        }
      }
    } else {
      setCourse({ ...course, category: null });
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setCourse((prev) => ({
        ...prev,
        image: Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSessionChange = (event, index, newValue = null) => {
    const { name, value, files } = event.target;
    const updatedTimes = [...course.times];
    if (name === "instructor") {
      updatedTimes[index][name] = newValue ? newValue.id : undefined;
      updatedTimes[index].instructorName = newValue ? newValue.label : "";
    } else if (name === "cv") {
      updatedTimes[index].externalInstructorDetails[name] = files[0]
        ? files[0].name
        : undefined; // Store file name instead of file object
    } else if (name in updatedTimes[index].externalInstructorDetails) {
      updatedTimes[index].externalInstructorDetails[name] = value;
    } else {
      updatedTimes[index][name] = value;
    }
    setCourse((prev) => ({
      ...prev,
      times: updatedTimes,
    }));
  };

  // Function to delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await useApiAxios.delete(`/category/${categoryId}`);
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
      if (course.category && course.category.id === categoryId) {
        setCourse({ ...course, category: null });
      }
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleAddSession = () => {
    setCourse((prev) => ({
      ...prev,
      times: [
        ...prev.times,
        {
          startTime: "",
          endTime: "",
          instructor: "",
          instructorName: "",
          externalInstructorDetails: {
            phone: "",
            position: "",
            cv: null,
          },
        },
      ],
    }));
  };

  const handleDuplicateSession = (index) => {
    const lastSession = course.times[index];
    setCourse((prev) => ({
      ...prev,
      times: [...prev.times, { ...lastSession }],
    }));
  };

  const handleRemoveSession = (index) => {
    setCourse((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!course.image) {
      alert("Veuillez télécharger une image.");
      return;
    }

    if (
      !course.title ||
      !course.offline ||
      !course.hidden ||
      course.budget === "" ||
      !course.location || // Add location validation
      !course.times.length
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    for (const time of course.times) {
      if (!time.startTime || !time.endTime || !time.instructorName) {
        alert(
          "Veuillez remplir tous les créneaux horaires avec l'heure de début, l'heure de fin et le nom de l'instructeur."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", course.image);

    // Append CV files to formData
    course.times.forEach((session, index) => {
      if (
        session.externalInstructorDetails &&
        session.externalInstructorDetails.cv
      ) {
        formData.append(`cv_${index}`, session.externalInstructorDetails.cv);
      }
    });

    try {
      const imageUploadResponse = await useApiAxios.post(
        "/courses/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (imageUploadResponse.status === 200) {
        const imageUrl = imageUploadResponse.data.imageUrl;

        // Prepare the course data, removing any empty instructor fields
        const finalCourseData = {
          ...course,
          imageUrl,
          category: course.category ? course.category.id : null, // Use category ID
          times: course.times.map((session) => ({
            ...session,
            instructor: session.instructor || undefined,
            externalInstructorDetails: {
              ...session.externalInstructorDetails,
              cv: session.externalInstructorDetails.cv
                ? session.externalInstructorDetails.cv.name
                : undefined,
            },
          })),
        };

        const response = await useApiAxios.post("/courses", finalCourseData);

        if (response.status === 201) {
          console.log("Cours créé avec succès!");
          navigate("/CoursesManagement");
        } else {
          alert(
            `Échec de la création du cours: ${response.status} ${response.data}`
          );
        }
      } else {
        alert(
          `Échec du téléchargement de l'image: ${imageUploadResponse.status} ${imageUploadResponse.data}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      alert("Erreur lors de la création du cours: " + error.message);
    }
  };

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "24px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <TextField
          label="Titre"
          name="title"
          value={course.title}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          required
        />
        <TextField
          label="Lieu"
          name="location"
          value={course.location}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          required
        />
        <Autocomplete
          value={course.category || null}
          onChange={handleCategoryChange}
          filterOptions={(options, params) => {
            const filtered = filterOptions(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) => inputValue === option.name
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                name: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={categories}
          getOptionLabel={(option) => option.name || ""}
          renderOption={(props, option) => (
            <li {...props}>
              {option.name}
              {option.id && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(option.id);
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </li>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              variant="outlined"
              fullWidth
              required
            />
          )}
        />
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <input {...getInputProps()} />
          <Paper elevation={0} style={{ padding: "16px" }}>
            {isDragActive ? (
              <p>Déposez l&apos;image ici...</p>
            ) : (
              <p>
                Glissez-déposez une image ici, ou cliquez pour sélectionner une
                image
              </p>
            )}
          </Paper>
          {course.image && (
            <img
              src={course.image.preview}
              alt="Aperçu"
              style={{ marginTop: "16px", maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>En ligne/Présentiel</InputLabel>
          <Select
            name="offline"
            value={course.offline}
            label="En ligne/Présentiel/Hybrid"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="online">En ligne</MenuItem>
            <MenuItem value="offline">Présentiel</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <ReactQuill
            theme="snow"
            value={course.description || ""}
            onChange={(content) => {
              setCourse((prev) => ({
                ...prev,
                description: content,
              }));
            }}
            required
          />
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Visibilité</InputLabel>
          <Select
            name="hidden"
            value={course.hidden}
            label="Visibilité"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="hidden">Caché</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget"
          name="budget"
          type="number"
          value={course.budget}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          required
        />
        <Typography variant="h6" gutterBottom>
          Planification
        </Typography>
        {course.times.map((session, index) => (
          <Paper
            key={index}
            elevation={1}
            style={{
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Heure de début"
                  name="startTime"
                  type="datetime-local"
                  value={session.startTime}
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Heure de fin"
                  name="endTime"
                  type="datetime-local"
                  value={session.endTime}
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type d&apos;instructeur</InputLabel>
                  <Select
                    name="instructorType"
                    value={session.instructorType}
                    onChange={(e) => handleSessionChange(e, index)}
                    required
                  >
                    <MenuItem value="intern">Interne</MenuItem>
                    <MenuItem value="extern">Externe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {session.instructorType === "intern" ? (
                  <Autocomplete
                    options={internalInstructors}
                    getOptionLabel={(option) => option.label}
                    value={
                      internalInstructors.find(
                        (instructor) => instructor.id === session.instructor
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleSessionChange(
                        {
                          target: {
                            name: "instructor",
                          },
                        },
                        index,
                        newValue
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Nom de l'instructeur" />
                    )}
                    fullWidth
                    required
                  />
                ) : (
                  <>
                    <TextField
                      label="Nom de l'instructeur"
                      name="instructorName"
                      value={session.instructorName}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Téléphone"
                      name="phone"
                      value={session.externalInstructorDetails.phone}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                    <TextField
                      label="Poste"
                      name="position"
                      value={session.externalInstructorDetails.position}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                    <TextField
                      type="file"
                      name="cv"
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                  </>
                )}
              </Grid>
            </Grid>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Tooltip title="Supprimer la session">
                <IconButton onClick={() => handleRemoveSession(index)}>
                  <RemoveCircleOutlineIcon color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dupliquer la session">
                <IconButton onClick={() => handleDuplicateSession(index)}>
                  <FileCopyIcon color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
        ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddSession}
          startIcon={<AddCircleOutlineIcon />}
          fullWidth
          style={{ marginBottom: "16px" }}
        >
          Ajouter une session
        </Button>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Créer le cours
        </Button>
      </form>
    </AdminLayout>
  );
}

export default CreateCoursePage;
