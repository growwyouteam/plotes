import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Paper } from '@mui/material'
import { Business, Home, Receipt, TrendingUp, People, Description } from '@mui/icons-material'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from '@/api/axios'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalColonies: 0,
    totalPlots: 0,
    activeBookings: 0,
    totalRevenue: 0,
    availablePlots: 0,
    soldPlots: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Simulated data - replace with actual API calls
      setStats({
        totalColonies: 1,
        totalPlots: 10,
        activeBookings: 3,
        totalRevenue: 15000000,
        availablePlots: 7,
        soldPlots: 3
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setLoading(false)
    }
  }

  const plotStatusData = [
    { name: 'Available', value: stats.availablePlots },
    { name: 'Booked', value: stats.activeBookings },
    { name: 'Sold', value: stats.soldPlots },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 2000000 },
    { month: 'Feb', revenue: 3500000 },
    { month: 'Mar', revenue: 4200000 },
    { month: 'Apr', revenue: 5500000 },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {stats.totalColonies}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Total Colonies
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {stats.totalPlots}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Total Plots
                  </Typography>
                </Box>
                <Home sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {stats.activeBookings}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Active Bookings
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    ₹{(stats.totalRevenue / 10000000).toFixed(1)}Cr
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Total Revenue
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Plot Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={plotStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {plotStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
