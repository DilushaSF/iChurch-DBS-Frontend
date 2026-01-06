import {useState, useEffect} from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {eventSchedulerAPI} from "../../services/api";
import EventModal from "./EventModal";
import EventDetailsModal from "./EventDetailsModal";
import type {EventSchedule} from "../../types/event.types";

const EventCalendar = () => {
  const [events, setEvents] = useState<EventSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  states of modal
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventSchedule | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  // Fetch all events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventSchedulerAPI.getAllEvents();
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Transform events for FullCalendar
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    allDay: event.allDay,
    backgroundColor: event.color || "#3981f5ff",
    borderColor: event.color || "#3880f3ff",
    extendedProps: {
      description: event.description,
      location: event.location,
      category: event.category,
    },
  }));

  useEffect(() => {
    console.log("events updated", calendarEvents.length);
  }, [events]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setSelectedEvent(null);
    setEditMode(false);
    setOpenEventModal(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setOpenDetailsModal(true);
    }
  };

  // add event click function
  const addEvent = () => {
    setSelectedDate(new Date().toISOString());
    setSelectedEvent(null);
    setEditMode(false);
    setOpenEventModal(true);
  };

  // Events editing detail
  const editEvent = () => {
    setOpenDetailsModal(false);
    setEditMode(true);
    setOpenEventModal(true);
  };

  // delete events
  const handleDelete = async (eventId: string) => {
    try {
      await eventSchedulerAPI.deleteEvent(eventId);
      setOpenDetailsModal(false);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event. Please try again.");
    }
  };

  // Adding or Editing events
  const submitForm = async () => {
    setOpenEventModal(false);
    setSelectedEvent(null);
    setEditMode(false);

    await fetchEvents();
  };

  return (
    <Box>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#ffffff",
        }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}>
          <Box>
            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
              <CalendarIcon sx={{fontSize: 32, color: "primary.main"}} />
              <Typography variant="h4" fontWeight={600}>
                Event Scheduler
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Schedule and manage your events
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addEvent}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
            }}>
            Add Event
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{mb: 3}} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{mb: 3, display: "flex", gap: 2, flexWrap: "wrap"}}>
          <Chip
            label="Mass"
            sx={{backgroundColor: "#3b82f6", color: "white"}}
            size="small"
          />
          <Chip
            label="Meeting"
            sx={{backgroundColor: "#ec4899", color: "white"}}
            size="small"
          />
          <Chip
            label="Special Event"
            sx={{backgroundColor: "#8b5cf6", color: "white"}}
            size="small"
          />
          <Chip
            label="Other"
            sx={{backgroundColor: "#10b981", color: "white"}}
            size="small"
          />
        </Box>

        {/* Calendar */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
            }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              "& .fc": {fontFamily: "inherit"},
              "& .fc-button": {textTransform: "none", padding: "8px 16px"},
              "& .fc-toolbar-title": {fontSize: "1.5rem", fontWeight: 600},
              "& .fc-daygrid-day-number": {
                padding: "8px",
                fontSize: "0.875rem",
              },
              "& .fc-event": {
                cursor: "pointer",
                borderRadius: "4px",
                padding: "2px 4px",
                fontSize: "0.875rem",
              },
              "& .fc-event:hover": {opacity: 0.8},
              "& .fc-day-today": {backgroundColor: "#eff6ff !important"},
            }}>
            <FullCalendar
              key={events.length}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={calendarEvents}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              nowIndicator={true}
              navLinks={true}
            />
          </Box>
        )}
      </Paper>

      {/* Event Modal (Add/Edit) */}
      <EventModal
        open={openEventModal}
        onClose={() => {
          setOpenEventModal(false);
          setSelectedEvent(null);
          setEditMode(false);
        }}
        onSave={submitForm}
        event={selectedEvent}
        initialDate={selectedDate}
        editMode={editMode}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        open={openDetailsModal}
        onClose={() => {
          setOpenDetailsModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={editEvent}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default EventCalendar;
