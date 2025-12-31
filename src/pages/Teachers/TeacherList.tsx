import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {sundaySchoolAPI} from "../../services/api";
import type {SundaySchoolTeacher} from "../../types/sundaySchool.types";

const TeachersList: React.FC = () => {
  const [teachers, setTeachers] = useState<SundaySchoolTeacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await sundaySchoolAPI.getAllTeachers();
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch teachers. Please try again.");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string): Promise<void> => {
    if (
      window.confirm("Are you sure you want to delete this teacher record?")
    ) {
      try {
        await sundaySchoolAPI.deleteTeacher(id);
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
        // Optional: Show success message with Snackbar
      } catch (err) {
        alert("Failed to delete teacher record");
        console.error("Error deleting teacher:", err);
      }
    }
  };

  const viewTeacher = (id: string): void => {
    navigate(`/sunday-school-teachers/view/${id}`);
  };

  const editTeacher = (id: string): void => {
    navigate(`/sunday-school-teachers/edit/${id}`);
  };

  const addTeacher = (): void => {
    navigate("/sunday-school-teachers/add");
  };

  // Filter records based on search
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 2,
        maxWidth: 1400,
        margin: "auto",
      }}>
      <Box sx={{maxWidth: "1400px", margin: "0 auto"}}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              gutterBottom>
              Sunday School Teachers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all teachers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addTeacher}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Teacher
          </Button>
        </Box>

        {/* Search Bar and Count */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}>
          <TextField
            placeholder="Search by teacher's Name..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{width: 400}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Total Records:{" "}
            <Typography component="span" fontWeight={600} color="primary">
              {filteredTeachers.length}
            </Typography>
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Teachers Table */}
        {filteredTeachers.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No teachers found.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTeacher}
              sx={{mt: 2, textTransform: "none"}}>
              Add First Record
            </Button>
          </Card>
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table sx={{minWidth: 900}}>
              <TableHead>
                <TableRow sx={{backgroundColor: "#f5f5f5"}}>
                  <TableCell sx={{fontWeight: 600}}>Full Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Date of Birth</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Appointed Date</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Address</TableCell>
                  <TableCell sx={{fontWeight: 600}}>
                    Class of Teaching
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}}>Is Active</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow
                    key={teacher._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{formatDate(teacher.dateOfBirth)}</TableCell>
                    <TableCell>{formatDate(teacher.appointedDate)}</TableCell>
                    <TableCell>{teacher.address}</TableCell>
                    <TableCell>{teacher.className}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={teacher.isActive ? "Yes" : "No"}
                        size="small"
                        color={
                          teacher.isActive === true ? "success" : "warning"
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => viewTeacher(teacher._id)}
                            sx={{
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.main",
                              borderRadius: 1,
                              padding: "6px",
                              "&:hover": {
                                backgroundColor: "primary.main",
                                color: "white",
                              },
                            }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Record">
                          <IconButton
                            size="small"
                            onClick={() => editTeacher(teacher._id)}
                            sx={{
                              color: "info.main",
                              border: "1px solid",
                              borderColor: "info.main",
                              borderRadius: 1,
                              padding: "6px",
                              "&:hover": {
                                backgroundColor: "info.main",
                                color: "white",
                              },
                            }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Record">
                          <IconButton
                            size="small"
                            onClick={() => deleteRecord(teacher._id)}
                            sx={{
                              color: "error.main",
                              border: "1px solid",
                              borderColor: "error.main",
                              borderRadius: 1,
                              padding: "6px",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                              },
                            }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};

export default TeachersList;
