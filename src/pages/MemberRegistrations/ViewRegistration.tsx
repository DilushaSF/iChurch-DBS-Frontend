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
  Card,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  FamilyRestroom as FamilyIcon,
  ChildCare as ChildIcon,
} from "@mui/icons-material";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {memberRegistrationAPI} from "../../services/api";
import type {
  MemberRegistration,
  Child,
} from "../../types/memberRegistration.types";

const ViewMemberRegistration = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<MemberRegistration | null>(null);

  useEffect(() => {
    if (id) {
      fetchMemberData();
    }
  }, [id]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await memberRegistrationAPI.getMemberById(id!);
      setMemberData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching member registration:", error);
      setError("Failed to load member registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/member-registrations");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
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

  if (error || !memberData) {
    return (
      <Box sx={{maxWidth: 1400, margin: "0 auto", p: 3}}>
        <Alert severity="error">
          {error || "Member registration not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{mt: 2, textTransform: "none"}}>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            View Member Registration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete family registration details
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Church Information Section */}
        <Box sx={{mb: 4}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
            <Typography variant="h6" fontWeight={600}>
              Church Information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Church"
                value={memberData.church}
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
          </Grid>
        </Box>

        {/* Father's Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Father's Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Father's Name"
                value={memberData.nameOfFather}
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
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Father's Occupation"
                value={memberData.occupationOfFather || "N/A"}
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
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Father's Date of Birth"
                value={formatDate(memberData.dateOfBirthFather)}
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
                label="Father's Baptised Date"
                value={formatDate(memberData.baptisedDateOfFather)}
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
                label="Father's Baptised Church"
                value={memberData.baptisedChurchOfFather || "N/A"}
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
          </Grid>
        </Box>

        {/* Mother's Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Mother's Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Mother's Name"
                value={memberData.nameOfMother}
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
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Mother's Occupation"
                value={memberData.occupationOfMother || "N/A"}
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
            <Grid item xs={12} md={4} sx={{mt: 2}}>
              <TextField
                fullWidth
                label="Mother's Date of Birth"
                value={formatDate(memberData.dateOfBirthOfMother)}
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
                label="Mother's Baptised Date"
                value={formatDate(memberData.baptisedDateOfMother)}
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
                label="Mother's Baptised Church"
                value={memberData.baptisedChurchOfMother || "N/A"}
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
          </Grid>
        </Box>

        {/* Contact & Marriage Information Section */}
        <Box sx={{mb: 4}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
            <Typography variant="h6" fontWeight={600}>
              Contact & Marriage Information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Address"
                value={memberData.address}
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
            <Grid item xs={12} md={3}>
              <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={memberData.contactNo}
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
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Married Church"
                value={memberData.marriedChurch || "N/A"}
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
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Married Date"
                value={formatDate(memberData.marriedDate)}
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
        </Box>

        {/* Donation Information Section */}
        <Box sx={{mb: 4}}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Donation Information
          </Typography>

          <Grid container spacing={3} pt={1}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Capable Donation Per Month"
                value={
                  memberData.capableDonationPerMonth
                    ? `LKR ${memberData.capableDonationPerMonth}`
                    : "N/A"
                }
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
          </Grid>
        </Box>

        <Divider sx={{my: 4}} />

        {/* Children Information Section */}
        <Box sx={{mb: 4}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <ChildIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Children Information
              </Typography>
            </Box>
            <Chip
              label={`${memberData.children?.length || 0} ${
                memberData.children?.length === 1 ? "Child" : "Children"
              }`}
              color="primary"
              sx={{fontWeight: 600}}
            />
          </Box>

          {memberData.children && memberData.children.length > 0 ? (
            <Grid container spacing={3}>
              {memberData.children.map((child: Child, index: number) => (
                <Grid item xs={12} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      p: 3,
                      background:
                        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      border: "1px solid",
                      borderColor: "#93c5fd",
                      borderRadius: 2,
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2.5,
                        pb: 1.5,
                        borderBottom: "2px solid",
                        borderColor: "#60a5fa",
                      }}>
                      <Box
                        sx={{
                          backgroundColor: "#3b82f6",
                          borderRadius: "50%",
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <ChildIcon sx={{color: "white", fontSize: 20}} />
                      </Box>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          color: "#1e40af",
                        }}>
                        Child {index + 1}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Child's Name"
                          value={child.nameOfChild}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          value={formatDate(child.dateOfBirthChild)}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Baptised Date"
                          value={formatDate(child.baptisedDateOfChild)}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Baptised Church"
                          value={child.baptisedChurchOfChild || "N/A"}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: "#f9fafb",
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                textAlign: "center",
              }}>
              <ChildIcon sx={{fontSize: 48, color: "#cbd5e1", mb: 1}} />
              <Typography variant="body1" color="text.secondary">
                No children information available
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Information Box */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#f0fdf4",
            border: "1px solid",
            borderColor: "#86efac",
            borderRadius: 1,
            mt: 3,
          }}>
          <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
            <FamilyIcon sx={{color: "success.main", mt: 0.5, fontSize: 28}} />
            <Box>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Family Registration Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a read-only view of the family registration. To make
                changes, click the "Edit Registration" button above.
              </Typography>
            </Box>
          </Box>
        </Paper>

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

export default ViewMemberRegistration;
