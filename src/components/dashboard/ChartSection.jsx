import React from 'react';
import { Paper, Box, Typography, Grid } from '@mui/material';

const ChartSection = ({ title, Chart, data, details, fullWidth = false, ...props }) => {
    return (
        <Grid item xs={12} md={fullWidth ? 12 : 6}>
            <Paper>
                <Box padding={2}>
                    <Typography variant="h6" gutterBottom>{title}</Typography>
                    {details && details.map((detail, index) => (
                        <Typography key={index} variant="body2">{detail}</Typography>
                    ))}
                    <Chart data={data} {...props} />
                </Box>
            </Paper>
        </Grid>
    );
};

export default ChartSection;