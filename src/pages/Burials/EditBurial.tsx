import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import axios from "axios";
import {burialAPI} from "../../services/api";
import type {Burial} from "../../types/burial.types";

const EditBurial: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameOfDeceased: "",
    dateOfDeath: "",
    dateOfBirth: "",
    dateWillBurry: "",
    baptized: false,
    caouseOfDeath: "",
    custodian: "",
  });

  useEffect(() => {
    if (id) {
      fetchBurialDetails();
    }
  }, [id]);

  const fetchBurialDetails = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      const response = await burialAPI.getBurialById(id!);
      const burial: Burial = response.data;

      // Convert dates to YYYY-MM-DD format for input fields
      setFormData({
        nameOfDeceased: burial.nameOfDeceased,
        dateOfDeath: burial.dateOfDeath.split("T")[0],
        dateOfBirth: burial.dateOfBirth.split("T")[0],
        dateWillBurry: burial.dateWillBurry.split("T")[0],
        baptized: burial.baptized === true,
        caouseOfDeath: burial.caouseOfDeath,
        custodian: burial.custodian || "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch burial record. Please try again.");
      console.error("Error fetching burial:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // this Converts t/f to "Yes"/"No"
      const submitData = {
        ...formData,
        baptized: formData.baptized ? true : false,
      };

      await burialAPI.updateBurial(id!, submitData);
      navigate("/burials");
    } catch (error) {
      console.error("Error updating burial record:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update burial record. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update burial record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/burials");
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

  // sx={{p: 3}}
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
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Edit Burial Record - {formData.nameOfDeceased}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the burial record information
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Deceased Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Deceased Person's Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of Deceased"
                name="nameOfDeceased"
                value={formData.nameOfDeceased}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter full name"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Custodian"
                name="custodian"
                value={formData.custodian}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter custodian name"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
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
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date of Death"
                name="dateOfDeath"
                type="date"
                value={formData.dateOfDeath}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Burial Date"
                name="dateWillBurry"
                type="date"
                value={formData.dateWillBurry}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Additional Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Additional Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cause of Death"
                name="caouseOfDeath"
                value={formData.caouseOfDeath}
                onChange={handleChange}
                required
                multiline
                rows={3}
                placeholder="Describe the reason for death"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.baptized}
                      onChange={handleChange}
                      name="baptized"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Baptized
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check if the deceased person was baptized
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Divider sx={{my: 4}} />

          <Box sx={{display: "flex", gap: 2, justifyContent: "flex-end"}}>
            <Button
              variant="outlined"
              onClick={goBack}
              disabled={loading}
              sx={{textTransform: "none", px: 4}}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{textTransform: "none", px: 4}}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditBurial;
