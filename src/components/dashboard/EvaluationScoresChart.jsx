import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Grid } from '@mui/material';
const EvaluationScoresChart = ({ data, courses, fetchEvaluationScores, fetchCourseDetails }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [chartData, setChartData] = useState([]);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchEvaluationScores(selectedCourse);
            setChartData(response);

            if (selectedCourse) {
                const courseDetails = await fetchCourseDetails(selectedCourse);
                setCourseName(courseDetails.name);
            } else {
                setCourseName('');
            }
        };
        fetchData();
    }, [selectedCourse, fetchEvaluationScores, fetchCourseDetails]);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    if (!chartData || chartData.length === 0) {
        return <Typography variant="body1">No data available</Typography>;
    }

    return (
        <Grid item xs={12}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom align="center">
                    Scores d'évaluation
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel id="course-select-label">Select Course</InputLabel>
                    <Select
                        labelId="course-select-label"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        label="Select Course"
                    >
                        <MenuItem value="">All Courses</MenuItem>
                        {courses && courses.map((course) => (
                            <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {courseName && (
                    <Typography variant="subtitle1" gutterBottom align="center">
                        {courseName}
                    </Typography>
                )}
                <ResponsiveContainer width="100%" height={500}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" />
                        <PolarRadiusAxis angle={30} domain={[0, 7]} />
                        <Radar name="Score moyen" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>
        </Grid>
    );
};

export default EvaluationScoresChart;