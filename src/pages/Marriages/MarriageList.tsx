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
  Print,
} from "@mui/icons-material";
import {marriageAPI} from "../../services/api";
import type {Marriage} from "../../types/marriage.types";
import {useAuth} from "../../hooks/useAuth";
import {generateMarriageCertificate} from "../../utils/marriageCertificate";

const MarriagesList: React.FC = () => {
  const [marriages, setMarriages] = useState<Marriage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch marriages
  useEffect(() => {
    fetchMarriages();
  }, []);

  const fetchMarriages = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await marriageAPI.getAllMarriages();
      setMarriages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch marriage records. Please try again.");
      console.error("Error fetching marriages:", err);
    } finally {
      setLoading(false);
    }
  };

  const {user} = useAuth();

  const deleteMarriage = async (id: string): Promise<void> => {
    if (
      window.confirm("Are you sure you want to delete this marriage record?")
    ) {
      try {
        await marriageAPI.deleteMarriage(id);
        setMarriages(marriages.filter((marriage) => marriage._id !== id));
      } catch (err) {
        alert("Failed to delete marriage record");
        console.error("Error deleting marriage:", err);
      }
    }
  };

  const viewMarriage = (id: string): void => {
    navigate(`/marriages/view/${id}`);
  };

  const updateMarriage = (id: string): void => {
    navigate(`/marriages/edit/${id}`);
  };

  const handleAddNew = (): void => {
    navigate("/marriages/add");
  };

  // Filter marriages based on search
  const filteredMarriages = marriages.filter(
    (marriage) =>
      marriage.nameOfBride.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marriage.nameOfGroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marriage.shortenedCoupleName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
              Marriage Records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all marriage records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Marriage Record
          </Button>
        </Box>

        {/* Search Bar */}
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
            placeholder="Search by Bride's or Groom's name..."
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
              {filteredMarriages.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Burials Table */}
        {filteredMarriages.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No records found.
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
                    Shortened Couple Name
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}}>Groom's Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Bride's Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Marriage Date</TableCell>
                  {/* <TableCell sx={{fontWeight: 600}}>Time of Mass</TableCell> */}
                  <TableCell sx={{fontWeight: 600}}>
                    Need Church Choir
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Marriage Certificate
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMarriages.map((marriage) => (
                  <TableRow
                    key={marriage._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500}}>
                      {marriage.shortenedCoupleName}
                    </TableCell>
                    <TableCell>{marriage.nameOfBride}</TableCell>
                    <TableCell>{marriage.nameOfGroom}</TableCell>
                    <TableCell>{formatDate(marriage.dateOfMarriage)}</TableCell>
                    {/* <TableCell>{marriage.timeOfMass}</TableCell> */}
                    <TableCell align="center">
                      <Chip
                        label={marriage.needChurchChoir}
                        size="small"
                        color={
                          marriage.needChurchChoir === "Yes"
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}>
                        <Tooltip title="Print Certificate">
                          <IconButton
                            size="small"
                            onClick={() =>
                              generateMarriageCertificate(
                                marriage,
                                user?.churchName || ""
                              )
                            }
                            sx={{
                              color: "warning.main",
                              border: "1px solid",
                              borderColor: "warning.main",
                              borderRadius: 1,
                              padding: "6px",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                              },
                            }}>
                            <Print fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

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
                            onClick={() => viewMarriage(marriage._id)}
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
                            onClick={() => updateMarriage(marriage._id)}
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
                            onClick={() => deleteMarriage(marriage._id)}
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

export default MarriagesList;
