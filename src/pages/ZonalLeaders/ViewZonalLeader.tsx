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
} from "@mui/icons-material";
import {zonalLeaderAPI} from "../../services/api";
import type {ZonalLeader} from "../../types/zonalLeader.types";

const ViewZonalLeader: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [leader, setLeader] = useState<ZonalLeader | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLeaderDetails();
    }
  }, [id]);

  const fetchLeaderDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await zonalLeaderAPI.getZonalLeaderById(id!);
      setLeader(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch zonal leader. Please try again.");
      console.error("Error fetching leader:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/zonal-leaders");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this zonal leader?")) {
      try {
        await zonalLeaderAPI.deleteZonalLeader(id!);
        navigate("/zonal-leaders");
      } catch (err) {
        alert("Failed to delete zonal leader");
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
          {error || "Zonal leader not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
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
              onClick={handleBack}
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
                Zonal Leader Details - {leader.firstName} {leader.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this zonal leader
              </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
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

          <Grid item xs={8}>
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Age"
              value={`${calculateAge(leader.dateOfBirth)} years old`}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
          <Grid item xs={12}>
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

          <Grid item xs={12}>
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
                    Zone Assignment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Leading zone number
                  </Typography>
                </Box>
                <Chip
                  label={`Zone ${leader.zoneNumber}`}
                  color="primary"
                  sx={{fontWeight: 600, fontSize: "16px", px: 2, py: 2.5}}
                />
              </Box>
            </Paper>
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
            onClick={handleBack}
            sx={{textTransform: "none", px: 4}}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewZonalLeader;
