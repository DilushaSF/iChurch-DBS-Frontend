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
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import type {Choir} from "../../types/choir.types";
import {choirAPI} from "../../services/api";

const ChoiristorList: React.FC = () => {
  const [choiristors, setChoiristors] = useState<Choir[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch choiristors on component mount
  useEffect(() => {
    fetchChoiristors();
  }, []);

  const fetchChoiristors = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await choirAPI.getAllChoiristors();
      setChoiristors(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch choiristor records. Please try again.");
      console.error("Error fetching choiristors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this choiristor?")) {
      try {
        await choirAPI.deleteChoiristor(id);
        setChoiristors(
          choiristors.filter((choiristor) => choiristor._id !== id)
        );
        // Optional: Show success message with Snackbar
      } catch (err) {
        alert("Failed to delete choiristor");
        console.error("Error deleting choiristor:", err);
      }
    }
  };

  const handleView = (id: string): void => {
    navigate(`/unit-leaders/view/${id}`);
  };

  const handleEdit = (id: string): void => {
    navigate(`/unit-leaders/edit/${id}`);
  };

  const handleAddNew = (): void => {
    navigate("/unit-leaders/add");
  };

  // Filter choiristors based on search
  const filteredChoiristors = choiristors.filter(
    (choiristor) =>
      choiristor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      choiristor.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
              Choiristors
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all Choiristors
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Choiristor
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
            placeholder="Search by Choiristor's name..."
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
              {filteredChoiristors.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Choiristors Grid */}
        {filteredChoiristors.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No choiristor records found.
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
                  <TableCell sx={{fontWeight: 600}}>Full Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Address</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Contact Number</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Vocal Part</TableCell>
                  <TableCell sx={{fontWeight: 600}}>
                    Is Active Member?
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}}>Choir Type</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Joined Date</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChoiristors.map((choiristor) => (
                  <TableRow
                    key={choiristor._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {`${choiristor.firstName} ${choiristor.lastName}`}
                    </TableCell>
                    <TableCell>{choiristor.address}</TableCell>
                    <TableCell align="center">
                      {choiristor.contactNumber}
                    </TableCell>
                    <TableCell align="center">{choiristor.voicePart}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={choiristor.isActiveMember ? "Yes" : "No"}
                        size="small"
                        color={
                          choiristor.isActiveMember === true
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell>{choiristor.choirType}</TableCell>
                    <TableCell>{formatDate(choiristor.joinedDate)}</TableCell>

                    {/* Actions */}
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
                            onClick={() => handleView(choiristor._id)}
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
                            onClick={() => handleEdit(choiristor._id)}
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
                            onClick={() => handleDelete(choiristor._id)}
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

export default ChoiristorList;
