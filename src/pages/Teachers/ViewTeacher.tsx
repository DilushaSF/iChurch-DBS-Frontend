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
  School as SchoolIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import {sundaySchoolAPI} from "../../services/api";
import type {SundaySchoolTeacher} from "../../types/sundaySchool.types";

const ViewSundaySchoolTeacher: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [teacher, setTeacher] = useState<SundaySchoolTeacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTeacherDetails();
    }
  }, [id]);

  const fetchTeacherDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await sundaySchoolAPI.getTeacherById(id!);
      setTeacher(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Sunday school teacher. Please try again.");
      console.error("Error fetching teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/sunday-school-teachers");
  };

  const deleteRecord = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this Sunday school teacher?"
      )
    ) {
      try {
        await sundaySchoolAPI.deleteTeacher(id!);
        navigate("/sunday-school-teachers");
      } catch (err) {
        alert("Failed to delete Sunday school teacher");
        console.error("Error deleting teacher:", err);
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

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateTeachingDuration = (appointedDate: string): string => {
    const today = new Date();
    const appointed = new Date(appointedDate);
    const years = today.getFullYear() - appointed.getFullYear();
    const months = today.getMonth() - appointed.getMonth();

    let totalMonths = years * 12 + months;
    if (today.getDate() < appointed.getDate()) {
      totalMonths--;
    }

    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    if (displayYears > 0 && displayMonths > 0) {
      return `${displayYears} year${
        displayYears > 1 ? "s" : ""
      }, ${displayMonths} month${displayMonths > 1 ? "s" : ""}`;
    } else if (displayYears > 0) {
      return `${displayYears} year${displayYears > 1 ? "s" : ""}`;
    } else {
      return `${displayMonths} month${displayMonths > 1 ? "s" : ""}`;
    }
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

  if (error || !teacher) {
    return (
      <Box sx={{p: 3}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Sunday school teacher not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
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
              onClick={goBack}
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
                View Teacher - {teacher.firstName} {teacher.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this Sunday school teacher
              </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={deleteRecord}
                sx={{textTransform: "none"}}>
                Delete
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Personal Information Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Full Name"
              value={`${teacher.firstName} ${teacher.lastName}`}
              InputProps={{readOnly: true}}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#e0f2fe",
                  fontWeight: 600,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={formatDate(teacher.dateOfBirth)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Age"
              value={`${calculateAge(teacher.dateOfBirth)} years old`}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Contact Number"
              value={teacher.contactNumber}
              InputProps={{readOnly: true}}
              variant="outlined"
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Address"
              value={teacher.address}
              InputProps={{readOnly: true}}
              multiline
              rows={3}
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
              value={formatDate(teacher.appointedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Teaching Duration"
              value={calculateTeachingDuration(teacher.appointedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          {/* Remarks Section */}
          {teacher.remarks && (
            <Grid item xs={4}>
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
                  Remarks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teacher.remarks}
                </Typography>
              </Paper>
            </Grid>
          )}

          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#f0f9ff",
                border: "1px solid",
                borderColor: "#bfdbfe",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  <SchoolIcon sx={{color: "primary.main", fontSize: 32}} />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Class/Grade Assignment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teaching grade level
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={teacher.className}
                  color="primary"
                  sx={{fontWeight: 600, fontSize: "16px", px: 2, py: 2.5}}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Teaching Status Section */}
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: teacher.isActive ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor: teacher.isActive ? "#bfdbfe" : "#fde68a",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  {teacher.isActive ? (
                    <ActiveIcon sx={{color: "primary.main", fontSize: 32}} />
                  ) : (
                    <InactiveIcon sx={{color: "warning.main", fontSize: 32}} />
                  )}
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Teaching Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {teacher.isActive
                        ? "This teacher is currently active and teaching"
                        : "This teacher is currently inactive"}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={teacher.isActive ? "Active" : "Inactive"}
                  color={teacher.isActive ? "success" : "warning"}
                  sx={{fontWeight: 600, fontSize: "14px", px: 2}}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Metadata Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Divider sx={{mb: 3}} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Record Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Record Created"
              value={
                teacher.createdAt
                  ? new Date(teacher.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"
              }
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Updated"
              value={
                teacher.updatedAt
                  ? new Date(teacher.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"
              }
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Divider sx={{my: 4}} />

        <Box sx={{display: "flex", gap: 2, justifyContent: "flex-end"}}>
          <Button
            variant="outlined"
            onClick={goBack}
            sx={{textTransform: "none", px: 4}}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewSundaySchoolTeacher;
