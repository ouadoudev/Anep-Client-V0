import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const BeneficiaryRateChart = ({ data }) => {
    if (!data || !data.total || !data.beneficiaries) {
        return <Typography variant="body1">No data available</Typography>;
    }

    const beneficiaryRate = (data.beneficiaries / data.total) * 100;
    const chartData = [
        { name: 'Bénéficiaires', value: beneficiaryRate },
        { name: 'Non-Bénéficiaires', value: 100 - beneficiaryRate },
    ];

    const COLORS = ['#00C49F', '#FFBB28'];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
                Taux de bénéficiaires
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
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default BeneficiaryRateChart;