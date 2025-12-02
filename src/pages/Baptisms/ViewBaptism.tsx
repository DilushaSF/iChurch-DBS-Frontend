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
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {baptismAPI} from "../../services/api";
import type {Baptism} from "../../types/baptism.types";

const ViewBaptism = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baptismData, setBaptismData] = useState<Baptism | null>(null);

  useEffect(() => {
    if (id) {
      fetchBaptismData();
    }
  }, [id]);

  const fetchBaptismData = async () => {
    try {
      setLoading(true);
      const response = await baptismAPI.getBaptismById(id!);
      setBaptismData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching baptism record:", error);
      setError("Failed to load baptism record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/baptisms");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return "N/A";
    return timeString;
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

  if (error || !baptismData) {
    return (
      <Box sx={{maxWidth: 1200, margin: "0 auto", p: 3}}>
        <Alert severity="error">{error || "Baptism record not found"}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{mt: 2, textTransform: "none"}}>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            View Baptism Record - {baptismData.childName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View baptism registration details
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Child Information Section */}
        <Box sx={{mb: 4}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
            <Typography variant="h6" fontWeight={600} sx={{pb: 0.5}}>
              Child Information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Child's Name"
                value={baptismData.childName}
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date of Birth"
                value={formatDate(baptismData.dateOfBirth)}
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Place of Birth"
                value={baptismData.placeOfBirth}
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
          </Grid>
        </Box>

        {/* Baptism Details Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{pb: 1}}>
            Baptism Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date of Baptism"
                value={formatDate(baptismData.dateOfBaptism)}
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
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Time of Baptism"
                value={formatTime(baptismData.timeOfBaptism)}
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
          </Grid>
        </Box>

        {/* Parents Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{pb: 1}}>
            Parents Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Name"
                value={baptismData.nameOfFather}
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
                label="Mother's Name"
                value={baptismData.nameOfMother}
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
          </Grid>
        </Box>

        {/* Godparents Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{pb: 1}}>
            Godparents Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Godfather's Name"
                value={baptismData.nameOfGodFather}
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
                label="Godmother's Name"
                value={baptismData.nameOfGodMother}
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
          </Grid>
        </Box>

        {/* Contact Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{pb: 1}}>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Address"
                value={baptismData.currentAddress}
                InputProps={{
                  readOnly: true,
                }}
                multiline
                rows={3}
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
                label="Contact Number"
                value={baptismData.contactNumber}
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
          </Grid>
        </Box>

        {/* Additional Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{pb: 1}}>
            Additional Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor:
                    baptismData.areParentsMarried !== false
                      ? "#f0f9ff"
                      : "#fef3c7",
                  border: "1px solid",
                  borderColor:
                    baptismData.areParentsMarried !== false
                      ? "#bfdbfe"
                      : "#fde68a",
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
                      Parents Marriage Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {baptismData.areParentsMarried !== false
                        ? "Parents are married"
                        : "Parents are not married"}
                    </Typography>
                  </Box>
                  <Chip
                    icon={
                      baptismData.areParentsMarried !== false ? (
                        <CheckIcon />
                      ) : (
                        <CancelIcon />
                      )
                    }
                    label={
                      baptismData.areParentsMarried !== false
                        ? "Married"
                        : "Not Married"
                    }
                    color={
                      baptismData.areParentsMarried !== false
                        ? "primary"
                        : "warning"
                    }
                    sx={{fontWeight: 600}}
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
                    baptismData.isFatherCatholic !== false
                      ? "#f0f9ff"
                      : "#fef3c7",
                  border: "1px solid",
                  borderColor:
                    baptismData.isFatherCatholic !== false
                      ? "#bfdbfe"
                      : "#fde68a",
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
                      Father's Religion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {baptismData.isFatherCatholic !== false
                        ? "Father is Catholic"
                        : "Father is not Catholic"}
                    </Typography>
                  </Box>
                  <Chip
                    icon={
                      baptismData.isFatherCatholic !== false ? (
                        <CheckIcon />
                      ) : (
                        <CancelIcon />
                      )
                    }
                    label={
                      baptismData.isFatherCatholic !== false
                        ? "Catholic"
                        : "Non-Catholic"
                    }
                    color={
                      baptismData.isFatherCatholic !== false
                        ? "primary"
                        : "warning"
                    }
                    sx={{fontWeight: 600}}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Information Box */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#f0fdf4",
            border: "1px solid",
            borderColor: "#86efac",
            borderRadius: 1,
            mt: 3,
          }}>
          <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
            <Box>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Baptism Record Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a read-only view of the baptism record.
              </Typography>
            </Box>
          </Box>
        </Paper>

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

export default ViewBaptism;
