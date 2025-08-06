import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const user = await userService.login(formData.email, formData.password, userRole);
        toast.success(`Welcome back, ${user.name}!`);
        
        if (user.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/home");
        }
      } else {
        const user = await userService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        });
        toast.success(`Account created successfully! Welcome, ${user.name}`);
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

const fillDemoCredentials = (role) => {
    if (role === "patient") {
      setFormData({
        email: "patient@demo.com",
        password: "demo123",
        name: "",
        phone: ""
      });
    } else {
      setFormData({
        email: "doctor@demo.com",
        password: "demo123",
        name: "",
        phone: ""
      });
    }
    setUserRole(role);
    setIsLogin(true);
  };

  const handleGuestLogin = () => {
    navigate("/guest-login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Heart" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">MediClinic Pro</h1>
          <p className="text-gray-600">Your healthcare management companion</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Demo Credentials</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("patient")}
              className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ApperIcon name="User" className="w-3 h-3 mr-1" />
              Patient Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("doctor")}
              className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ApperIcon name="UserCheck" className="w-3 h-3 mr-1" />
              Doctor Demo
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Form Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </div>

          {/* Role Selection (Login only) */}
          {isLogin && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserRole("patient")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    userRole === "patient"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name="User" className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("doctor")}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    userRole === "doctor"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name="UserCheck" className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Doctor</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  placeholder="Enter your phone number"
                />
              </>
            )}

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Enter your password"
            />

<Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  <ApperIcon name={isLogin ? "LogIn" : "UserPlus"} className="w-4 h-4 mr-2" />
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGuestLogin}
              className="w-full mt-4 border-primary-200 text-primary-600 hover:bg-primary-50"
            >
              <ApperIcon name="UserX" className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;