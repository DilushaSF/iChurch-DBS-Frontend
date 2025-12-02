import {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import {eventSchedulerAPI} from "../../services/api";
import type {
  EventSchedule,
  EventScheduleFormData,
} from "../../types/event.types";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  event?: EventSchedule | null;
  initialDate?: string;
  editMode?: boolean;
}

const eventTypes = [
  {value: "mass", label: "Mass", color: "#3b82f6"},
  {value: "meeting", label: "Meeting", color: "#ec4899"},
  {value: "holiday", label: "Special Event", color: "#f59e0b"},
  {value: "other", label: "Other Service", color: "#10b981"},
];

const recurrenceOptions = [
  {value: "none", label: "Does not repeat"},
  {value: "daily", label: "Daily"},
  {value: "weekly", label: "Weekly"},
  {value: "monthly", label: "Monthly"},
  {value: "yearly", label: "Yearly"},
];

const EventModal = ({
  open,
  onClose,
  onSave,
  event,
  initialDate,
  editMode = false,
}: EventModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventScheduleFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "other",
    color: "#10b981",
    allDay: false,
    recurring: false,
    recurrence: "none",
    reminder: false,
    reminderTime: "",
  });

  // use effect for Initialize form when event
  useEffect(() => {
    if (open) {
      if (event && editMode) {
        // Edit data
        setFormData({
          title: event.title,
          description: event.description || "",
          startDate: formatDateTimeForInput(event.startDate),
          endDate: formatDateTimeForInput(event.endDate),
          location: event.location || "",
          category: event.category || "other",
          color: event.color || "#10b981",
          allDay: event.allDay,
          recurring: event.recurring,
          recurrence: event.recurrence || "none",
          reminder: event.reminder,
          reminderTime: event.reminderTime
            ? formatDateTimeForInput(event.reminderTime)
            : "",
        });
      } else if (initialDate) {
        // Add data
        const startDateTime = new Date(initialDate);
        const endDateTime = new Date(initialDate);
        endDateTime.setHours(startDateTime.getHours() + 1);

        setFormData({
          title: "",
          description: "",
          startDate: formatDateTimeForInput(startDateTime.toISOString()),
          endDate: formatDateTimeForInput(endDateTime.toISOString()),
          location: "",
          category: "other",
          color: "#10b981",
          allDay: false,
          recurring: false,
          recurrence: "none",
          reminder: false,
          reminderTime: "",
        });
      }
    }
  }, [open, event, initialDate, editMode]);

  const formatDateTimeForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value, type} = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    const selectedCategory = eventTypes.find((c) => c.value === category);
    setFormData((prev) => ({
      ...prev,
      category,
      color: selectedCategory?.color || "#10b981",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        recurring: formData.recurrence !== "none",
        recurrence:
          formData.recurrence !== "none" ? formData.recurrence : undefined,
      };

      if (event && editMode) {
        await eventSchedulerAPI.updateEvent(event.id, submitData);
      } else {
        await eventSchedulerAPI.addEvent(submitData);
      }

      handleClose();
      onSave();
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      category: "other",
      color: "#10b981",
      allDay: false,
      recurring: false,
      recurrence: "none",
      reminder: false,
      reminderTime: "",
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <EventIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {editMode ? "Edit Event" : "Add New Event"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Enter event description (optional)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                {eventTypes.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: category.color,
                        }}
                      />
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location (optional)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date & Time"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
                InputLabelProps={{shrink: true}}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date & Time"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
                InputLabelProps={{shrink: true}}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              />
            </Grid>

            {/* All Day Switch */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="allDay"
                    checked={formData.allDay}
                    onChange={handleChange}
                  />
                }
                label="All day event"
              />
            </Grid>

            {/* Recurrence */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Recurrence"
                name="recurrence"
                value={formData.recurrence}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                  },
                }}>
                {recurrenceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Reminder Switch */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="reminder"
                    checked={formData.reminder}
                    onChange={handleChange}
                  />
                }
                label="Set reminder"
              />
            </Grid>

            {/* Reminder Time */}
            {formData.reminder && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reminder Time"
                  name="reminderTime"
                  type="datetime-local"
                  value={formData.reminderTime}
                  onChange={handleChange}
                  InputLabelProps={{shrink: true}}
                  helperText="Set when you want to be reminded"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{p: 3}}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{textTransform: "none", px: 3}}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{textTransform: "none", px: 3}}>
            {loading ? "Saving..." : editMode ? "Update Event" : "Add Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventModal;
