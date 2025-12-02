import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Repeat as RepeatIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import type {EventSchedule} from "../../types/event.types";
import {format} from "date-fns";

interface EventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  event: EventSchedule | null;
  onEdit: () => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal = ({
  open,
  onClose,
  event,
  onEdit,
  onDelete,
}: EventDetailsModalProps) => {
  if (!event) return null;

  const formatDateTime = (dateString: string, allDay: boolean) => {
    const date = new Date(dateString);
    if (allDay) {
      return format(date, "MMMM d, yyyy");
    }
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  const getCategoryLabel = (category?: string) => {
    const categories: {[key: string]: string} = {
      meeting: "Meeting",
      birthday: "Birthday",
      "church-service": "Church Service",
      holiday: "Holiday",
      other: "Other",
    };
    return categories[category || "other"] || "Other";
  };

  const getRecurrenceLabel = (recurrence?: string) => {
    const recurrences: {[key: string]: string} = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    };
    return recurrences[recurrence || "none"] || "Does not repeat";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          alignItems: "flex-start",
          pb: 2,
        }}>
        <Box sx={{flex: 1}}>
          <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: event.color || "#10b981",
              }}
            />
            <Typography variant="h5" fontWeight={600}>
              {event.title}
            </Typography>
          </Box>
          <Chip
            label={getCategoryLabel(event.category)}
            size="small"
            sx={{
              backgroundColor: event.color || "#10b981",
              color: "white",
              fontWeight: 500,
            }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Date & Time */}
          <Grid item xs={12}>
            <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
              <CalendarIcon sx={{color: "primary.main", mt: 0.5}} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDateTime(event.startDate, event.allDay)}
                </Typography>
                {event.startDate !== event.endDate && (
                  <Typography variant="body1" fontWeight={500}>
                    to {formatDateTime(event.endDate, event.allDay)}
                  </Typography>
                )}
                {event.allDay && (
                  <Chip
                    label="All day"
                    size="small"
                    sx={{mt: 1}}
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Grid>

          {/* Description */}
          {event.description && (
            <Grid item xs={12}>
              <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                <DescriptionIcon sx={{color: "primary.main", mt: 0.5}} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">{event.description}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Location */}
          {event.location && (
            <Grid item xs={12}>
              <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                <LocationIcon sx={{color: "primary.main", mt: 0.5}} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1">{event.location}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Recurrence */}
          {event.recurring &&
            event.recurrence &&
            event.recurrence !== "none" && (
              <Grid item xs={12}>
                <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                  <RepeatIcon sx={{color: "primary.main", mt: 0.5}} />
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom>
                      Recurrence
                    </Typography>
                    <Typography variant="body1">
                      {getRecurrenceLabel(event.recurrence)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

          {/* Reminder */}
          {event.reminder && event.reminderTime && (
            <Grid item xs={12}>
              <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}}>
                <NotificationsIcon sx={{color: "primary.main", mt: 0.5}} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom>
                    Reminder
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(event.reminderTime, false)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Metadata */}
          <Grid item xs={12}>
            <Divider sx={{my: 1}} />
            <Box sx={{display: "flex", gap: 3, mt: 2}}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {format(new Date(event.createdAt), "MMM d, yyyy")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {format(new Date(event.updatedAt), "MMM d, yyyy")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{p: 3, justifyContent: "space-between"}}>
        <Button
          onClick={() => onDelete(event.id)}
          color="error"
          startIcon={<DeleteIcon />}
          sx={{textTransform: "none"}}>
          Delete
        </Button>
        <Box sx={{display: "flex", gap: 2}}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{textTransform: "none", px: 3}}>
            Close
          </Button>
          <Button
            onClick={onEdit}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{textTransform: "none", px: 3}}>
            Edit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
