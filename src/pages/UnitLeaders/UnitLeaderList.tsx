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
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {unitLeaderAPI} from "../../services/api";
import type {UnitLeader} from "../../types/unitLeader.types";

const UnitLeaderList: React.FC = () => {
  const [unitLeaders, setUnitLeaders] = useState<UnitLeader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch unit leaders on component mount
  useEffect(() => {
    fetchUnitLeaders();
  }, []);

  const fetchUnitLeaders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await unitLeaderAPI.getAllUnitLeaders();
      setUnitLeaders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch unit leader records. Please try again.");
      console.error("Error fetching unit leaders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this unit leader?")) {
      try {
        await unitLeaderAPI.deleteUnitLeader(id);
        setUnitLeaders(
          unitLeaders.filter((unitLeader) => unitLeader._id !== id)
        );
        // Optional: Show success message with Snackbar
      } catch (err) {
        alert("Failed to delete unit leader");
        console.error("Error deleting unit leader:", err);
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

  // Filter unit leaders based on search
  const filteredUnitLeaders = unitLeaders.filter(
    (unitLeader) =>
      unitLeader.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unitLeader.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
              Unit Leaders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all unit leader records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Unit Leader Record
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
            placeholder="Search by Unit Leader's name..."
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
              {filteredUnitLeaders.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Unit Leaders Table */}
        {filteredUnitLeaders.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No unit leader records found.
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
                  <TableCell sx={{fontWeight: 600}}>Unit Number</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Zonal Number</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Appointed Date</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Contact Number</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUnitLeaders.map((unitLeader) => (
                  <TableRow
                    key={unitLeader._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {`${unitLeader.firstName} ${unitLeader.lastName}`}
                    </TableCell>
                    <TableCell>{unitLeader.address}</TableCell>
                    <TableCell align="center">
                      {unitLeader.unitNumber}
                    </TableCell>
                    <TableCell align="center">
                      {unitLeader.zonalNumber}
                    </TableCell>
                    <TableCell>
                      {formatDate(unitLeader.appointedDate)}
                    </TableCell>
                    <TableCell>{unitLeader.contactNumber}</TableCell>

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
                            onClick={() => handleView(unitLeader._id)}
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
                            onClick={() => handleEdit(unitLeader._id)}
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
                            onClick={() => handleDelete(unitLeader._id)}
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

export default UnitLeaderList;
