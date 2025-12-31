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
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import axios from "axios";
import {sundaySchoolAPI} from "../../services/api";
import type {SundaySchoolTeacher} from "../../types/sundaySchool.types";

const GRADES = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const EditSundaySchoolTeacher: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    appointedDate: "",
    address: "",
    contactNumber: "",
    className: "",
    remarks: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      fetchTeacherDetails();
    }
  }, [id]);

  const fetchTeacherDetails = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      const response = await sundaySchoolAPI.getTeacherById(id!);
      const teacher: SundaySchoolTeacher = response.data;

      // Converting  dates for input fields
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        dateOfBirth: teacher.dateOfBirth.split("T")[0],
        appointedDate: teacher.appointedDate.split("T")[0],
        address: teacher.address,
        contactNumber: teacher.contactNumber,
        className: teacher.className,
        remarks: teacher.remarks || "",
        isActive: teacher.isActive ?? true,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch Sunday school teacher. Please try again.");
      console.error("Error fetching teacher:", err);
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sundaySchoolAPI.editTeacher(id!, formData);
      navigate("/sunday-school-teachers");
    } catch (error) {
      console.error("Error updating Sunday school teacher:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update Sunday school teacher. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update Sunday school teacher. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/sunday-school-teachers");
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
              onClick={goBack}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Edit Teacher - {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the Sunday school teacher information
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

            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Teaching Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Teaching Information
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
                <InputLabel>Class/Grade</InputLabel>
                <Select
                  name="className"
                  value={formData.className}
                  label="Class/Grade"
                  onChange={(e) =>
                    handleSelectChange("className", e.target.value)
                  }>
                  {GRADES.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Additional notes or remarks"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: formData.isActive ? "#f0f9ff" : "#f6eabaff",
                  border: "1px solid",
                  borderColor: formData.isActive ? "#bfdbfe" : "#f4dc7fff",
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
                      Teaching Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.isActive
                        ? "This teacher is currently active and teaching"
                        : "This teacher is currently inactive"}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleSwitchChange}
                        color="primary"
                      />
                    }
                    label={formData.isActive ? "Active" : "Inactive"}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Information Box */}
            <Grid item xs={6}>
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
                  <SchoolIcon
                    sx={{color: "success.main", mt: 0.5, fontSize: 28}}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Update Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Make sure all information is accurate before saving.
                      Changes to the grade assignment or teaching status will
                      affect the teacher's class schedule.
                    </Typography>
                  </Box>
                </Box>
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

export default EditSundaySchoolTeacher;
