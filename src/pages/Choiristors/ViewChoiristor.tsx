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
  MusicNote as MusicIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import {choirAPI} from "../../services/api";
import type {Choir} from "../../types/choir.types";

const ViewChoiristor: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [member, setMember] = useState<Choir | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

  const fetchMemberDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await choirAPI.getChoiristorById(id!);
      setMember(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch choiristor. Please try again.");
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/choiristors");
  };

  const deleteRecord = async () => {
    if (window.confirm("Are you sure you want to delete this choiristor?")) {
      try {
        await choirAPI.deleteChoiristor(id!);
        navigate("/choiristors");
      } catch (err) {
        alert("Failed to delete choiristor");
        console.error("Error deleting choiristor:", err);
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

  const calculateMembershipDuration = (joinedDate: string): string => {
    const today = new Date();
    const joined = new Date(joinedDate);
    const years = today.getFullYear() - joined.getFullYear();
    const months = today.getMonth() - joined.getMonth();

    let totalMonths = years * 12 + months;
    if (today.getDate() < joined.getDate()) {
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

  const getVoicePartColor = (
    voicePart: string
  ): "primary" | "secondary" | "success" | "warning" => {
    switch (voicePart) {
      case "Soprano":
        return "primary";
      case "Alto":
        return "secondary";
      case "Tenor":
        return "success";
      case "Bass":
        return "warning";
      default:
        return "primary";
    }
  };

  const getChoirTypeColor = (
    choirType: string
  ): "primary" | "secondary" | "success" => {
    switch (choirType) {
      case "Senior":
        return "primary";
      case "Junior":
        return "success";
      case "English":
        return "secondary";
      default:
        return "primary";
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

  if (error || !member) {
    return (
      <Box sx={{p: 3}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Choir member not found"}
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
                View Choiristor - {member.firstName} {member.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this choiristor
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
              value={`${member.firstName} ${member.lastName}`}
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

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={formatDate(member.dateOfBirth)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Age"
              value={`${calculateAge(member.dateOfBirth)} years old`}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Number"
              value={member.contactNumber}
              InputProps={{readOnly: true}}
              variant="outlined"
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Address"
              value={member.address}
              InputProps={{readOnly: true}}
              multiline
              rows={3}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
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
              value={formatDate(member.joinedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Membership Duration"
              value={calculateMembershipDuration(member.joinedDate)}
              InputProps={{readOnly: true}}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
            />
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Choir Type
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Choir assignment
                  </Typography>
                </Box>
                <Chip
                  label={`${member.choirType} Choir`}
                  color={getChoirTypeColor(member.choirType)}
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
                />
              </Box>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Vocal Part
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vocal range
                  </Typography>
                </Box>
                <Chip
                  label={member.voicePart}
                  color={getVoicePartColor(member.voicePart)}
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Instruments Section */}
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
                <Box sx={{flex: 1}}>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Instruments Played
                  </Typography>
                  {member.instrumentsPlayed &&
                  member.instrumentsPlayed.length > 0 ? (
                    <Box
                      sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 1}}>
                      {member.instrumentsPlayed.map((instrument, index) => (
                        <Chip
                          key={index}
                          label={instrument}
                          color="success"
                          variant="outlined"
                          sx={{fontWeight: 500}}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No instruments specified
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Membership Status Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: member.isActiveMember ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor: member.isActiveMember ? "#bfdbfe" : "#fde68a",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  {member.isActiveMember ? (
                    <ActiveIcon sx={{color: "primary.main", fontSize: 32}} />
                  ) : (
                    <InactiveIcon sx={{color: "warning.main", fontSize: 32}} />
                  )}
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Membership Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.isActiveMember
                        ? "This member is currently active in the choir"
                        : "This member is currently inactive"}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={member.isActiveMember ? "Active" : "Inactive"}
                  color={member.isActiveMember ? "success" : "warning"}
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
                member.createdAt
                  ? new Date(member.createdAt).toLocaleString("en-US", {
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
                member.updatedAt
                  ? new Date(member.updatedAt).toLocaleString("en-US", {
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

export default ViewChoiristor;
