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
import type {Baptism} from "../../types/baptism.types";
import {baptismAPI} from "../../services/api";

const BaptismList: React.FC = () => {
  const [baptisms, setBaptisms] = useState<Baptism[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch baptisms on component mount
  useEffect(() => {
    fetchBaptisms();
  }, []);

  const fetchBaptisms = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await baptismAPI.getAllBaptisms();
      setBaptisms(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch baptism records. Please try again.");
      console.error("Error fetching baptisms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (
      window.confirm("Are you sure you want to delete this baptism record?")
    ) {
      try {
        await baptismAPI.deleteBaptism(id);
        setBaptisms(baptisms.filter((baptism) => baptism._id !== id));
      } catch (err) {
        alert("Failed to delete baptism record");
        console.error("Error deleting baptism:", err);
      }
    }
  };

  const handleView = (id: string): void => {
    navigate(`/baptisms/view/${id}`);
  };

  const handleEdit = (id: string): void => {
    navigate(`/baptisms/edit/${id}`);
  };

  const handleAddNew = (): void => {
    navigate("/baptisms/add");
  };

  // Filter records based on search
  const filteredBaptisms = baptisms.filter((baptism) =>
    baptism.childName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string): string => {
    // If time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
        // mt: 4,
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
              Baptism Records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all baptism records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Burial Record
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
            placeholder="Search by child or person name..."
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
              {filteredBaptisms.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Baptism Table */}
        {filteredBaptisms.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No baptism records found.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{mt: 2, textTransform: "none"}}>
              Add First Record
            </Button>
          </Card>
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table sx={{minWidth: 900}}>
              <TableHead>
                <TableRow sx={{backgroundColor: "#f5f5f5"}}>
                  <TableCell sx={{fontWeight: 600}}>
                    Child/Person Name
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}}>Date of Birth</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Name of Father</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Name of Mother</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Date of Baptism</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Time of Baptism</TableCell>

                  <TableCell sx={{fontWeight: 600}}>
                    Parents Married ?
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBaptisms.map((baptism) => (
                  <TableRow
                    key={baptism._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {baptism.childName}
                    </TableCell>
                    <TableCell>{formatDate(baptism.dateOfBirth)}</TableCell>
                    <TableCell>{baptism.nameOfFather}</TableCell>
                    <TableCell>{baptism.nameOfMother}</TableCell>
                    <TableCell>{formatDate(baptism.dateOfBaptism)}</TableCell>
                    <TableCell>{formatTime(baptism.timeOfBaptism)}</TableCell>

                    <TableCell align="center">
                      <Chip
                        label={baptism.areParentsMarried ? "Yes" : "No"}
                        size="small"
                        color={
                          baptism.areParentsMarried === true
                            ? "success"
                            : "warning"
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
                            onClick={() => handleView(baptism._id)}
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
                            onClick={() => handleEdit(baptism._id)}
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
                            onClick={() => handleDelete(baptism._id)}
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

export default BaptismList;
