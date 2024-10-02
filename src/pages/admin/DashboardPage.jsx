import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";
import EnrollmentRateChart from '../../components/dashboard/EnrollmentRateChart';
import BeneficiaryRateChart from '../../components/dashboard/BeneficiaryRateChart';
import AttendanceRateChart from '../../components/dashboard/AttendanceRateChart';
import CompletionRateChart from '../../components/dashboard/CompletionRateChart';
import EvaluationScoresChart from '../../components/dashboard/EvaluationScoresChart';
import ChartSection from '../../components/dashboard/ChartSection';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        enrollmentRate: {},
        beneficiaryRate: {},
        completionRate: [],
        evaluationScores: [],
        courses: []
    });
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    enrollmentResponse,
                    beneficiaryResponse,
                    completionResponse,
                    evaluationResponse,
                    usersResponse,
                    coursesResponse
                ] = await Promise.all([
                    useApiAxios.get('/statistics/enrollment-rate'),
                    useApiAxios.get('/statistics/beneficiary-rate'),
                    useApiAxios.get('/statistics/completion-rate'),
                    useApiAxios.get('/statistics/evaluation-scores'),
                    useApiAxios.get('/users'),
                    useApiAxios.get('/courses')
                ]);

                setDashboardData({
                    enrollmentRate: enrollmentResponse.data,
                    beneficiaryRate: beneficiaryResponse.data,
                    completionRate: completionResponse.data,
                    evaluationScores: evaluationResponse.data,
                    courses: coursesResponse.data
                });
                console.log('Completion Rate Data:', completionResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchAttendanceData = async (userId = '') => {
        try {
            const response = await useApiAxios.get(`/statistics/attendance/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            return [];
        }
    };

    const fetchEvaluationScores = async (courseId = '') => {
        try {
            const response = await useApiAxios.get(`/statistics/evaluation-scores${courseId ? `/${courseId}` : ''}`);
            console.log('Fetched Evaluation Scores from API:', response.data); // Debugging statement
            return response.data;
        } catch (error) {
            console.error('Error fetching evaluation scores:', error);
            return [];
        }
    };

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await useApiAxios.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching course details:', error);
            return {};
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Box padding={3}>
                <Typography variant="h4" gutterBottom>Tableau de Bord</Typography>
                <Grid container spacing={3}>
                    <ChartSection
                        title="Taux d'inscription dans la plateforme"
                        Chart={EnrollmentRateChart}
                        data={dashboardData.enrollmentRate}
                        details={[
                            `Total des utilisateurs: ${dashboardData.enrollmentRate.total}`,
                            `Utilisateurs inscrits: ${dashboardData.enrollmentRate.enrolled}`,
                            `Taux d'inscription: ${dashboardData.enrollmentRate.rate?.toFixed(2)}%`
                        ]}
                    />
                    <ChartSection
                        title="Taux de bénéficiant"
                        Chart={BeneficiaryRateChart}
                        data={dashboardData.beneficiaryRate}
                        details={[
                            `Total des utilisateurs: ${dashboardData.beneficiaryRate.total}`,
                            `Bénéficiaires: ${dashboardData.beneficiaryRate.beneficiaries}`,
                            `Taux de bénéficiaires: ${dashboardData.beneficiaryRate.rate?.toFixed(2)}%`
                        ]}
                    />
                    <ChartSection
                        title="Taux de présences"
                        Chart={AttendanceRateChart}
                        data={{ users, fetchAttendanceData }}
                    />
                    <ChartSection
                        title="Taux de complétion"
                        Chart={CompletionRateChart}
                        data={{
                            completionRate: dashboardData.completionRate || [],
                            users,
                            selectedUser,
                            onUserChange: setSelectedUser
                        }}
                    />

                    <ChartSection
                        title="Moyenne de Scores des évaluations"
                        Chart={EvaluationScoresChart}
                        data={dashboardData.evaluationScores}
                        courses={dashboardData.courses}
                        fetchEvaluationScores={fetchEvaluationScores}
                        fetchCourseDetails={fetchCourseDetails}
                        fullWidth={true}
                    />
                </Grid>
            </Box>
        </AdminLayout>
    );
};

export default DashboardPage;