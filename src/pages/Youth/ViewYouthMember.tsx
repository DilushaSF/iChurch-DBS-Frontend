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
  GroupOutlined as YouthIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import {youthAPI} from "../../services/api";
import type {Youth} from "../../types/youth.types";

const ViewYouthMember: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [member, setMember] = useState<Youth | null>(null);
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
      const response = await youthAPI.getYouthMemberById(id!);
      setMember(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch youth member. Please try again.");
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/youth-association");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this youth member?")) {
      try {
        await youthAPI.deleteYouthMember(id!);
        navigate("/youth-association");
      } catch (err) {
        alert("Failed to delete youth member");
        console.error("Error deleting member:", err);
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
          {error || "Youth member not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
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
              onClick={handleBack}
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
                View Youth Member - {member.firstName} {member.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this youth member
              </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
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
              InputProps={{
                readOnly: true,
              }}
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
              value={formatDate(member.dateOfBirth)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Age"
              value={`${calculateAge(member.dateOfBirth)} years old`}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Contact Number"
              value={member.contactNumber}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
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
              value={member.address}
              InputProps={{
                readOnly: true,
              }}
              multiline
              rows={3}
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
              value={formatDate(member.joinedDate)}
              InputProps={{
                readOnly: true,
              }}
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
              label="Membership Duration"
              value={calculateMembershipDuration(member.joinedDate)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: member.position ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor: member.position ? "#bfdbfe" : "#fde68a",
                borderRadius: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  <YouthIcon
                    sx={{
                      color: member.position ? "primary.main" : "warning.main",
                      fontSize: 32,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Position
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.position
                        ? "Role within the youth association"
                        : "No specific position assigned"}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={member.position || "General Member"}
                  color={member.position ? "primary" : "default"}
                  sx={{fontWeight: 600, fontSize: "14px", px: 2}}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Membership Status Section */}
          <Grid item xs={6}>
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
                        ? "This member is currently active in the youth association"
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
              InputProps={{
                readOnly: true,
              }}
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
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
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
            onClick={handleBack}
            sx={{
              textTransform: "none",
              px: 4,
            }}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewYouthMember;
