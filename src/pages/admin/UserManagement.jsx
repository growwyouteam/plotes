import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, CircularProgress, MenuItem, Switch
} from '@mui/material'
import { Add, Edit, Delete, Block, CheckCircle } from '@mui/icons-material'
import axios from '@/api/axios'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterType, setFilterType] = useState('')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', roleId: '', cityId: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchRoles()
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      // ============ MOCK DATA START - REMOVE WHEN BACKEND READY ============
      const mockCities = [
        { _id: '1', name: 'Mumbai' },
        { _id: '2', name: 'Pune' },
        { _id: '3', name: 'Nashik' }
      ]
      setCities(mockCities)
      // ============ MOCK DATA END ============
      
      // ============ UNCOMMENT WHEN BACKEND READY ============
      // const { data } = await axios.get('/cities')
      // setCities(data.data.cities || [])
      // ============ BACKEND CODE END ============
    } catch (error) {
      console.error('Failed to fetch cities')
    }
  }

  const fetchUsers = async () => {
    try {
      // ============ MOCK DATA START - REMOVE WHEN BACKEND READY ============
      const mockUsers = [
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 9876543210',
          roleId: { _id: '2', name: 'Buyer' },
          cityId: { _id: '1', name: 'Mumbai' },
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543211',
          roleId: { _id: '2', name: 'Buyer' },
          cityId: { _id: '2', name: 'Pune' },
          isActive: true,
          createdAt: '2024-01-05'
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 9876543212',
          roleId: { _id: '2', name: 'Buyer' },
          cityId: { _id: '1', name: 'Mumbai' },
          isActive: false,
          createdAt: '2024-01-10'
        }
      ]
      setUsers(mockUsers)
      setLoading(false)
      // ============ MOCK DATA END ============
      
      // ============ UNCOMMENT WHEN BACKEND READY ============
      // const { data } = await axios.get('/users')
      // setUsers(data.data.users)
      // setLoading(false)
      // ============ BACKEND CODE END ============
    } catch (error) {
      toast.error('Failed to fetch users')
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      // ============ MOCK DATA START - REMOVE WHEN BACKEND READY ============
      const mockRoles = [
        { _id: '1', name: 'Super Admin' },
        { _id: '2', name: 'Buyer' },
        { _id: '3', name: 'Sales Executive' }
      ]
      setRoles(mockRoles)
      // ============ MOCK DATA END ============
      
      // ============ UNCOMMENT WHEN BACKEND READY ============
      // const { data } = await axios.get('/roles')
      // setRoles(data.data.roles)
      // ============ BACKEND CODE END ============
    } catch (error) {
      console.error('Failed to fetch roles')
    }
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditMode(true)
      setCurrentUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: '',
        roleId: user.roleId._id,
        cityId: user.cityId?._id || ''
      })
    } else {
      setEditMode(false)
      setCurrentUser(null)
      setFormData({ name: '', email: '', phone: '', password: '', roleId: '', cityId: '' })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`/users/${currentUser._id}`, formData)
        toast.success('User updated')
      } else {
        await axios.post('/users', formData)
        toast.success('User created')
      }
      setOpenDialog(false)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await axios.delete(`/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/users/${id}/toggle-status`)
      toast.success('User status updated')
      fetchUsers()
    } catch (error) {
      toast.error('Status update failed')
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">App Users</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add User</Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          size="small"
          placeholder="Search by name, phone, email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        
        <TextField
          select
          size="small"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">-- Filter by City --</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city._id} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          size="small"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">-- Filter by Type --</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role._id} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
        
        <Button variant="contained" onClick={() => fetchUsers()}>
          Filter
        </Button>
        
        <Button variant="outlined" onClick={() => {
          setSearchTerm('')
          setFilterCity('')
          setFilterType('')
          fetchUsers()
        }}>
          Reset
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>User Type</strong></TableCell>
              <TableCell align="right"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.filter(user => {
              const matchesSearch = !searchTerm || 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesCity = !filterCity || user.cityId?.name === filterCity
              const matchesType = !filterType || user.roleId?.name === filterType
              return matchesSearch && matchesCity && matchesType
            }).map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cityId?.name || '-'}</TableCell>
                <TableCell><Chip label={user.roleId?.name} size="small" /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(user)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleToggleStatus(user._id)}>
                    {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(user._id)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={editMode} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required disabled={editMode} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="City" value={formData.cityId} onChange={(e) => setFormData({ ...formData, cityId: e.target.value })} required>
                <MenuItem value="">-- Select City --</MenuItem>
                {cities.map((city) => (<MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="User Type" value={formData.roleId} onChange={(e) => setFormData({ ...formData, roleId: e.target.value })} required>
                <MenuItem value="">-- Select Type --</MenuItem>
                {roles.map((role) => (<MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
