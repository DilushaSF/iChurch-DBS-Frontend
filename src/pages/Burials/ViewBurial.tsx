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
import {burialAPI} from "../../services/api";
import type {Burial} from "../../types/burial.types";

const ViewBurial: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [burial, setBurial] = useState<Burial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBurialDetails();
    }
  }, [id]);

  const fetchBurialDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await burialAPI.getBurialById(id!);
      setBurial(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch burial record. Please try again.");
      console.error("Error fetching burial:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/burials");
  };

  // const handleEdit = () => {
  //   navigate(`/burials/edit/${id}`);
  // };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this burial record?")) {
      try {
        await burialAPI.deleteBurial(id!);
        navigate("/burials");
      } catch (err) {
        alert("Failed to delete burial record");
        console.error("Error deleting burial:", err);
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

  if (error || !burial) {
    return (
      <Box sx={{p: 3}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error || "Burial record not found"}
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
                Burial Record Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete information about this burial record
              </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
              {/* <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{textTransform: "none"}}>
                Edit
              </Button> */}
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

        {/* Deceased Information Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Deceased Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name of Deceased"
              value={burial.nameOfDeceased}
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Custodian"
              value={burial.custodian || "N/A"}
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
              label="Date of Birth"
              value={formatDate(burial.dateOfBirth)}
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Date of Death"
              value={formatDate(burial.dateOfDeath)}
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Burial Date"
              value={formatDate(burial.dateWillBurry)}
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
              value={burial.caouseOfDeath}
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

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor:
                  burial.baptized === true ? "#f0f9ff" : "#fef3c7",
                border: "1px solid",
                borderColor: burial.baptized === true ? "#bfdbfe" : "#fde68a",
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
                    Baptism Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Indicates whether the deceased was baptized
                  </Typography>
                </Box>
                <Chip
                  label={burial.baptized}
                  color={burial.baptized === true ? "success" : "warning"}
                  sx={{fontWeight: 600, fontSize: "14px", px: 1}}
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
                burial.createdAt
                  ? new Date(burial.createdAt).toLocaleString("en-US", {
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
                burial.updatedAt
                  ? new Date(burial.updatedAt).toLocaleString("en-US", {
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
          {/* <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              textTransform: "none",
              px: 4,
            }}>
            Edit Record
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewBurial;
