import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

import type {JSX} from "react";
import {useAuth} from "../../hooks/useAuth";

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: JSX.Element;
  color: string;
  bgColor: string;
}

interface Activity {
  title: string;
  name: string;
  time: string;
}

interface Event {
  title: string;
  date: string;
  time: string;
  attendees: number;
}

const Dashboard = () => {
  const {user} = useAuth();

  // mock data
  const stats: Stat[] = [
    {
      title: "Total Members",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: <PeopleIcon />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      title: "Upcoming Events",
      value: "24",
      change: "+5",
      trend: "up",
      icon: <EventIcon />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      title: "Monthly Donations",
      value: "$45,680",
      change: "+18%",
      trend: "up",
      icon: <MoneyIcon />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
    },
    {
      title: "Attendance Rate",
      value: "87%",
      change: "-3%",
      trend: "down",
      icon: <PeopleIcon />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
    },
  ];

  const recentActivities: Activity[] = [
    {
      title: "New member registered",
      name: "John Doe",
      time: "2 hours ago",
    },
    {
      title: "Event created",
      name: "Sunday Service",
      time: "5 hours ago",
    },
    {
      title: "Donation received",
      name: "$500 from Jane Smith",
      time: "1 day ago",
    },
    {
      title: "Volunteer signed up",
      name: "Mike Johnson",
      time: "2 days ago",
    },
  ];

  const upcomingEvents: Event[] = [
    {
      title: "Sunday Morning Service",
      date: "Nov 10, 2025",
      time: "9:00 AM",
      attendees: 245,
    },
    {
      title: "Youth Group Meeting",
      date: "Nov 12, 2025",
      time: "6:00 PM",
      attendees: 45,
    },
    {
      title: "Bible Study",
      date: "Nov 13, 2025",
      time: "7:00 PM",
      attendees: 67,
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{mb: 4}}>
        <Typography variant="h4" gutterBottom sx={{fontWeight: 600}}>
          Welcome back, {user?.churchName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your church today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{mb: 4}}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                },
              }}>
              <CardContent>
                <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56,
                    }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Box sx={{display: "flex", alignItems: "baseline", gap: 1}}>
                  <Typography variant="h4" sx={{fontWeight: 700}}>
                    {stat.value}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color:
                        stat.trend === "up" ? "success.main" : "error.main",
                    }}>
                    {stat.trend === "up" ? (
                      <TrendingUp fontSize="small" />
                    ) : (
                      <TrendingDown fontSize="small" />
                    )}
                    <Typography variant="body2" sx={{fontWeight: 600}}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
            <Typography variant="h6" gutterBottom sx={{fontWeight: 600, mb: 3}}>
              Recent Activities
            </Typography>
            <Box>
              {recentActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    pb: 2,
                    borderBottom:
                      index !== recentActivities.length - 1
                        ? "1px solid #e0e0e0"
                        : "none",
                  }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      width: 40,
                      height: 40,
                      mr: 2,
                    }}>
                    {activity.name.charAt(0)}
                  </Avatar>
                  <Box sx={{flexGrow: 1}}>
                    <Typography variant="body2" sx={{fontWeight: 600}}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
            <Typography variant="h6" gutterBottom sx={{fontWeight: 600, mb: 3}}>
              Upcoming Events
            </Typography>
            <Box>
              {upcomingEvents.map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    pb: 3,
                    borderBottom:
                      index !== upcomingEvents.length - 1
                        ? "1px solid #e0e0e0"
                        : "none",
                  }}>
                  <Typography variant="body1" sx={{fontWeight: 600, mb: 1}}>
                    {event.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{mb: 1}}>
                    {event.date} at {event.time}
                  </Typography>
                  <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Typography variant="caption" color="text.secondary">
                      Expected Attendees:
                    </Typography>
                    <Typography variant="caption" sx={{fontWeight: 600}}>
                      {event.attendees}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(event.attendees / 300) * 100}
                    sx={{mt: 1, height: 6, borderRadius: 3}}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
