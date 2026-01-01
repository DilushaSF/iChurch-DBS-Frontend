import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  Collapse,
  Card,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ChildCare as ChildIcon,
} from "@mui/icons-material";
import {memberRegistrationAPI} from "../../services/api";
import type {
  MemberRegistration,
  Child,
} from "../../types/memberRegistration.types";

interface MemberRowProps {
  member: MemberRegistration;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  onView,
  onEdit,
  onDelete,
  formatDate,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{"& > *": {borderBottom: "unset"}}}>
        <TableCell>
          {member.children && member.children.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}>
              {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell sx={{fontWeight: 500}}>{member.nameOfFather}</TableCell>
        <TableCell>{member.nameOfMother}</TableCell>
        <TableCell>{member.church}</TableCell>
        <TableCell>{member.contactNo}</TableCell>
        <TableCell>{member.capableDonationPerMonth} LKR </TableCell>
        <TableCell>
          <Chip
            label={
              member.children && member.children.length > 0
                ? `${member.children.length} Child${
                    member.children.length > 1 ? "ren" : ""
                  }`
                : "No Children"
            }
            size="small"
            color={
              member.children && member.children.length > 0
                ? "success"
                : "default"
            }
            icon={
              member.children && member.children.length > 0 ? (
                <ChildIcon />
              ) : undefined
            }
          />
        </TableCell>
        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
            }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => onView(member._id)}
                sx={{
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}>
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Record">
              <IconButton
                size="small"
                onClick={() => onEdit(member._id)}
                sx={{
                  color: "info.main",
                  border: "1px solid",
                  borderColor: "info.main",
                  borderRadius: 1,
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: "info.main",
                    color: "white",
                  },
                }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Record">
              <IconButton
                size="small"
                onClick={() => onDelete(member._id)}
                sx={{
                  color: "error.main",
                  border: "1px solid",
                  borderColor: "error.main",
                  borderRadius: 1,
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Collapsible Children Section */}
      <TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{margin: 2}}>
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
                    Children Information
                  </Typography>
                  <Chip
                    label={`${member.children?.length || 0} ${
                      member.children?.length === 1 ? "Child" : "Children"
                    }`}
                    size="small"
                    sx={{
                      ml: "auto",
                      fontWeight: 600,
                      backgroundColor: "#3b82f6",
                      color: "white",
                    }}
                  />
                </Box>

                {member.children && member.children.length > 0 ? (
                  <TableContainer
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 1.5,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{backgroundColor: "#dbeafe"}}>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1e3a8a",
                              fontSize: "0.875rem",
                              py: 1.5,
                            }}>
                            #
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1e3a8a",
                              fontSize: "0.875rem",
                            }}>
                            Child Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1e3a8a",
                              fontSize: "0.875rem",
                            }}>
                            Date of Birth
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1e3a8a",
                              fontSize: "0.875rem",
                            }}>
                            Baptised Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              color: "#1e3a8a",
                              fontSize: "0.875rem",
                            }}>
                            Baptised Church
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {member.children.map((child: Child, index: number) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:hover": {backgroundColor: "#f0f9ff"},
                              "&:last-child td": {borderBottom: 0},
                            }}>
                            <TableCell
                              sx={{fontWeight: 600, color: "#6b7280", py: 1.5}}>
                              {index + 1}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{fontWeight: 600, color: "#111827"}}>
                              {child.nameOfChild}
                            </TableCell>
                            <TableCell sx={{color: "#374151"}}>
                              {formatDate(child.dateOfBirthChild)}
                            </TableCell>
                            <TableCell sx={{color: "#374151"}}>
                              {child.baptisedDateOfChild ? (
                                formatDate(child.baptisedDateOfChild)
                              ) : (
                                <Chip
                                  label="Not Baptised"
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: "#d1d5db",
                                    color: "#6b7280",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell sx={{color: "#374151"}}>
                              {child.baptisedChurchOfChild || (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#9ea5b1ff",
                                    fontStyle: "italic",
                                  }}>
                                  N/A
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      backgroundColor: "white",
                      borderRadius: 1.5,
                    }}>
                    <ChildIcon sx={{fontSize: 48, color: "#cbd5e1", mb: 1}} />
                    <Typography variant="body1" color="text.secondary">
                      No children information available
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MembersList: React.FC = () => {
  const [members, setMembers] = useState<MemberRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await memberRegistrationAPI.getAllMembers();
      setMembers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch member registrations. Please try again.");
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (
      window.confirm(
        "Are you sure you want to delete this member registration?"
      )
    ) {
      try {
        await memberRegistrationAPI.deleteMemberRegistration(id);
        setMembers(members.filter((member) => member._id !== id));
      } catch (err) {
        alert("Failed to delete member registration");
        console.error("Error deleting member:", err);
      }
    }
  };

  const viewMember = (id: string): void => {
    navigate(`/member-registrations/view/${id}`);
  };

  const editMember = (id: string): void => {
    navigate(`/member-registrations/edit/${id}`);
  };

  const addMember = (): void => {
    navigate("/member-registrations/add");
  };

  // Filter members based on search
  const filteredMembers = members.filter(
    (member) =>
      member.nameOfFather.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nameOfMother.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.church.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactNo.includes(searchTerm)
  );

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#ffffff",
        }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              gutterBottom>
              Member Registrations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all family member registrations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addMember}
            sx={{textTransform: "none", fontWeight: 500}}>
            Add Member Registration
          </Button>
        </Box>

        {/* Search Bar and Count */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}>
          <TextField
            placeholder="Search by father, mother, church or contact..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{minWidth: 400, maxWidth: 500}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Total Families:{" "}
            <Typography component="span" fontWeight={600} color="primary">
              {filteredMembers.length}
            </Typography>
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        {/* Members Table */}
        {filteredMembers.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: "#f9fafb",
              border: "2px dashed",
              borderColor: "divider",
            }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No member registrations found.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addMember}
              sx={{mt: 2, textTransform: "none"}}>
              Add First Registration
            </Button>
          </Card>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}>
            <Table sx={{minWidth: 900}}>
              <TableHead>
                <TableRow sx={{backgroundColor: "#f9fafb"}}>
                  <TableCell sx={{width: 50}} />
                  <TableCell sx={{fontWeight: 600}}>Father's Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Mother's Name</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Church</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Contact No</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Monthly Donation</TableCell>
                  <TableCell sx={{fontWeight: 600}}>Children</TableCell>
                  <TableCell sx={{fontWeight: 600}} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <MemberRow
                    key={member._id}
                    member={member}
                    onView={viewMember}
                    onEdit={editMember}
                    onDelete={handleDelete}
                    formatDate={formatDate}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default MembersList;
