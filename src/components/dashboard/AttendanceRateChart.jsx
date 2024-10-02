import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const AttendanceRateChart = ({ data }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (selectedUser) {
            data.fetchAttendanceData(selectedUser).then(setChartData);
        } else {
            data.fetchAttendanceData().then(setChartData);
        }
    }, [selectedUser, data]);

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
                Taux de présence
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                <InputLabel id="user-select-label">Select User</InputLabel>
                <Select
                    labelId="user-select-label"
                    value={selectedUser}
                    onChange={handleUserChange}
                    label="Select User"
                >
                    <MenuItem value="">All Users</MenuItem>
                    {data.users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => name === "Attendance Rate (%)" ? `${value.toFixed(2)}%` : value} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="totalAssignedDays" fill="#8884d8" name="Total Assigned Days" />
                    <Bar dataKey="attendedDays" fill="#82ca9d" name="Attended Days" />
                    <Bar dataKey="attendanceRate" fill="#ffc658" name="Attendance Rate (%)" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AttendanceRateChart;