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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  OutlinedInput,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  MusicNote as MusicIcon,
} from "@mui/icons-material";
import axios from "axios";
import type {SelectChangeEvent} from "@mui/material/Select";
import {choirAPI} from "../../services/api";
import type {Choir, ChoirType, VoicePart} from "../../types/choir.types";

const INSTRUMENTS = [
  "Organ",
  "Piano",
  "Guitar",
  "Violin",
  "Drums",
  "Flute",
  "Other",
];

const EditChoirMember: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    contactNumber: "",
    joinedDate: "",
    voicePart: "Soprano" as VoicePart,
    isActiveMember: true,
    instrumentsPlayed: [] as string[],
    choirType: "Senior" as ChoirType,
  });

  useEffect(() => {
    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

  const fetchMemberDetails = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      const response = await choirAPI.getChoiristorById(id!);
      const member: Choir = response.data;

      // Convert dates to YYYY-MM-DD format for input fields
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth.split("T")[0],
        address: member.address,
        contactNumber: member.contactNumber,
        joinedDate: member.joinedDate.split("T")[0],
        voicePart: member.voicePart,
        isActiveMember: member.isActiveMember,
        instrumentsPlayed: member.instrumentsPlayed || [],
        choirType: member.choirType,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch choiristor. Please try again.");
      console.error("Error fetching member:", err);
    } finally {
      setFetchLoading(false);
    }
  };

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstrumentsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      instrumentsPlayed: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await choirAPI.editChoiristor(id!, formData);
      navigate("/choiristors");
    } catch (error) {
      console.error("Error updating choiristor:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update choiristor. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update choiristor. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/choiristors");
  };

  if (fetchLoading) {
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
            Edit Choiristor - {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the choiristor information
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

            {/* Choir Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Choir Information
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
                helperText="Date when joined the choir"
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
                <InputLabel>Choir Type</InputLabel>
                <Select
                  name="choirType"
                  value={formData.choirType}
                  label="Choir Type"
                  onChange={(e) =>
                    handleSelectChange("choirType", e.target.value)
                  }>
                  <MenuItem value="Senior">Senior Choir</MenuItem>
                  <MenuItem value="Junior">Junior Choir</MenuItem>
                  <MenuItem value="English">English Choir</MenuItem>
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
                <InputLabel>Voice Part</InputLabel>
                <Select
                  name="voicePart"
                  value={formData.voicePart}
                  label="Voice Part"
                  onChange={(e) =>
                    handleSelectChange("voicePart", e.target.value)
                  }>
                  <MenuItem value="Soprano">Soprano</MenuItem>
                  <MenuItem value="Alto">Alto</MenuItem>
                  <MenuItem value="Tenor">Tenor</MenuItem>
                  <MenuItem value="Bass">Bass</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                <InputLabel>Instruments Played</InputLabel>
                <Select
                  multiple
                  name="instrumentsPlayed"
                  value={formData.instrumentsPlayed}
                  onChange={handleInstrumentsChange}
                  input={<OutlinedInput label="Instruments Played" />}
                  renderValue={(selected) => (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}>
                  {INSTRUMENTS.map((instrument) => (
                    <MenuItem key={instrument} value={instrument}>
                      {instrument}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                        ? "This member is currently active in the choir"
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
                  <MusicIcon sx={{color: "success.main", mt: 0.5}} />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Update Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Make sure all information is accurate before saving.
                      Changes to voice part or choir type may affect the
                      choiristor's role and responsibilities in the choir.
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditChoirMember;
