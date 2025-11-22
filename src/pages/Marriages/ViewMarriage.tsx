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
import {marriageAPI} from "../../services/api";
import type {Marriage} from "../../types/marriage.types";

const ViewMarriage: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [marriage, setMarriage] = useState<Marriage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMarriageDetails();
    }
  }, [id]);

  const fetchMarriageDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await marriageAPI.getMarriageById(id!);
      setMarriage(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch marriage record. Please try again.");
      console.error("Error fetching marriage:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/marriages");
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this marriage record?")
    ) {
      try {
        await marriageAPI.deleteMarriage(id!);
        navigate("/marriages");
      } catch (err) {
        alert("Failed to delete marriage record");
        console.error("Error deleting marriage:", err);
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

  if (error || !marriage) {
    return (
      <Box sx={{p: 3}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Marriage record not found"}
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
                View Marriage Record - {marriage.shortenedCoupleName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this marriage record
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

        {/* Couple Information Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Couple Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Name of Bride"
              value={marriage.nameOfBride}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Name of Groom"
              value={marriage.nameOfGroom}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Shortened Couple Name"
              value={marriage.shortenedCoupleName}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          {/* Marriage Details Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Marriage Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Date of Marriage"
              value={formatDate(marriage.dateOfMarriage)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Time of Mass"
              value={formatTime(marriage.timeOfMass)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mass Type"
              value={`${marriage.massType} Mass`}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          {/* Church Services Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Church Services
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor:
                  marriage.needChurchChoir === "Yes" ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor:
                  marriage.needChurchChoir === "Yes" ? "#bfdbfe" : "#fde68a",
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
                    Church Choir
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Need church choir for the ceremony
                  </Typography>
                </Box>
                <Chip
                  label={marriage.needChurchChoir}
                  color={
                    marriage.needChurchChoir === "Yes" ? "success" : "default"
                  }
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor:
                  marriage.useChurchDecos === "Yes" ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor:
                  marriage.useChurchDecos === "Yes" ? "#bfdbfe" : "#fde68a",
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
                    Church Decorations
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Use church decorations for the ceremony
                  </Typography>
                </Box>
                <Chip
                  label={marriage.useChurchDecos}
                  color={
                    marriage.useChurchDecos === "Yes" ? "success" : "default"
                  }
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Divider sx={{my: 4}} />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              textTransform: "none",
              px: 4,
            }}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMarriage;
