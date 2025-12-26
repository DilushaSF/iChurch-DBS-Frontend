import {useState} from "react";
import type {FormEvent, ChangeEvent} from "react";
import {useNavigate, Link} from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Church,
  Business,
} from "@mui/icons-material";
import backgroundImg from "../../assets/images/background.png";
import {useAuth} from "../../hooks/useAuth";

interface FormData {
  churchName: string;
  parishName: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const {register} = useAuth();

  const [formData, setFormData] = useState<FormData>({
    churchName: "",
    parishName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.churchName ||
      !formData.parishName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.churchName,
        formData.parishName,
        formData.email,
        formData.password
      );

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundImage: `linear-gradient(rgba(102, 126, 234, 0.5),rgba(118, 75, 162, 0.7)), url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 2,
      }}>
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}>
        <CardContent sx={{p: 4}}>
          <Box sx={{textAlign: "center", mb: 3}}>
            <Church sx={{fontSize: 60, color: "primary.main", mb: 1}} />
            <Typography variant="h4" gutterBottom>
              iChurch
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register your church account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{mb: 2}}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Church Name"
              name="churchName"
              value={formData.churchName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Church color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Parish Name"
              name="parishName"
              value={formData.parishName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{mt: 3, mb: 2, py: 1.5}}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <Divider sx={{my: 2}}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{textAlign: "center", mt: 2}}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 600,
                }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
