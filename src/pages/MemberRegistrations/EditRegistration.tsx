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
  IconButton,
  Card,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FamilyRestroom as FamilyIcon,
  ChildCare as ChildIcon,
} from "@mui/icons-material";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {memberRegistrationAPI} from "../../services/api";
import type {Child} from "../../types/memberRegistration.types";

const EditMemberRegistration = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    church: "",
    nameOfFather: "",
    occupationOfFather: "",
    dateOfBirthFather: "",
    baptisedDateOfFather: "",
    baptisedChurchOfFather: "",
    nameOfMother: "",
    occupationOfMother: "",
    dateOfBirthOfMother: "",
    baptisedDateOfMother: "",
    baptisedChurchOfMother: "",
    address: "",
    contactNo: "",
    marriedDate: "",
    marriedChurch: "",
    capableDonationPerMonth: "",
  });

  const [children, setChildren] = useState<Child[]>([]);

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

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);
        const response = await memberRegistrationAPI.getMemberById(id);
        const data = response.data;

        setFormData({
          church: data.church || "",
          nameOfFather: data.nameOfFather || "",
          occupationOfFather: data.occupationOfFather || "",
          dateOfBirthFather: formatDateForInput(data.dateOfBirthFather),
          baptisedDateOfFather: formatDateForInput(data.baptisedDateOfFather),
          baptisedChurchOfFather: data.baptisedChurchOfFather || "",
          nameOfMother: data.nameOfMother || "",
          occupationOfMother: data.occupationOfMother || "",
          dateOfBirthOfMother: formatDateForInput(data.dateOfBirthOfMother),
          baptisedDateOfMother: formatDateForInput(data.baptisedDateOfMother),
          baptisedChurchOfMother: data.baptisedChurchOfMother || "",
          address: data.address || "",
          contactNo: data.contactNo || "",
          marriedDate: formatDateForInput(data.marriedDate),
          marriedChurch: data.marriedChurch || "",
          capableDonationPerMonth:
            data.capableDonationPerMonth?.toString() || "",
        });

        // Populate children data
        if (data.children && Array.isArray(data.children)) {
          const formattedChildren = data.children.map((child: Child) => ({
            nameOfChild: child.nameOfChild || "",
            dateOfBirthChild: formatDateForInput(child.dateOfBirthChild),
            baptisedDateOfChild: formatDateForInput(child.baptisedDateOfChild),
            baptisedChurchOfChild: child.baptisedChurchOfChild || "",
          }));
          setChildren(formattedChildren);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Failed to load member data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchMemberData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adding a new child
  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        nameOfChild: "",
        dateOfBirthChild: "",
        baptisedDateOfChild: "",
        baptisedChurchOfChild: "",
      },
    ]);
  };

  // Remove a child
  const handleRemoveChild = (index: number) => {
    const newChildren = children.filter((_, i) => i !== index);
    setChildren(newChildren);
  };

  // Update child data
  const handleChildChange = (
    index: number,
    field: keyof Child,
    value: string
  ) => {
    const newChildren = [...children];
    newChildren[index] = {
      ...newChildren[index],
      [field]: value,
    };
    setChildren(newChildren);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        capableDonationPerMonth: formData.capableDonationPerMonth
          ? parseFloat(formData.capableDonationPerMonth)
          : undefined,
        children: children.length > 0 ? children : undefined,
      };

      await memberRegistrationAPI.editMemberRegistration(id, submitData);
      navigate("/member-registrations");
    } catch (error) {
      console.error("Error updating member registration:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to update member registration. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update member registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/member-registrations");
  };

  // Loading skeleton
  if (fetchLoading) {
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
            maxWidth: 1400,
            margin: "0 auto",
          }}>
          <Skeleton variant="text" width={300} height={40} sx={{mb: 2}} />
          <Skeleton variant="text" width={200} height={20} sx={{mb: 4}} />
          <Divider sx={{mb: 4}} />
          <Grid container spacing={3}>
            {[...Array(10)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
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
              onClick={handleCancel}
              sx={{textTransform: "none"}}
              variant="outlined"
              size="small">
              Back to List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Edit Registration - {formData.nameOfFather}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the family details for this member registration
          </Typography>
        </Box>

        <Divider sx={{mb: 4}} />

        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Church Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Church Information
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Church"
                name="church"
                value={formData.church}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter church name"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Father's Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Father's Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="nameOfFather"
                value={formData.nameOfFather}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter father's full name"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Occupation"
                name="occupationOfFather"
                value={formData.occupationOfFather}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter occupation (optional)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Date of Birth"
                name="dateOfBirthFather"
                type="date"
                value={formData.dateOfBirthFather}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Baptised Church"
                name="baptisedChurchOfFather"
                value={formData.baptisedChurchOfFather}
                onChange={handleChange}
                variant="outlined"
                placeholder="Church name (optional)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Baptised Date"
                name="baptisedDateOfFather"
                type="date"
                value={formData.baptisedDateOfFather}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Mother's Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Mother's Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="nameOfMother"
                value={formData.nameOfMother}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter mother's full name"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Occupation"
                name="occupationOfMother"
                value={formData.occupationOfMother}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter occupation (optional)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mother's Date of Birth"
                name="dateOfBirthOfMother"
                type="date"
                value={formData.dateOfBirthOfMother}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="M's Baptised Church"
                name="baptisedChurchOfMother"
                value={formData.baptisedChurchOfMother}
                onChange={handleChange}
                variant="outlined"
                placeholder="Church name (optional)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mother's Baptised Date"
                name="baptisedDateOfMother"
                type="date"
                value={formData.baptisedDateOfMother}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Contact & Marriage Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contact & Marriage Information
              </Typography>
            </Grid>

            <Grid item xs={3}>
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

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Enter contact number"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Married Date"
                name="marriedDate"
                type="date"
                value={formData.marriedDate}
                onChange={handleChange}
                InputLabelProps={{shrink: true}}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Married Church"
                name="marriedChurch"
                value={formData.marriedChurch}
                onChange={handleChange}
                variant="outlined"
                placeholder="Church name (optional)"
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Donation Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Donation Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Capable Donation Per Month"
                name="capableDonationPerMonth"
                type="number"
                value={formData.capableDonationPerMonth}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter amount (optional)"
                helperText="Monthly donation capacity"
                InputProps={{
                  startAdornment: <Typography sx={{mr: 1}}>$</Typography>,
                }}
                sx={{"& .MuiOutlinedInput-root": {backgroundColor: "#f9fafb"}}}
              />
            </Grid>

            {/* Children Information Section */}
            <Grid item xs={12} sx={{mt: 2}}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography variant="h6" fontWeight={600}>
                  Children Information
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddChild}
                  sx={{textTransform: "none"}}>
                  Add Child
                </Button>
              </Box>
            </Grid>

            {children.length > 0 ? (
              children.map((child, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      backgroundColor: "#f0f9ff",
                      border: "1px solid",
                      borderColor: "#bfdbfe",
                      borderRadius: 2,
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <ChildIcon color="primary" />
                        Child {index + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveChild(index)}
                        size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Child's Name"
                          value={child.nameOfChild}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              "nameOfChild",
                              e.target.value
                            )
                          }
                          required
                          variant="outlined"
                          placeholder="Enter child's name"
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
                          type="date"
                          value={child.dateOfBirthChild}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              "dateOfBirthChild",
                              e.target.value
                            )
                          }
                          required
                          InputLabelProps={{shrink: true}}
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
                          type="date"
                          value={child.baptisedDateOfChild || ""}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              "baptisedDateOfChild",
                              e.target.value
                            )
                          }
                          InputLabelProps={{shrink: true}}
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
                          value={child.baptisedChurchOfChild || ""}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              "baptisedChurchOfChild",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          placeholder="Church name (optional)"
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
              ))
            ) : (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "#fef3c7",
                    border: "1px solid",
                    borderColor: "#fde68a",
                    borderRadius: 1,
                    textAlign: "center",
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    No children added yet. Click "Add Child" to add children
                    details.
                  </Typography>
                </Paper>
              </Grid>
            )}

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
                  <FamilyIcon
                    sx={{color: "success.main", mt: 0.5, fontSize: 28}}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      Editing Family Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update family information including parents and children.
                      All fields marked with * are required.
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
              onClick={handleCancel}
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

export default EditMemberRegistration;
