import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const EnrollmentRateChart = ({ data }) => {
    if (!data || !data.total || !data.enrolled) {
        return <Typography variant="body1">No data available</Typography>;
    }

    const chartData = [
        { name: 'Enrolled', value: data.enrolled },
        { name: 'Not Enrolled', value: data.total - data.enrolled },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
                Taux d'inscription
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} (${((value / data.total) * 100).toFixed(2)}%)`} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default EnrollmentRateChart;