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
  Skeleton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ChildFriendly as BaptismIcon,
} from "@mui/icons-material";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {baptismAPI} from "../../services/api";
import type {BaptismFormData} from "../../types/baptism.types";

const EditBaptism = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BaptismFormData>({
    childName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    dateOfBaptism: "",
    nameOfMother: "",
    nameOfFather: "",
    nameOfGodFather: "",
    nameOfGodMother: "",
    currentAddress: "",
    contactNumber: "",
    timeOfBaptism: "",
    areParentsMarried: true,
    isFatherCatholic: true,
  });

  const formatDateForInput = (
    dateString: string | undefined | null
  ): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Fetch baptism data
  useEffect(() => {
    const fetchBaptismData = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);
        const response = await baptismAPI.getBaptismById(id);
        const data = response.data;

        setFormData({
          childName: data.childName || "",
          dateOfBirth: formatDateForInput(data.dateOfBirth),
          placeOfBirth: data.placeOfBirth || "",
          dateOfBaptism: formatDateForInput(data.dateOfBaptism),
          nameOfMother: data.nameOfMother || "",
          nameOfFather: data.nameOfFather || "",
          nameOfGodFather: data.nameOfGodFather || "",
          nameOfGodMother: data.nameOfGodMother || "",
          currentAddress: data.currentAddress || "",
          contactNumber: data.contactNumber || "",
          timeOfBaptism: data.timeOfBaptism || "",
          areParentsMarried: data.areParentsMarried ?? true,
          isFatherCatholic: data.isFatherCatholic ?? true,
        });
      } catch (error) {
        console.error("Error fetching baptism data:", error);
        setError("Failed to load baptism data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBaptismData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;

    if (name === "contactNumber") {
      // digit only validation
      if (!/^\d*$/.test(value)) return;
      setFormData((prev) => ({
        ...prev,
        contactNumber: value,
      }));

      // length validation for contact number
      if (value.length !== 10) {
        setContactError("Contact number must be 10 digits");
      } else {
        setContactError(null);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await baptismAPI.editBaptism(id, formData);
      navigate("/baptisms");
    } catch (error) {
      console.error("Error updating baptism record:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update baptism record. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update baptism record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelUpdate = () => {
    navigate("/baptisms");
  };

  if (fetchLoading) {
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
          <Skeleton variant="text" width={300} height={40} sx={{mb: 2}} />
          <Skeleton variant="text" width={200} height={20} sx={{mb: 4}} />
          <Divider sx={{mb: 4}} />
          <Grid container spacing={3}>
            {[...Array(10)].map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            ))}
          </Grid>
        </Paper>
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
              onClick={cancelUpdate}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Edit Baptism Record - {formData.childName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the baptism information
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={submitForm}>
          <Grid container spacing={3}>
            {/* Child Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Child Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Child's/Person's Name"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter Child's/Person's full name"
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
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
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
                label="Place of Birth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter place of birth"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Baptism Details Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Baptism Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date of Baptism"
                name="dateOfBaptism"
                type="date"
                value={formData.dateOfBaptism}
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
                label="Time of Baptism"
                name="timeOfBaptism"
                type="time"
                value={formData.timeOfBaptism}
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

            {/* Parents Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Parents Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Name"
                name="nameOfFather"
                value={formData.nameOfFather}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter father's full name"
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
                label="Mother's Name"
                name="nameOfMother"
                value={formData.nameOfMother}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter mother's full name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Godparents Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Godparents Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Godfather's Name"
                name="nameOfGodFather"
                value={formData.nameOfGodFather}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter godfather's full name"
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
                label="Godmother's Name"
                name="nameOfGodMother"
                value={formData.nameOfGodMother}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter godmother's full name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Address"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                required
                multiline
                rows={3}
                placeholder="Enter full address"
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
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter 10 digit contact number"
                error={Boolean(contactError)}
                helperText={contactError || " "}
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

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: formData.areParentsMarried
                    ? "#f0f9ff"
                    : "#fef3c7",
                  border: "1px solid",
                  borderColor: formData.areParentsMarried
                    ? "#bfdbfe"
                    : "#fde68a",
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
                      Parents Marriage Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.areParentsMarried
                        ? "Parents are married"
                        : "Parents are not married"}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.areParentsMarried}
                        onChange={handleSwitchChange("areParentsMarried")}
                        color="primary"
                      />
                    }
                    label={
                      formData.areParentsMarried ? "Married" : "Not Married"
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: formData.isFatherCatholic
                    ? "#f0f9ff"
                    : "#fef3c7",
                  border: "1px solid",
                  borderColor: formData.isFatherCatholic
                    ? "#bfdbfe"
                    : "#f9e491ff",
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
                      Father's Religion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.isFatherCatholic
                        ? "Father is Catholic"
                        : "Father is not Catholic"}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFatherCatholic}
                        onChange={handleSwitchChange("isFatherCatholic")}
                        color="primary"
                      />
                    }
                    label={
                      formData.isFatherCatholic ? "Catholic" : "Non-Catholic"
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Information Box */}
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
                  <BaptismIcon
                    sx={{color: "success.main", mt: 0.5, fontSize: 28}}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Update Baptism Record
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please enter accurate information. All required fields
                      must be filled.
                    </Typography>
                  </Box>
                </Box>
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
              onClick={cancelUpdate}
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

export default EditBaptism;
