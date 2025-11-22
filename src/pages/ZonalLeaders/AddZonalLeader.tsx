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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {zonalLeaderAPI} from "../../services/api";
import type {ZoneNumber} from "../../types/zonalLeader.types";

const AddZonalLeader = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    contactNumber: "",
    appointedDate: "",
    zoneNumber: "1" as ZoneNumber,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await zonalLeaderAPI.addZonalLeader(formData);
      navigate("/zonal-leaders");
    } catch (error) {
      console.error("Error creating zonal leader:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create zonal leader. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create zonal leader. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/zonal-leaders");
  };

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
              onClick={handleCancel}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Add New Zonal Leader
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to add a new zonal leader
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter first name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter last name"
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
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
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
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter contact number"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={3}
                placeholder="Enter full address"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
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
                name="appointedDate"
                type="date"
                value={formData.appointedDate}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
                helperText="Date when appointed as zonal leader"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                <InputLabel>Zone Number</InputLabel>
                <Select
                  name="zoneNumber"
                  value={formData.zoneNumber}
                  label="Zone Number"
                  onChange={(e) =>
                    handleSelectChange("zoneNumber", e.target.value)
                  }>
                  <MenuItem value="1">Zone 1</MenuItem>
                  <MenuItem value="2">Zone 2</MenuItem>
                  <MenuItem value="3">Zone 3</MenuItem>
                  <MenuItem value="4">Zone 4</MenuItem>
                  <MenuItem value="5">Zone 5</MenuItem>
                  <MenuItem value="6">Zone 6</MenuItem>
                  <MenuItem value="7">Zone 7</MenuItem>
                  <MenuItem value="8">Zone 8</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Information Box */}
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
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  Leadership Role
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All operations inside their designated zone must be supervised
                  and coordinated by the zonal leader. They report to the parish
                  committee and function as their zone members' main point of
                  contact.
                </Typography>
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
              onClick={handleCancel}
              disabled={loading}
              sx={{
                textTransform: "none",
                px: 4,
              }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                textTransform: "none",
                px: 4,
              }}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddZonalLeader;
