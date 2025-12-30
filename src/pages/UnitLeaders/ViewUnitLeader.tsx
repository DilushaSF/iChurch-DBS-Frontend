import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import {unitLeaderAPI, zonalLeaderAPI} from "../../services/api";
import type {UnitLeader} from "../../types/unitLeader.types";
import type {ZonalLeader} from "../../types/zonalLeader.types";

const ViewUnitLeader: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [leader, setLeader] = useState<UnitLeader | null>(null);
  const [zonalLeader, setZonalLeader] = useState<ZonalLeader | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingZonalLeader, setLoadingZonalLeader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLeaderDetails();
    }
  }, [id]);

  const fetchLeaderDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await unitLeaderAPI.getUnitLeaderById(id!);
      setLeader(response.data);

      // Fetch zonal leader
      if (response.data.zonalLeader) {
        fetchZonalLeaderDetails(response.data.zonalLeader);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch unit leader. Please try again.");
      console.error("Error fetching leader:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchZonalLeaderDetails = async (
    zonalLeaderId: string
  ): Promise<void> => {
    try {
      setLoadingZonalLeader(true);
      const response = await zonalLeaderAPI.getZonalLeaderById(zonalLeaderId);
      setZonalLeader(response.data);
    } catch (err) {
      console.error("Error fetching zonal leader:", err);
      setZonalLeader(null);
    } finally {
      setLoadingZonalLeader(false);
    }
  };

  const goBack = () => {
    navigate("/unit-leaders");
  };

  const deleteRecord = async () => {
    if (window.confirm("Are you sure you want to delete this unit leader?")) {
      try {
        await unitLeaderAPI.deleteUnitLeader(id!);
        navigate("/unit-leaders");
      } catch (err) {
        alert("Failed to delete unit leader");
        console.error("Error deleting leader:", err);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateTenure = (appointedDate: string): string => {
    const today = new Date();
    const appointed = new Date(appointedDate);
    const years = today.getFullYear() - appointed.getFullYear();
    const months = today.getMonth() - appointed.getMonth();

    let totalMonths = years * 12 + months;
    if (today.getDate() < appointed.getDate()) {
      totalMonths--;
    }

    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    if (displayYears > 0 && displayMonths > 0) {
      return `${displayYears} year${
        displayYears > 1 ? "s" : ""
      }, ${displayMonths} month${displayMonths > 1 ? "s" : ""}`;
    } else if (displayYears > 0) {
      return `${displayYears} year${displayYears > 1 ? "s" : ""}`;
    } else {
      return `${displayMonths} month${displayMonths > 1 ? "s" : ""}`;
    }
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

  if (error || !leader) {
    return (
      <Box sx={{p: 3}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Unit leader not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          variant="outlined">
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#ffffff",
          maxWidth: 1400,
          margin: "0 auto",
        }}>
        {/* Header */}
        <Box sx={{mb: 4}}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 2}}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={goBack}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                View Unit Leader - {leader.firstName} {leader.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this unit leader
              </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={deleteRecord}
                sx={{textTransform: "none"}}>
                Delete
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Personal Information Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Full Name"
              value={`${leader.firstName} ${leader.lastName}`}
              InputProps={{readOnly: true}}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#e0f2fe",
                  fontWeight: 600,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={formatDate(leader.dateOfBirth)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Age"
              value={`${calculateAge(leader.dateOfBirth)} years old`}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Contact Number"
              value={leader.contactNumber}
              InputProps={{readOnly: true}}
              variant="outlined"
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Address"
              value={leader.address}
              InputProps={{readOnly: true}}
              multiline
              rows={3}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          {/* Leadership Information Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Leadership Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Appointed Date"
              value={formatDate(leader.appointedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tenure Duration"
              value={calculateTenure(leader.appointedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#f0f9ff",
                border: "1px solid",
                borderColor: "#bfdbfe",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Zonal Assignment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Zone number
                  </Typography>
                </Box>
                <Chip
                  label={`Zone ${leader.zonalNumber}`}
                  color="primary"
                  sx={{fontWeight: 600, fontSize: "16px", px: 2, py: 2.5}}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#fef3c7",
                border: "1px solid",
                borderColor: "#fde68a",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Unit Number
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unit assignment
                  </Typography>
                </Box>
                <Chip
                  label={`Unit ${leader.unitNumber}`}
                  color="warning"
                  sx={{fontWeight: 600, fontSize: "16px", px: 2, py: 2.5}}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Reporting Structure Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Reporting Structure
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {loadingZonalLeader ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "#f9fafb",
                  border: "1px solid",
                  borderColor: "#e5e7eb",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  Loading zonal leader information...
                </Typography>
              </Paper>
            ) : zonalLeader ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "#f0fdf4",
                  border: "1px solid",
                  borderColor: "#86efac",
                  borderRadius: 1,
                }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                  }}>
                  <PersonIcon sx={{color: "success.main", fontSize: 32}} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Reports To (Zonal Leader)
                    </Typography>
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight={600}>
                      {zonalLeader.firstName} {zonalLeader.lastName}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {zonalLeader.contactNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      Zone
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      Zone {zonalLeader.zoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {zonalLeader.address}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "#fef3c7",
                  border: "1px solid",
                  borderColor: "#fde68a",
                  borderRadius: 1,
                }}>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  No Zonal Leader Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The zonal leader information is not available.
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Metadata Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Divider sx={{mb: 3}} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Record Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Record Created"
              value={
                leader.createdAt
                  ? new Date(leader.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"
              }
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Updated"
              value={
                leader.updatedAt
                  ? new Date(leader.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"
              }
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Divider sx={{my: 4}} />

        <Box sx={{display: "flex", gap: 2, justifyContent: "flex-end"}}>
          <Button
            variant="outlined"
            onClick={goBack}
            sx={{textTransform: "none", px: 4}}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewUnitLeader;
