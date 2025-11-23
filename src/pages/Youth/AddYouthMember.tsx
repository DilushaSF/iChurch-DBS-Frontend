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
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  GroupOutlined as YouthIcon,
} from "@mui/icons-material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {youthAPI} from "../../services/api";

const AddYouthMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    joinedDate: "",
    address: "",
    contactNumber: "",
    position: "",
    isActiveMember: true,
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActiveMember: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await youthAPI.addYouthMember(formData);
      navigate("/youth-association");
    } catch (error) {
      console.error("Error creating youth member:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create youth member. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create youth member. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/youth-association");
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
            Add New Youth Member
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to add a new youth association member
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

            {/* Youth Association Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Youth Association Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joined Date"
                name="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
                helperText="Date when joined the youth association"
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
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., President, Secretary, Member"
                helperText="Optional - Position within the youth association"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: formData.isActiveMember
                    ? "#f0f9ff"
                    : "#fef3c7",
                  border: "1px solid",
                  borderColor: formData.isActiveMember ? "#bfdbfe" : "#fde68a",
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
                      Membership Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.isActiveMember
                        ? "This member is currently active in the youth association"
                        : "This member is currently inactive"}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActiveMember}
                        onChange={handleSwitchChange}
                        color="primary"
                      />
                    }
                    label={formData.isActiveMember ? "Active" : "Inactive"}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Information Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "#f0fdf4",
                  border: "1px solid",
                  borderColor: "#86efac",
                  borderRadius: 1,
                }}>
                <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                  <YouthIcon
                    sx={{color: "success.main", mt: 0.5, fontSize: 28}}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Youth Association Member
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Youth members are an important part of our parish. They
                      join activities and programs that build faith and
                      community. A position is optional and can be assigned
                      later
                    </Typography>
                  </Box>
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

export default AddYouthMember;
