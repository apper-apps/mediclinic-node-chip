import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = userService.getCurrentUser();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      await userService.update(currentUser.Id, formData);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || ""
    });
    setErrors({});
    setEditing(false);
  };

  const handleLogout = () => {
    userService.logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const profileStats = [
    {
      icon: "Calendar",
      label: "Total Appointments",
      value: "12",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: "FileText",
      label: "Medical Reports",
      value: "8",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: "Clock",
      label: "Account Age",
      value: "6 months",
      color: "text-purple-600 bg-purple-100"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon 
            name={currentUser?.role === "doctor" ? "UserCheck" : "User"} 
            className="w-10 h-10 text-white" 
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentUser?.name}</h1>
        <p className="text-gray-600 capitalize">{currentUser?.role}</p>
      </div>

      {/* Stats Cards */}
      {currentUser?.role === "patient" && (
        <div className="grid grid-cols-3 gap-4">
          {profileStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                  <ApperIcon name={stat.icon} className="w-5 h-5" />
                </div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {editing ? (
              <>
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="User" className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{currentUser?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Phone" className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{currentUser?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Shield" className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{currentUser?.role}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Bell" className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Notifications</span>
              </div>
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Privacy</span>
              </div>
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="HelpCircle" className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Help & Support</span>
              </div>
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="p-4">
          <Button
            onClick={handleLogout}
            variant="danger"
            size="lg"
            className="w-full"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;