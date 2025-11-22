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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import axios from "axios";
import {marriageAPI} from "../../services/api";
import type {Marriage, MassType, YesNo} from "../../types/marriage.types";

const EditMarriage: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameOfBride: "",
    nameOfGroom: "",
    dateOfMarriage: "",
    timeOfMass: "",
    shortenedCoupleName: "",
    massType: "Full" as MassType,
    needChurchChoir: "No" as YesNo,
    useChurchDecos: "No" as YesNo,
  });

  useEffect(() => {
    if (id) {
      fetchMarriageDetails();
    }
  }, [id]);

  const fetchMarriageDetails = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      const response = await marriageAPI.getMarriageById(id!);
      const marriage: Marriage = response.data;

      // Convert date to YYYY-MM-DD format for input field
      setFormData({
        nameOfBride: marriage.nameOfBride,
        nameOfGroom: marriage.nameOfGroom,
        dateOfMarriage: marriage.dateOfMarriage.split("T")[0],
        timeOfMass: marriage.timeOfMass,
        shortenedCoupleName: marriage.shortenedCoupleName,
        massType: marriage.massType,
        needChurchChoir: marriage.needChurchChoir,
        useChurchDecos: marriage.useChurchDecos,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch marriage record. Please try again.");
      console.error("Error fetching marriage:", err);
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
      await marriageAPI.updateMarriage(id!, formData);
      navigate("/marriages");
    } catch (error) {
      console.error("Error updating marriage record:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update marriage record. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update marriage record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/marriages");
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
            Edit Marriage Record - {formData.shortenedCoupleName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the marriage record information
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
            {/* Couple Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Couple Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name of Bride"
                name="nameOfBride"
                value={formData.nameOfBride}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter bride's full name"
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
                name="nameOfGroom"
                value={formData.nameOfGroom}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter groom's full name"
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
                name="shortenedCoupleName"
                value={formData.shortenedCoupleName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="e.g., John & Jane"
                helperText="This will be used for display purposes"
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
                name="dateOfMarriage"
                type="date"
                value={formData.dateOfMarriage}
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
                label="Time of Mass"
                name="timeOfMass"
                type="time"
                value={formData.timeOfMass}
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
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                <InputLabel>Mass Type</InputLabel>
                <Select
                  name="massType"
                  value={formData.massType}
                  label="Mass Type"
                  onChange={(e) =>
                    handleSelectChange("massType", e.target.value)
                  }>
                  <MenuItem value="Full">Full Mass</MenuItem>
                  <MenuItem value="Half">Half Mass</MenuItem>
                </Select>
              </FormControl>
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
                  backgroundColor: "#f0f9ff",
                  border: "1px solid",
                  borderColor: "#bfdbfe",
                  borderRadius: 1,
                }}>
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{fontWeight: 600, mb: 1, color: "text.primary"}}>
                    Need Church Choir?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="needChurchChoir"
                    value={formData.needChurchChoir}
                    onChange={handleChange}>
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
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
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{fontWeight: 600, mb: 1, color: "text.primary"}}>
                    Use Church Decorations?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="useChurchDecos"
                    value={formData.useChurchDecos}
                    onChange={handleChange}>
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
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

export default EditMarriage;
