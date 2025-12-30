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
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {unitLeaderAPI, zonalLeaderAPI} from "../../services/api";
import type {ZonalNumber} from "../../types/unitLeader.types";
import type {ZonalLeader} from "../../types/zonalLeader.types";

const AddUnitLeader = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingZonalLeader, setLoadingZonalLeader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zonalLeaders, setZonalLeaders] = useState<ZonalLeader[]>([]);
  const [selectedZonalLeader, setSelectedZonalLeader] =
    useState<ZonalLeader | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    contactNumber: "",
    appointedDate: "",
    zonalNumber: "" as ZonalNumber,
    unitNumber: "",
    zonalLeader: "",
  });

  // Fetch all zonal leaders
  useEffect(() => {
    fetchZonalLeaders();
  }, []);

  // Auto-load zonal leader according to the zone number
  useEffect(() => {
    if (formData.zonalNumber && zonalLeaders.length > 0) {
      fetchZonalLeaderByZone(formData.zonalNumber);
    }
  }, [formData.zonalNumber, zonalLeaders]);

  const fetchZonalLeaders = async () => {
    try {
      const response = await zonalLeaderAPI.getAllZonalLeaders();
      setZonalLeaders(response.data);
    } catch (err) {
      console.error("Error fetching zonal leaders:", err);
    }
  };

  const fetchZonalLeaderByZone = async (zoneNumber: ZonalNumber) => {
    setLoadingZonalLeader(true);
    try {
      // Find zonal leader for the selected zone
      const leader = zonalLeaders.find(
        (leader) => leader.zoneNumber === zoneNumber
      );

      if (leader) {
        setSelectedZonalLeader(leader);
        setFormData((prev) => ({
          ...prev,
          zonalLeader: leader._id,
        }));
      } else {
        setSelectedZonalLeader(null);
        setFormData((prev) => ({
          ...prev,
          zonalLeader: "",
        }));
      }
    } catch (err) {
      console.error("Error finding zonal leader:", err);
      setSelectedZonalLeader(null);
    } finally {
      setLoadingZonalLeader(false);
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

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await unitLeaderAPI.addUnitLeader(formData);
      navigate("/unit-leaders");
    } catch (error) {
      console.error("Error creating unit leader:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create unit leader. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create unit leader. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/unit-leaders");
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
              onClick={goBack}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Add New Unit Leader
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to add a new unit leader
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={submitForm}>
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
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
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
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter contact number"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
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
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Leadership Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Leadership Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Appointed Date"
                name="appointedDate"
                type="date"
                value={formData.appointedDate}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                required
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                required
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}>
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

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Unit Number"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter unit number (e.g., 1, 2, 3)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Zonal Leader Display Section */}
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
                    Loading zonal leader...
                  </Typography>
                </Paper>
              ) : selectedZonalLeader ? (
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
                    Assigned Zonal Leader
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedZonalLeader.firstName}{" "}
                    {selectedZonalLeader.lastName}
                  </Typography>
                  <Grid container spacing={2} sx={{mt: 1}}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Contact Number
                      </Typography>
                      <Typography variant="body2">
                        {selectedZonalLeader.contactNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Zone
                      </Typography>
                      <Typography variant="body2">
                        Zone {selectedZonalLeader.zoneNumber}
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
                    There is no zonal leader assigned to Zone{" "}
                    {formData.zonalNumber}. Please assign a zonal leader first
                    before adding unit leaders.
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Information Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#f0fdf4",
                  border: "1px solid",
                  borderColor: "#86efac",
                  borderRadius: 1,
                }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> The zonal leader is chosen
                  automatically based on the selected zone.
                </Typography>
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
              disabled={loading || !selectedZonalLeader}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{textTransform: "none", px: 4}}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddUnitLeader;
