import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  CircularProgress,
  MenuItem
} from '@mui/material'
import axios from '@/api/axios'
import toast from 'react-hot-toast'

const PlotManagement = () => {
  const [plots, setPlots] = useState([])
  const [colonies, setColonies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterColony, setFilterColony] = useState('')

  useEffect(() => {
    fetchColonies()
    fetchPlots()
  }, [])

  const fetchColonies = async () => {
    try {
      const { data } = await axios.get('/colonies')
      setColonies(data.data.colonies || [])
    } catch (error) {
      console.error('Failed to fetch colonies:', error)
      toast.error('Failed to fetch colonies')
    }
  }

  const fetchPlots = async (colonyId = '') => {
    try {
      setLoading(true)
      const url = colonyId ? `/plots?colonyId=${colonyId}` : '/plots'
      const { data } = await axios.get(url)
      setPlots(data.data.plots || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch plots:', error)
      toast.error('Failed to fetch plots')
      setLoading(false)
    }
  }

  const handleFilterChange = (colonyId) => {
    setFilterColony(colonyId)
    fetchPlots(colonyId)
  }

  const getStatusColor = (status) => {
    const colors = {
      available: 'success',
      booked: 'warning',
      sold: 'error',
      blocked: 'default',
      reserved: 'info'
    }
    return colors[status] || 'default'
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Plot Management
        </Typography>
        <TextField
          select
          size="small"
          label="Filter by Colony"
          value={filterColony}
          onChange={(e) => handleFilterChange(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Colonies</MenuItem>
          {colonies.map((colony) => (
            <MenuItem key={colony._id} value={colony._id}>
              {colony.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Plot No</strong></TableCell>
              <TableCell><strong>Colony</strong></TableCell>
              <TableCell><strong>Area (Gaj)</strong></TableCell>
              <TableCell><strong>Price/Gaj</strong></TableCell>
              <TableCell><strong>Total Price</strong></TableCell>
              <TableCell><strong>Facing</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No plots found for the selected colony.
                </TableCell>
              </TableRow>
            ) : (
              plots.map((plot) => (
                <TableRow key={plot._id}>
                  <TableCell>{plot.plotNo}</TableCell>
                  <TableCell>{plot.colonyId?.name}</TableCell>
                  <TableCell>{plot.areaGaj}</TableCell>
                  <TableCell>₹{plot.pricePerGaj?.toLocaleString()}</TableCell>
                  <TableCell>₹{plot.totalPrice?.toLocaleString()}</TableCell>
                  <TableCell>{plot.facing}</TableCell>
                  <TableCell>
                    <Chip
                      label={plot.status.toUpperCase()}
                      color={getStatusColor(plot.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PlotManagement
