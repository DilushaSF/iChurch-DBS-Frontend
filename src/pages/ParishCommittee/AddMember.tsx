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
import {parishCommitteeAPI} from "../../services/api";
import type {ZonalNumber, UnitNumber} from "../../types/parishcCommittee.types";

const AddParishCommitteeMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    zonalNumber: "1" as ZonalNumber,
    unitNumber: "1" as UnitNumber,
    position: "",
    joinedDate: "",
    representingCommittee: "",
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
      await parishCommitteeAPI.addParishCommitteeMember(formData);
      navigate("/parish-committee");
    } catch (error) {
      console.error("Error creating parish committee member:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create parish committee member. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create parish committee member. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/parish-committee");
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
            Add New Parish Committee Member
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to add a new committee member
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

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={2}
                placeholder="Enter full address"
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
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter phone number"
                helperText="Optional"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Location Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location Information
              </Typography>
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
                <InputLabel>Zonal Number</InputLabel>
                <Select
                  name="zonalNumber"
                  value={formData.zonalNumber}
                  label="Zonal Number"
                  onChange={(e) =>
                    handleSelectChange("zonalNumber", e.target.value)
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

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                <InputLabel>Unit Number</InputLabel>
                <Select
                  name="unitNumber"
                  value={formData.unitNumber}
                  label="Unit Number"
                  onChange={(e) =>
                    handleSelectChange("unitNumber", e.target.value)
                  }>
                  <MenuItem value="1">Unit 1</MenuItem>
                  <MenuItem value="2">Unit 2</MenuItem>
                  <MenuItem value="3">Unit 3</MenuItem>
                  <MenuItem value="4">Unit 4</MenuItem>
                  <MenuItem value="5">Unit 5</MenuItem>
                  <MenuItem value="6">Unit 6</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Committee Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Committee Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., Chairman, Secretary, Treasurer"
                helperText="Optional"
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
                label="Joined Date"
                name="joinedDate"
                type="date"
                value={formData.joinedDate}
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

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Representing Committee"
                name="representingCommittee"
                value={formData.representingCommittee}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="e.g., Finance Committee, Youth Committee"
                helperText="Which committee does this member represent?"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Information Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#f0f9ff",
                  border: "1px solid",
                  borderColor: "#bfdbfe",
                  borderRadius: 1,
                }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> Fields marked with * are required.
                  Phone number and position are optional but recommended for
                  better contact and organization.
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

export default AddParishCommitteeMember;
