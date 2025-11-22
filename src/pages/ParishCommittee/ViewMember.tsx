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
} from "@mui/icons-material";
import {parishCommitteeAPI} from "../../services/api";
import type {ParishCommittee} from "../../types/parishcCommittee.types";

const ViewParishCommitteeMember: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [member, setMember] = useState<ParishCommittee | null>(null);
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
      const response = await parishCommitteeAPI.getParishCommitteeMemberById(
        id!
      );
      setMember(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch parish committee member. Please try again.");
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/parish-committee");
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this parish committee member?"
      )
    ) {
      try {
        await parishCommitteeAPI.deleteParishCommitteeMember(id!);
        navigate("/parish-committee");
      } catch (err) {
        alert("Failed to delete parish committee member");
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
          {error || "Parish committee member not found"}
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
    <Box sx={{p: 3}}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#ffffff",
          maxWidth: 1200,
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
                Parish Committee Member Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this committee member
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

          <Grid item xs={12}>
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

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Address"
              value={member.address}
              InputProps={{
                readOnly: true,
              }}
              multiline
              rows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={member.phoneNumber || "N/A"}
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

          {/* Location Information Section */}
          <Grid item xs={12} sx={{mt: 2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Location Information
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Zonal Number
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Zone assignment
                  </Typography>
                </Box>
                <Chip
                  label={`Zonal ${member.zonalNumber}`}
                  color="primary"
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
                    Unit Number
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unit assignment
                  </Typography>
                </Box>
                <Chip
                  label={`Unit ${member.unitNumber}`}
                  color="warning"
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
                />
              </Box>
            </Paper>
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
              value={member.position || "N/A"}
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Representing Committee"
              value={member.representingCommittee}
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

export default ViewParishCommitteeMember;
