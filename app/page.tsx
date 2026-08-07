// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { 
  EnvelopeIcon, 
  KeyIcon, 
  ShieldCheckIcon, 
  ScissorsIcon, 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from "@heroicons/react/24/outline";
import ThreeScene from "./components/ThreeScene";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showAlert('error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const rawResponse = await response.text();
      
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        showAlert('error', 'Server returned invalid response. Please try again.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        } else {
          showAlert('error', 'No token received from server');
          setLoading(false);
          return;
        }
        
        const userData = data.user || data.data?.user || {};
        userData.passwordChangeRequired = data.passwordChangeRequired || false;
        localStorage.setItem('adminData', JSON.stringify(userData));
        
        showAlert('success', 'Login successful! Redirecting...');
        
        if (data.passwordChangeRequired) {
          setTimeout(() => {
            router.push("/change-password");
          }, 1500);
        } else {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        let errorMessage = data.message || data.error || 'Login failed. Please try again.';
        
        if (response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (response.status === 404) {
          errorMessage = 'Account not found. Please contact support.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showAlert('error', errorMessage);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Failed to fetch") {
        showAlert('error', 'Cannot connect to server. Please check your connection.');
      } else {
        showAlert('error', 'An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  // Alert component using React Portal
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
            <p className="text-sm font-medium text-white whitespace-pre-wrap">{alert.message}</p>
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

  return (
    <>
      <AlertPortal />

      <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 p-4 sm:p-4 md:p-6">
        <ThreeScene />

        <div className="relative z-10 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[55%] xl:w-[45%] 2xl:w-[35%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 p-5 sm:p-5 md:p-6 lg:p-8">
          
          {/* Admin Badge */}
          <div className="absolute -top-2 right-3 sm:right-4 md:right-6">
            <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-1 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-[9px] font-medium text-blue-300 border border-blue-400/30 backdrop-blur-sm">
              <ShieldCheckIcon className="h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 mr-1" />
              Admin
            </span>
          </div>

          {/* Logo/Brand - Using Scissors Icon */}
          <div className="flex flex-col items-center justify-center mb-3 sm:mb-2 md:mb-2.5">
            <div className="flex h-14 w-14 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 border border-white/10">
              <ScissorsIcon className="h-7 w-7 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="mt-1.5 sm:mt-1 text-center">
              <h1 className="text-sm sm:text-xs md:text-sm font-bold text-white/80 tracking-wider">
                KROWNBRAIDS
              </h1>
              <p className="text-[9px] sm:text-[8px] text-blue-300/50 tracking-[0.2em] uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-2 sm:my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-3 sm:mb-2.5 md:mb-3 lg:mb-4">
            <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">
              Admin Sign In
            </h2>
            <p className="mt-1 text-xs sm:text-[10px] md:text-xs text-blue-200/70">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-2.5 sm:space-y-2 md:space-y-2.5">
            {/* Email Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-2.5">
                <EnvelopeIcon className="h-4 w-4 sm:h-4 sm:w-4 text-blue-300/50" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-0 bg-white/10 px-3 sm:px-3 py-2.5 sm:py-2 md:py-2.5 pl-9 sm:pl-8 text-sm sm:text-sm text-white placeholder:text-blue-200/40 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-200 disabled:opacity-50"
                placeholder="admin@krownbraids.com"
                inputMode="email"
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-2.5">
                <KeyIcon className="h-4 w-4 sm:h-4 sm:w-4 text-blue-300/50" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-0 bg-white/10 px-3 sm:px-3 py-2.5 sm:py-2 md:py-2.5 pl-9 sm:pl-8 pr-10 sm:pr-9 text-sm sm:text-sm text-white placeholder:text-blue-200/40 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-200 disabled:opacity-50"
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-2.5 text-blue-300/40 hover:text-blue-300/70 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-1.5 sm:gap-1.5 text-blue-200/60 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  className="h-3 w-3 sm:h-3 sm:w-3 rounded border-blue-400/30 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0" 
                />
                <span className="text-xs sm:text-xs">Keep me signed in</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 sm:py-2 md:py-2.5 text-sm sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Admin Footer */}
          <div className="mt-3 sm:mt-2.5 md:mt-3 text-center">
            <p className="text-[9px] sm:text-[9px] text-blue-300/30 tracking-widest uppercase">
              🔒 Secure • Encrypted • Admin Only
            </p>
          </div>
        </div>
      </div>

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