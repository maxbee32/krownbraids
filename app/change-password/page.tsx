// app/change-password/page.tsx
"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { 
  KeyIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../components/ThreeScene";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      if (!token || !adminData) {
        router.push("/");
        return;
      }

      try {
        const data = JSON.parse(adminData);
        if (data.passwordChangeRequired === false) {
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }

      setIsAuthorized(true);
      setIsLoadingAuth(false);
    };

    checkAuth();
  }, [router]);

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("one special character");
    return errors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      showAlert('error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }

    if (newPassword === oldPassword) {
      showAlert('error', 'New password must be different from current password');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showAlert('error', `Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        showAlert('error', 'Server error. Please try again later.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        showAlert('success', 'Password changed successfully! Redirecting to dashboard...');
        
        try {
          const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
          adminData.passwordChangeRequired = false;
          localStorage.setItem('adminData', JSON.stringify(adminData));
        } catch (error) {
          console.error("Error updating admin data:", error);
        }
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorMessage = data.message || data.error || "Failed to change password";
        showAlert('error', errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error("Change password error:", error);
      if (error instanceof Error && error.message === "Failed to fetch") {
        showAlert('error', 'Cannot connect to server. Please check your network connection.');
      } else {
        showAlert('error', 'An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setAlert(null);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        // Call the logout API
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          console.error("Logout API error:", await response.text());
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Always clear local storage and redirect, even if API fails
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push("/");
  };

  // Alert Portal component
  const AlertPortal = () => {
    if (!mounted || !alert) return null;
    
    return createPortal(
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] sm:w-[80%] md:w-auto min-w-[280px] max-w-md">
        <div className={`rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slideDown ${
          alert.type === 'success' ? 'bg-green-500/95 backdrop-blur-sm border border-green-400/30' :
          alert.type === 'error' ? 'bg-red-500/95 backdrop-blur-sm border border-red-400/30' :
          'bg-blue-500/95 backdrop-blur-sm border border-blue-400/30'
        }`}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{alert.message}</p>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>,
      document.body
    );
  };

  if (isLoadingAuth) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-sm text-blue-300/60">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      {/* Alert Portal - Renders at document.body level */}
      <AlertPortal />

      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 p-3 sm:p-4 md:p-6">
        
        {/* 3D Scene Background */}
        <ThreeScene />

        {/* Change Password Glass Card */}
        <div className="relative z-10 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[55%] xl:w-[45%] 2xl:w-[35%] max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Admin Badge */}
          <div className="absolute -top-2 right-3 sm:right-4 md:right-6">
            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[7px] sm:text-[9px] font-medium text-yellow-300 border border-yellow-400/30 backdrop-blur-sm">
              <ShieldCheckIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-1" />
              Password Reset
            </span>
          </div>

          {/* Logo/Brand */}
          <div className="flex flex-col items-center justify-center mb-1.5 sm:mb-2 md:mb-2.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30 border border-white/10">
              <KeyIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="mt-0.5 sm:mt-1 text-center">
              <h1 className="text-[10px] sm:text-xs md:text-sm font-bold text-white/80 tracking-wider">
                KROWNBRAIDS
              </h1>
              <p className="text-[6px] sm:text-[8px] text-yellow-300/50 tracking-[0.2em] uppercase">
                Security Update
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-1.5 sm:my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-2 text-[7px] sm:text-[9px] text-yellow-300/40">PASSWORD UPDATE REQUIRED</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">
              Change Password
            </h2>
            <p className="mt-0.5 text-[9px] sm:text-[10px] md:text-xs text-yellow-200/70">
              Please update your password to continue
            </p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-1 text-[8px] sm:text-[10px] text-yellow-300/50">
              <span className="flex items-center gap-0.5">
                <CheckCircleIcon className="h-2.5 w-2.5" /> 8+ chars
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircleIcon className="h-2.5 w-2.5" /> A-Z
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircleIcon className="h-2.5 w-2.5" /> a-z
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircleIcon className="h-2.5 w-2.5" /> 0-9
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircleIcon className="h-2.5 w-2.5" /> !@#
              </span>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
            {/* Current/Old Password */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-2.5">
                <KeyIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-300/50" />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-0 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 md:py-2.5 pl-7 sm:pl-8 pr-8 sm:pr-9 text-xs sm:text-sm text-white placeholder:text-yellow-200/40 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200 disabled:opacity-50"
                placeholder="Current Password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-2.5 text-yellow-300/40 hover:text-yellow-300/70 transition-colors"
              >
                {showOldPassword ? (
                  <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-2.5">
                <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-300/50" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-0 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 md:py-2.5 pl-7 sm:pl-8 pr-8 sm:pr-9 text-xs sm:text-sm text-white placeholder:text-yellow-200/40 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200 disabled:opacity-50"
                placeholder="New Password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-2.5 text-yellow-300/40 hover:text-yellow-300/70 transition-colors"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-2.5">
                <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-300/50" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-0 bg-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 md:py-2.5 pl-7 sm:pl-8 pr-8 sm:pr-9 text-xs sm:text-sm text-white placeholder:text-yellow-200/40 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200 disabled:opacity-50"
                placeholder="Confirm New Password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-2.5 text-yellow-300/40 hover:text-yellow-300/70 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      newPassword.length >= 8 && 
                      /[A-Z]/.test(newPassword) && 
                      /[a-z]/.test(newPassword) && 
                      /[0-9]/.test(newPassword) && 
                      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                        ? 'w-full bg-green-500'
                        : newPassword.length >= 6
                        ? 'w-2/3 bg-yellow-500'
                        : 'w-1/3 bg-red-500'
                    }`}
                  />
                </div>
                <p className="text-[8px] sm:text-[9px] text-yellow-300/40">
                  {newPassword.length >= 8 && 
                    /[A-Z]/.test(newPassword) && 
                    /[a-z]/.test(newPassword) && 
                    /[0-9]/.test(newPassword) && 
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                    ? '✅ Strong password'
                    : '💡 Password must meet all requirements above'}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button 
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {logoutLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Logout
                  </>
                )}
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-2 sm:mt-2.5 md:mt-3 text-center">
            <p className="text-[7px] sm:text-[9px] text-yellow-300/20 tracking-widest uppercase">
              🔒 Secure Password Update • Admin Only
            </p>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}