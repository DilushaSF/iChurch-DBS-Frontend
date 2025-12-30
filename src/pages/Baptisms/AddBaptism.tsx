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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ChildFriendly as BaptismIcon,
} from "@mui/icons-material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {baptismAPI} from "../../services/api";
import type {BaptismFormData} from "../../types/baptism.types";

const AddBaptism = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await baptismAPI.addBaptism(formData);
      navigate("/baptisms");
    } catch (error) {
      console.error("Error creating baptism record:", error);

      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create baptism record. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create baptism record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/baptisms");
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
              onClick={handleCancel}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Add New Baptism Record
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to register a new baptism
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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

            {/* Baptism Info Section */}
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
                inputProps={{maxLength: 10}}
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
                    : "#fde587ff",
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
                    : "#fde587ff",
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
                      Baptism Registration
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
              onClick={handleCancel}
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
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBaptism;
