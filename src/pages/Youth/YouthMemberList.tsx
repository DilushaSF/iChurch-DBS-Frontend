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
import type {Youth} from "../../types/youth.types";
import {youthAPI} from "../../services/api";

const YouthMemberList: React.FC = () => {
  const [youthMembers, setYouthMembers] = useState<Youth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch youth members
  useEffect(() => {
    fetchYouthMembers();
  }, []);

  const fetchYouthMembers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await youthAPI.getAllYouthMembers();
      setYouthMembers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch youth member records. Please try again.");
      console.error("Error fetching youth members:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this youth member?")) {
      try {
        await youthAPI.deleteYouthMember(id);
        setYouthMembers(
          youthMembers.filter((youthMember) => youthMember._id !== id)
        );
      } catch (err) {
        alert("Failed to delete youth member");
        console.error("Error deleting youth member:", err);
      }
    }
  };

  const viewMember = (id: string): void => {
    navigate(`/youth-association/view/${id}`);
  };

  const editMember = (id: string): void => {
    navigate(`/youth-association/edit/${id}`);
  };

  const addMember = (): void => {
    navigate("/youth-association/add");
  };

  // Filter youth members based on search
  const filteredYouthMembers = youthMembers.filter(
    (youthMember) =>
      youthMember.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youthMember.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
              Youth Association
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all Youth Members
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addMember}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Member
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
            placeholder="Search by Member's name..."
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
              {filteredYouthMembers.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Youth Members Grid */}
        {filteredYouthMembers.length === 0 ? (
          <Card sx={{p: 6, textAlign: "center"}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No youth member records found.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addMember}
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
                  <TableCell sx={{fontWeight: 600}}>Date Of Birth</TableCell>
                  <TableCell sx={{fontWeight: 600}}>
                    Is Active Member?
                  </TableCell>
                  <TableCell sx={{fontWeight: 600}}>Position</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredYouthMembers.map((youthMember) => (
                  <TableRow
                    key={youthMember._id}
                    hover
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell sx={{fontWeight: 500, width: 180}}>
                      {`${youthMember.firstName} ${youthMember.lastName}`}
                    </TableCell>
                    <TableCell>{youthMember.address}</TableCell>
                    <TableCell>{youthMember.contactNumber}</TableCell>
                    <TableCell sx={{width: 140}}>
                      {formatDate(youthMember.dateOfBirth)}
                    </TableCell>
                    <TableCell sx={{width: 90}} align="center">
                      <Chip
                        label={youthMember.isActiveMember ? "Yes" : "No"}
                        size="small"
                        color={
                          youthMember.isActiveMember === true
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell>{youthMember.position}</TableCell>

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
                            onClick={() => viewMember(youthMember._id)}
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
                            onClick={() => editMember(youthMember._id)}
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
                            onClick={() => deleteRecord(youthMember._id)}
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

export default YouthMemberList;
