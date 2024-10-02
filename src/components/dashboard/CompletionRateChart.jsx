import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const CompletionRateChart = ({ data, title }) => {
    const { completionRate, users, selectedUser, onUserChange } = data;

    if (!completionRate || completionRate.length === 0) {
        return <Typography variant="body1">No completion rate data available</Typography>;
    }

    const handleUserChange = (event) => {
        onUserChange(event.target.value);
    };

    const chartData = completionRate.map(item => ({
        ...item,
        completionRate: Number(item.completionRate.toFixed(2))
    }));

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
                Taux de complétion
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
                    {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="completionRate" fill="#8884d8" name="Taux de complétion" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CompletionRateChart;