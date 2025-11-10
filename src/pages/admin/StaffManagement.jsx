import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  MenuItem,
  Checkbox,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { Add, Edit, Delete, CloudUpload, GetApp, Print, Search, FileDownload } from '@mui/icons-material'
import apiService from '@/services/apiService'
import errorService from '@/services/errorService'
import toast from 'react-hot-toast'

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentStaff, setCurrentStaff] = useState(null)
  const [showEntries, setShowEntries] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [exportAnchor, setExportAnchor] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    profileImage: null
  })

  useEffect(() => {
    fetchStaff()
    fetchRoles()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      
      // Mock data for testing (remove when backend is ready)
      const mockStaff = [
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@jayshree.com',
          phone: '+91 9876543214',
          roleId: { _id: '2', name: 'Colony Manager' },
          profileImage: 'https://via.placeholder.com/150',
          status: 'active',
          joiningDate: '2024-01-01',
          salary: 50000
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya@jayshree.com',
          phone: '+91 9876543215',
          roleId: { _id: '3', name: 'Sales Executive' },
          profileImage: 'https://via.placeholder.com/150',
          status: 'active',
          joiningDate: '2024-01-05',
          salary: 35000
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit@jayshree.com',
          phone: '+91 9876543216',
          roleId: { _id: '3', name: 'Sales Executive' },
          profileImage: 'https://via.placeholder.com/150',
          status: 'active',
          joiningDate: '2024-01-10',
          salary: 35000
        }
      ]
      
      setStaff(mockStaff)
      
      // Uncomment when backend is ready:
      // const response = await apiService.staff.getAll()
      // setStaff(response.data.data || [])
    } catch (error) {
      errorService.handleApiError(error, 'Failed to fetch staff')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      // Mock roles data
      const mockRoles = [
        { _id: '1', name: 'Super Admin' },
        { _id: '2', name: 'Colony Manager' },
        { _id: '3', name: 'Sales Executive' },
        { _id: '4', name: 'Accountant' }
      ]
      
      setRoles(mockRoles)
      
      // Uncomment when backend is ready:
      // const response = await apiService.roles.getAll()
      // setRoles(response.data.data || [])
    } catch (error) {
      errorService.handleApiError(error, 'Failed to fetch roles')
    }
  }

  const handleOpenDialog = (staffMember = null) => {
    if (staffMember) {
      setEditMode(true)
      setCurrentStaff(staffMember)
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
        password: '',
        confirmPassword: '',
        roleId: staffMember.roleId?._id || '',
        profileImage: null
      })
    } else {
      setEditMode(false)
      setCurrentStaff(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        roleId: '',
        profileImage: null
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentStaff(null)
  }

  const handleSubmit = async () => {
    // Validate passwords match
    if (!editMode && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('roleId', formData.roleId)
      
      if (formData.password) {
        payload.append('password', formData.password)
      }
      
      if (formData.profileImage) {
        payload.append('profileImage', formData.profileImage)
      }

      if (editMode) {
        await axios.put(`/staff/${currentStaff._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Staff updated successfully')
      } else {
        await axios.post('/staff', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Staff created successfully')
      }
      
      handleCloseDialog()
      fetchStaff()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return

    try {
      await axios.delete(`/staff/${id}`)
      toast.success('Staff deleted successfully')
      fetchStaff()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStaff(filteredStaff.map(s => s._id))
    } else {
      setSelectedStaff([])
    }
  }

  const handleSelectStaff = (id) => {
    setSelectedStaff(prev => 
      prev.includes(id) 
        ? prev.filter(staffId => staffId !== id)
        : [...prev, id]
    )
  }

  const handleExport = (type) => {
    setExportAnchor(null)
    switch (type) {
      case 'csv':
        exportToCSV()
        break
      case 'excel':
        exportToExcel()
        break
      case 'print':
        window.print()
        break
      default:
        break
    }
  }

  const exportToCSV = () => {
    const headers = ['SL', 'Name', 'Phone', 'Email', 'Role']
    const csvContent = [
      headers.join(','),
      ...filteredStaff.map((staffMember, index) => [
        index + 1,
        staffMember.name,
        staffMember.phone,
        staffMember.email,
        staffMember.roleId?.name || ''
      ].join(','))
    ].join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'staff.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  const exportToExcel = () => {
    toast.info('Excel export functionality would be implemented here')
  }

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.phone.includes(searchTerm)
  ).slice(0, showEntries)

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Staff List</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Staff
        </Button>
      </Box>

      {/* Controls */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Show:</Typography>
          <TextField
            select
            size="small"
            value={showEntries}
            onChange={(e) => setShowEntries(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </TextField>
        </Box>
        
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
        />
        
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={(e) => setExportAnchor(e.currentTarget)}
        >
          Export
        </Button>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
      >
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon><FileDownload /></ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon><FileDownload /></ListItemIcon>
          <ListItemText>Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('print')}>
          <ListItemIcon><Print /></ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
      </Menu>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedStaff.length > 0 && selectedStaff.length < filteredStaff.length}
                  checked={filteredStaff.length > 0 && selectedStaff.length === filteredStaff.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><strong>SL.</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="right"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No staff found. Click "Add Staff" to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staffMember, index) => (
                <TableRow key={staffMember._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStaff.includes(staffMember._id)}
                      onChange={() => handleSelectStaff(staffMember._id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={staffMember.profileImage} sx={{ width: 32, height: 32 }}>
                        {staffMember.name.charAt(0)}
                      </Avatar>
                      {staffMember.name}
                    </Box>
                  </TableCell>
                  <TableCell>{staffMember.phone}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.roleId?.name || 'admin'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(staffMember)} sx={{ color: 'orange' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(staffMember._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Full Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Email Address</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="superadmin@jayshree.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={editMode}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Phone</Typography>
              <TextField
                fullWidth
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <Box display="flex" alignItems="center" mr={1}>
                      🇮🇳 +91
                    </Box>
                  )
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Password</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editMode}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Confirm Password</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={!editMode}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" mb={1}>Role*</Typography>
              <TextField
                fullWidth
                select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                required
              >
                <MenuItem value="">Select One</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>Profile Image (optional)</Typography>
              <Box
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                onClick={() => document.getElementById('profile-image').click()}
              >
                <Add sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Click to upload profile image
                </Typography>
                <input
                  id="profile-image"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                />
                {formData.profileImage && (
                  <Typography variant="body2" color="success.main" mt={1}>
                    ✓ {formData.profileImage.name}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StaffManagement
