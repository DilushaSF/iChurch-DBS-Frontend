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
import {burialAPI} from "../../services/api";
import type {Burial} from "../../types/burial.types";

const BurialsList: React.FC = () => {
  const [burials, setBurials] = useState<Burial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch burials on component mount
  useEffect(() => {
    fetchBurials();
  }, []);

  const fetchBurials = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await burialAPI.getAllBurials();
      setBurials(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch burial records. Please try again.");
      console.error("Error fetching burials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this burial record?")) {
      try {
        await burialAPI.deleteBurial(id);
        setBurials(burials.filter((burial) => burial._id !== id));
        // Optional: Show success message with Snackbar
      } catch (err) {
        alert("Failed to delete burial record");
        console.error("Error deleting burial:", err);
      }
    }
  };

  const handleView = (id: string): void => {
    navigate(`/burials/view/${id}`);
  };

  const handleEdit = (id: string): void => {
    navigate(`/burials/edit/${id}`);
  };

  const handleAddNew = (): void => {
    navigate("/burials/add");
  };

  // Filter burials based on search
  const filteredBurials = burials.filter(
    (burial) =>
      burial.nameOfDeceased.toLowerCase().includes(searchTerm.toLowerCase()) ||
      burial.custodian.toLowerCase().includes(searchTerm.toLowerCase())
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
              Burial Records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all burial records
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
            placeholder="Search by deceased name or custodian..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{minWidth: 300, maxWidth: 400}}
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
              {filteredBurials.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Burials Table */}
        {filteredBurials.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No burial records found.
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
                  <TableCell sx={{fontWeight: 600}}>Deceased Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Date of Death</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Date of Birth</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Burial Date</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Baptized</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Custodian</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBurials.map((burial) => (
                  <TableRow
                    key={burial._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {burial.nameOfDeceased}
                    </TableCell>
                    <TableCell>{formatDate(burial.dateOfDeath)}</TableCell>
                    <TableCell>{formatDate(burial.dateOfBirth)}</TableCell>
                    <TableCell>{formatDate(burial.dateWillBurry)}</TableCell>
                    <TableCell>
                      <Chip
                        label={burial.baptized}
                        size="small"
                        color={
                          burial.baptized === "yes" ? "success" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>{burial.custodian}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleView(burial._id)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {backgroundColor: "primary.light"},
                            }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(burial._id)}
                            sx={{
                              color: "warning.main",
                              "&:hover": {backgroundColor: "warning.light"},
                            }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(burial._id)}
                            sx={{
                              color: "error.main",
                              "&:hover": {backgroundColor: "error.light"},
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

export default BurialsList;
