import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  List,
  ListItem,
  Box,
  ListItemText,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import useApiAxios from "../../config/axios";
import debounce from "lodash/debounce";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    location: "",
    imageUrl: "",
    offline: "",
    description: "",
    hidden: "",
    budget: "",
    notification: [],
    times: [
      {
        startTime: "",
        endTime: "",
        instructorType: "",
        instructor: "",
        instructorName: "",
        externalInstructorDetails: {
          phone: "",
          position: "",
          cv: null,
        },
      },
    ],
    image: null,
    assignedUsers: [], // Ensure assignedUsers is initialized
    interestedUsers: [], // Ensure interestedUsers is initialized
  });

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState(
    course.assignedUsers || []
  );
  const [interestedUsers, setInterestedUsers] = useState(
    course.interestedUsers || []
  );

  const [internalInstructors, setInternalInstructors] = useState([]);
  const [filter, setFilter] = useState({
    fonction: null,
    localite: null,
    service: null,
    departementDivision: null,
    affectation: null,
    gradeAssimile: null,
    gradeFonction: null,
  });
  const [allCourses, setAllCourses] = useState([]);
  const baseUrl = "https://anep-server.onrender.com";
  useEffect(() => {
    const fetchUsersAndCourse = async () => {
      try {
        const usersResponse = await useApiAxios.get("/users");
        const courseResponse = await useApiAxios.get(`/courses/${id}`);
        const allCoursesResponse = await useApiAxios.get("/courses");

        setUsers(usersResponse.data);
        setInternalInstructors(usersResponse.data);
        setAllCourses(allCoursesResponse.data); // Store all courses

        const courseData = courseResponse.data;
        setCourse({
          ...courseData,
          times: courseData.times || [],
          image: courseData.image ? { preview: courseData.imageUrl } : null, // Set preview from imageUrl
          assignedUsers: courseData.assignedUsers || [], // Ensure assignedUsers is initialized
          interestedUsers: courseData.interestedUsers || [], // Ensure interestedUsers is initialized
        });

        if (courseData.assignedUsers) {
          const assignedUsersDetails = await Promise.all(
            courseData.assignedUsers.map((userId) =>
              useApiAxios.get(`/users/${userId}`)
            )
          );
          setAssignedUsers(assignedUsersDetails.map((res) => res.data));
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchUsersAndCourse();
  }, [id]);

  useEffect(() => {
    // Example of setting interested users when component mounts or when `course` changes
    if (course.interestedUsers) {
      setInterestedUsers(course.interestedUsers);
    }
  }, [course]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setCourse((prev) => ({
        ...prev,
        image: Object.assign(file, { preview: URL.createObjectURL(file) }),
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (event, index) => {
    const { name, value, files } = event.target;
    const updatedTimes = [...course.times];
    if (name === "instructorType") {
      updatedTimes[index] = {
        ...updatedTimes[index],
        instructorType: value,
        instructor: "",
        instructorName: "",
        externalInstructorDetails: {
          phone: "",
          position: "",
          cv: null,
        },
      };
    } else if (name === "instructor") {
      updatedTimes[index][name] = value;
    } else if (name === "cv") {
      updatedTimes[index].externalInstructorDetails[name] = files[0]
        ? files[0].name
        : undefined; // Store file name instead of file object
    } else if (name in updatedTimes[index].externalInstructorDetails) {
      updatedTimes[index].externalInstructorDetails[name] = value;
    } else {
      updatedTimes[index][name] = value;
    }
    setCourse((prev) => ({ ...prev, times: updatedTimes }));
  };

  const handleInstructorChange = (event, newValue, index) => {
    const updatedTimes = [...course.times];
    updatedTimes[index].instructor = newValue ? newValue._id : "";
    updatedTimes[index].instructorName = newValue ? newValue.name : "";
    setCourse((prev) => ({ ...prev, times: updatedTimes }));
  };

  const handleAddSession = () => {
    setCourse((prev) => ({
      ...prev,
      times: [
        ...prev.times,
        {
          startTime: "",
          endTime: "",
          instructorType: "",
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

  const handleDuplicateSession = () => {
    const lastSession = course.times[course.times.length - 1];
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

    const courseData = {
      ...course,
      assignedUsers: assignedUsers.map((user) => user._id),
    };

    try {
      if (course.image) {
        const formData = new FormData();
        formData.append("image", course.image);

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
          courseData.imageUrl = imageUploadResponse.data.imageUrl;
        } else {
          alert(
            `Image upload failed: ${imageUploadResponse.status} ${imageUploadResponse.data}`
          );
          return;
        }
      }

      for (const user of assignedUsers) {
        const conflictCourse = checkConflicts(
          user._id,
          course.times[0].startTime,
          course.times[0].endTime
        );
        if (conflictCourse) {
          await useApiAxios.put(`/courses/${conflictCourse._id}`, {
            ...conflictCourse,
            assignedUsers: conflictCourse.assignedUsers.filter(
              (u) => u._id !== user._id
            ),
          });
        }
      }

      await useApiAxios.put(`/courses/${id}`, courseData);
      console.log("Course updated successfully");
      navigate("/CoursesManagement");
    } catch (error) {
      console.error("Failed to update course", error);
    }
  };

  const handleFilterChange = debounce((event, newValue, field) => {
    setFilter((prev) => ({ ...prev, [field]: newValue }));
  }, 300);

  const uniqueOptions = (field) => {
    const unique = new Set(users.map((user) => user[field]));
    return Array.from(unique).map((value) => ({ label: value }));
  };

  const filteredUsers = users.filter(
    (user) =>
      (!filter.fonction || user.FONCTION === filter.fonction?.label) &&
      (!filter.localite || user.Localite === filter.localite?.label) &&
      (!filter.service || user.SERVICE === filter.service?.label) &&
      (!filter.departementDivision ||
        user.DEPARTEMENT_DIVISION === filter.departementDivision?.label) &&
      (!filter.affectation || user.AFFECTATION === filter.affectation?.label) &&
      (!filter.gradeAssimile ||
        user.GRADE_ASSIMILE === filter.gradeAssimile?.label) &&
      (!filter.gradeFonction ||
        user.GRADE_fonction === filter.gradeFonction?.label) &&
      !assignedUsers.some((assignedUser) => assignedUser._id === user._id)
  );

  // Function to check for conflicts

  const checkConflicts = (userId, startTime, endTime) => {
    const user = users.find((user) => user._id === userId);
    if (!user) return null;

    // Check for course conflicts
    for (const course of allCourses) {
      if (course._id !== id && course.assignedUsers.includes(userId)) {
        for (const time of course.times) {
          if (
            (new Date(startTime) >= new Date(time.startTime) &&
              new Date(startTime) <= new Date(time.endTime)) ||
            (new Date(endTime) >= new Date(time.startTime) &&
              new Date(endTime) <= new Date(time.endTime))
          ) {
            return { type: "course", course };
          }
        }
      }
    }

    // Check for vacation conflicts
    for (const vacation of user.vacations) {
      if (
        (new Date(startTime) >= new Date(vacation.start) &&
          new Date(startTime) <= new Date(vacation.end)) ||
        (new Date(endTime) >= new Date(vacation.start) &&
          new Date(endTime) <= new Date(vacation.end))
      ) {
        return { type: "vacation", vacation };
      }
    }

    return null;
  };

  const handleAssignUser = (userId) => {
    const userToAssign = interestedUsers.find(
      (user) => user && user._id === userId
    );
    if (userToAssign) {
      setAssignedUsers((prev) => {
        const updatedUsers = [...prev, userToAssign].filter((user) => user); // Ensure no undefined or null users are added
        return updatedUsers;
      });
    }
  };

  // Filter interested users to exclude those who are already assigned
  const filteredInterestedUsers = course.interestedUsers.filter(
    (interestedUser) =>
      !assignedUsers.some(
        (assignedUser) => assignedUser._id === interestedUser._id
      )
  );

  // Function to merge users and remove duplicates, ensuring all inputs are arrays
  const mergeUsers = () => {
    const courseUsers = Array.isArray(course.assignedUsers)
      ? course.assignedUsers
      : [];
    const allUsers = [...assignedUsers, ...courseUsers];
    const uniqueUsers = Array.from(
      new Map(allUsers.map((user) => [user._id, user])).values()
    );
    return uniqueUsers;
  };

  // Use effect to update local state when course.assignedUsers changes
  useEffect(() => {
    setAssignedUsers(mergeUsers());
  }, [course.assignedUsers]);

  const handleUserChange = (event, newValue) => {
    const validUsers = newValue.filter((user) => user);
    setAssignedUsers(validUsers);
    // Optionally update course.assignedUsers here or elsewhere depending on your application logic
    setCourse((prev) => ({ ...prev, assignedUsers: newValue }));
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
          label="Title"
          name="title"
          value={course.title}
          onChange={(e) =>
            setCourse((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          required
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Lieu"
          name="location"
          value={course.location}
          onChange={(e) =>
            setCourse((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
          fullWidth
          style={{ marginBottom: "16px" }}
          required
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
              <p>Drop the image here...</p>
            ) : (
              <p>
                Drag &apos;n&apos; drop an image here, or click to select an
                image
              </p>
            )}
          </Paper>
          {course.image ? (
            <img
              src={course.image.preview}
              alt="Preview"
              style={{ marginTop: "16px", maxWidth: "100%", height: "auto" }}
            />
          ) : (
            <img
              src={`${baseUrl}${course.imageUrl}`}
              alt="Course"
              style={{ marginTop: "16px", maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>En ligne/Présentiel</InputLabel>
          <Select
            name="offline"
            value={course.offline}
            label="Offline/Online"
            onChange={(e) =>
              setCourse((prev) => ({
                ...prev,
                offline: e.target.value,
              }))
            }
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
          />
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Visibilité</InputLabel>
          <Select
            name="hidden"
            value={course.hidden}
            label="Visibility"
            onChange={(e) =>
              setCourse((prev) => ({
                ...prev,
                hidden: e.target.value,
              }))
            }
            required
          >
            <MenuItem value="visible">Caché</MenuItem>
            <MenuItem value="hidden">Visible</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget"
          name="budget"
          value={course.budget}
          onChange={(e) =>
            setCourse((prev) => ({
              ...prev,
              budget: e.target.value,
            }))
          }
          required
          fullWidth
          type="number"
          style={{ marginBottom: "16px" }}
        />
        <div style={{ marginBottom: "16px" }}>
          <Typography variant="h6">Planification</Typography>
          {course.times?.map((session, index) => (
            <Paper
              key={index}
              elevation={1}
              style={{ padding: "16px", marginBottom: "16px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    value={session.startTime}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    value={session.endTime}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Instructor Type</InputLabel>
                    <Select
                      name="instructorType"
                      value={session.instructorType}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
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
                      getOptionLabel={(option) => option.name}
                      value={
                        internalInstructors.find(
                          (instructor) => instructor._id === session.instructor
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleInstructorChange(event, newValue, index)
                      }
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Instructor Name"
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <>
                      <TextField
                        label="Instructor Name"
                        name="instructorName"
                        value={session.instructorName}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                        required
                      />
                      <TextField
                        label="Phone"
                        name="phone"
                        value={session.externalInstructorDetails.phone}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                        style={{ marginTop: "16px" }}
                        required
                      />
                      <TextField
                        label="Position"
                        name="position"
                        value={session.externalInstructorDetails.position}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                        style={{ marginTop: "16px" }}
                        required
                      />
                      <TextField
                        type="file"
                        name="cv"
                        onChange={(e) => handleChange(e, index)}
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
                <Tooltip title="Remove Session">
                  <IconButton onClick={() => handleRemoveSession(index)}>
                    <RemoveCircleOutlineIcon color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate Session">
                  <IconButton onClick={handleDuplicateSession}>
                    <FileCopyIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddSession}
          >
            Ajouter une session
          </Button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Typography variant="h6">Assigner des Utilisateurs</Typography>
          <Grid container spacing={2} style={{ marginBottom: "16px" }}>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("FONCTION")}
                value={filter.fonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "fonction")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Fonction" fullWidth />
                )}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) =>
                  option.label === value?.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("Localite")}
                value={filter.localite}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "localite")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Localité" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("SERVICE")}
                value={filter.service}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "service")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Service" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("DEPARTEMENT_DIVISION")}
                value={filter.departementDivision}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "departementDivision")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Département/Division"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("AFFECTATION")}
                value={filter.affectation}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "affectation")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Affectation" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("GRADE_ASSIMILE")}
                value={filter.gradeAssimile}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeAssimile")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Grade Assimilé" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("GRADE_fonction")}
                value={filter.gradeFonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeFonction")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Grade Fonction" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option?.label === value?.label
                }
                getOptionLabel={(option) => option.label || ""}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Autocomplete
              multiple
              options={filteredUsers}
              getOptionLabel={(user) => user.name}
              value={assignedUsers.filter((user) => user)}
              onChange={handleUserChange}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => {
                const conflict = checkConflicts(
                  option._id,
                  course.times[0].startTime,
                  course.times[0].endTime
                );
                const conflictStyle = conflict
                  ? conflict.type === "course"
                    ? { color: "red" }
                    : { color: "yellow" }
                  : {};

                return (
                  <li {...props} style={conflictStyle}>
                    {option.name}
                    {conflict && conflict.type === "course" && (
                      <span style={{ marginLeft: "10px", color: "red" }}>
                        (Conflit avec : {conflict.course.title})
                      </span>
                    )}
                    {conflict && conflict.type === "vacation" && (
                      <span style={{ marginLeft: "10px", color: "yellow" }}>
                        (En vacances)
                      </span>
                    )}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigner des Utilisateurs"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </FormControl>
          <Typography variant="h6">Utilisateurs Intéressés</Typography>
          <List>
            {filteredInterestedUsers.map((user) => (
              <ListItem key={user._id}>
                <Box display="flex" alignItems="center" width="30%">
                  <ListItemText primary={user.name} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAssignUser(user._id)}
                    style={{ marginLeft: "auto" }}
                  >
                    Assign
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "16px" }}
        >
          Sauvegarder le cours
        </Button>
      </form>
    </AdminLayout>
  );
}

export default EditCoursePage;
