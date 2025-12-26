import {useState, useEffect} from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Wc,
  FamilyRestroom,
  Event as EventIcon,
  ChildCare,
  Healing,
  Groups,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import {
  baptismAPI,
  burialAPI,
  marriageAPI,
  memberRegistrationAPI,
  unitLeaderAPI,
  zonalLeaderAPI,
  eventSchedulerAPI,
  youthAPI,
  choirAPI,
  sundaySchoolAPI,
} from "../../services/api";

interface DashboardStats {
  baptisms: number;
  burials: number;
  marriages: number;
  families: number;
  unitLeaders: number;
  zonalLeaders: number;
  youthMembers: number;
  choiristors: number;
  teachers: number;
}

interface UpcomingEvent {
  // _id: string;
  title: string;
  startDate: string;
  category?: string;
  location?: string;
}

const Dashboard = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    baptisms: 0,
    burials: 0,
    marriages: 0,
    families: 0,
    unitLeaders: 0,
    zonalLeaders: 0,
    youthMembers: 0,
    choiristors: 0,
    teachers: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        baptismsRes,
        burialsRes,
        marriagesRes,
        familiesRes,
        eventsRes,
        unitLeadersRes,
        zonalLeadersRes,
        youthMembersRes,
        choiristorsRes,
        teachersRes,
      ] = await Promise.all([
        baptismAPI.getAllBaptisms(),
        burialAPI.getAllBurials(),
        marriageAPI.getAllMarriages(),
        memberRegistrationAPI.getAllMembers(),
        eventSchedulerAPI.getAllEvents(),
        unitLeaderAPI.getAllUnitLeaders(),
        zonalLeaderAPI.getAllZonalLeaders(),
        youthAPI.getAllYouthMembers(),
        choirAPI.getAllChoiristors(),
        sundaySchoolAPI.getAllTeachers(),
      ]);

      setStats({
        baptisms: baptismsRes.data.length,
        burials: burialsRes.data.length,
        marriages: marriagesRes.data.length,
        families: familiesRes.data.length,
        unitLeaders: unitLeadersRes.data.length,
        zonalLeaders: zonalLeadersRes.data.length,
        youthMembers: youthMembersRes.data.length,
        choiristors: choiristorsRes.data.length,
        teachers: teachersRes.data.length,
      });

      // Filter upcoming events
      const today = new Date();
      const upcoming = eventsRes.data.filter(
        (event: UpcomingEvent) => new Date(event.startDate) >= today
      );

      setUpcomingEvents(upcoming);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", {month: "short"});
    return {day, month};
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statCards = [
    {
      title: "Baptisms",
      count: stats.baptisms,
      icon: <ChildCare sx={{fontSize: 60}} />,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      path: "/baptisms",
    },
    {
      title: "Burials",
      count: stats.burials,
      icon: <Healing sx={{fontSize: 60}} />,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      path: "/burials",
    },
    {
      title: "Marriages",
      count: stats.marriages,
      icon: <Wc sx={{fontSize: 60}} />,
      color: "#ec4899",
      bgColor: "#fdf2f8",
      path: "/marriages",
    },
    {
      title: "Families",
      count: stats.families,
      icon: <FamilyRestroom sx={{fontSize: 60}} />,
      color: "#10b981",
      bgColor: "#f0fdf4",
      path: "/member-registrations",
    },
    {
      title: "Zone Heads",
      count: stats.families,
      icon: <Groups sx={{fontSize: 60}} />,
      color: "#c6e81dff",
      bgColor: "#f0fdf4",
      path: "/member-registrations",
    },
    {
      title: "Unit Heads",
      count: stats.families,
      icon: <Groups sx={{fontSize: 60}} />,
      color: "#e8770dff",
      bgColor: "#fdf5f0ff",
      path: "/member-registrations",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
          border: "1px solid #e5e7eb",
        }}>
        <Typography variant="h4" fontWeight={700} sx={{mb: 1}}>
          Welcome Back — {user?.churchName}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          {user?.parishName} Parish Dashboard
        </Typography>

        <Typography
          variant="caption"
          sx={{color: "text.secondary", display: "block", mt: 1}}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Paper>

      <Grid container spacing={1} sx={{mb: 1}}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2} key={index}>
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                cursor: "pointer",
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: card.bgColor,
                transition: "0.3s",
                "&:hover": {boxShadow: "0px 4px 18px rgba(0,0,0,0.08)"},
              }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: card.bgColor,
                  color: card.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                {card.icon}
              </Box>

              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {card.count}
                </Typography>
                <Typography variant="body1" sx={{fontWeight: 800}}>
                  {card.title}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* UPCOMING EVENTS */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}>
              <Typography variant="h5" fontWeight={700}>
                Upcoming Events
              </Typography>

              <Chip
                label={`${upcomingEvents.length} Events`}
                color="primary"
                variant="outlined"
              />
            </Box>

            {upcomingEvents.length === 0 ? (
              <Box sx={{textAlign: "center", py: 5}}>
                <EventIcon
                  sx={{fontSize: 50, mb: 1, color: "text.secondary"}}
                />
                <Typography>No upcoming events</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {upcomingEvents.map((event, idx) => {
                  const {day, month} = formatDate(event.startDate);
                  return (
                    <Grid item xs={12} key={idx}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid #e5e7eb",
                          "&:hover": {
                            backgroundColor: "#f9fafb",
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => navigate("/events")}>
                        <Box sx={{display: "flex", gap: 2}}>
                          {/* Date */}
                          <Box
                            sx={{
                              width: 60,
                              borderRadius: 2,
                              textAlign: "center",
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              py: 1,
                            }}>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              sx={{color: "#2563eb"}}>
                              {day}
                            </Typography>
                            <Typography variant="body2" sx={{color: "#2563eb"}}>
                              {month}
                            </Typography>
                          </Box>

                          {/* Details */}
                          <Box sx={{flex: 1}}>
                            <Typography variant="h6" fontWeight={600}>
                              {event.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              ⏰ {formatTime(event.startDate)}
                            </Typography>

                            {event.location && (
                              <Typography
                                variant="body2"
                                color="text.secondary">
                                📍 {event.location}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}>
            <Typography variant="h5" fontWeight={700} sx={{mb: 2}}>
              Quick Info
            </Typography>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
              <Paper sx={{p: 2, borderRadius: 2}}>
                <Typography fontWeight={700}>Total Choiristors:</Typography>
                <Typography>{stats.choiristors}</Typography>
              </Paper>

              <Paper sx={{p: 2, borderRadius: 2}}>
                <Typography fontWeight={700}>
                  Total Sunday School Teachers:
                </Typography>
                <Typography>{stats.teachers}</Typography>
              </Paper>

              <Paper sx={{p: 2, borderRadius: 2}}>
                <Typography fontWeight={700}>
                  Total in Youth Association:
                </Typography>
                <Typography>{stats.youthMembers}</Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
