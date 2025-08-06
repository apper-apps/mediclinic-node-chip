import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const GuestLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create guest user session
      const guestUser = {
        id: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        role: 'patient'
      };
      
      // Store guest session (you might want to use localStorage or context)
      localStorage.setItem('currentUser', JSON.stringify(guestUser));
      
      toast.success("Welcome, Guest User!");
      navigate("/home");
    } catch (error) {
      toast.error("Failed to continue as guest");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToLogin}
            className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Heart" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Guest Access</h1>
          <p className="text-gray-600">Quick access without registration</p>
        </div>

        {/* Guest Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="UserX" className="w-10 h-10 text-accent-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Continue as Guest</h2>
            <p className="text-gray-600 text-sm">
              Access the app with limited features. You can browse appointments and basic information without creating an account.
            </p>
          </div>

          {/* Guest Features */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <ApperIcon name="Check" className="w-4 h-4 text-accent-500 mr-2" />
              Browse available appointments
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <ApperIcon name="Check" className="w-4 h-4 text-accent-500 mr-2" />
              View general medical information
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <ApperIcon name="Check" className="w-4 h-4 text-accent-500 mr-2" />
              Access basic app features
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="X" className="w-4 h-4 text-gray-400 mr-2" />
              Cannot book appointments
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="X" className="w-4 h-4 text-gray-400 mr-2" />
              Cannot save personal data
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGuestLogin}
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Accessing...
                </>
              ) : (
                <>
                  <ApperIcon name="ArrowRight" className="w-4 h-4 mr-2" />
                  Continue as Guest
                </>
              )}
            </Button>

            <Button
              onClick={handleBackToLogin}
              variant="outline"
              size="lg"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <ApperIcon name="Info" className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Create an account anytime to unlock full features including appointment booking and personal health records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLoginPage;