// app/dashboard/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  BellIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  CurrencyPoundIcon,
  ClockIcon,
  TrashIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  TruckIcon,
  ScissorsIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../../components/ThreeScene";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: true },
  ];

  // Admin settings tabs
  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
    { id: "preferences", label: "Preferences", icon: Cog6ToothIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push("/");
      return;
    }
    
    const storedData = localStorage.getItem('adminData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAdminData(parsed);
        setFormData({
          name: parsed.name || "Admin User",
          email: parsed.email || "admin@krownbraids.com",
          phone: parsed.phone || "+44 20 1234 5678",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
    
    setLoading(false);
  }, [router]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    showAlert('success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      showAlert('error', 'Password must be at least 8 characters');
      return;
    }
    showAlert('success', 'Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push("/");
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-sm text-blue-300/60">Loading admin settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
      <ThreeScene />

      <div className="relative z-10">
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white/60 hover:text-white transition-colors p-1"
            >
              <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Admin Settings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 border border-white/10">
              <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/50" />
              <span className="text-xs sm:text-sm text-white/80 hidden xs:inline">{adminData.name || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-56 xl:w-64 border-r border-white/10 p-3 xl:p-4 space-y-1 min-h-[calc(100vh-65px)]">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 xl:px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    item.current
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-blue-300/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                  {item.current && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-blue-950 to-indigo-950 z-50 lg:hidden p-4 border-r border-white/10 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ScissorsIcon className="h-6 w-6 text-cyan-400" />
                    <span className="text-sm font-bold text-white">KROWNBRAIDS</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          item.current
                            ? "bg-white/10 text-white border border-white/20"
                            : "text-blue-300/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-sm text-red-400/60 hover:text-red-400 transition-colors px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {/* Alert */}
            {alert && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${
                alert.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                  : 'bg-red-500/20 border border-red-400/30 text-red-400'
              }`}>
                {alert.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{alert.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 text-center mb-4">
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                    {adminData.name?.charAt(0) || "A"}
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-3">{adminData.name || "Admin User"}</h3>
                  <p className="text-xs text-blue-300/50">{adminData.email || "admin@krownbraids.com"}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-xs text-cyan-400">Super Admin</span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-white/10 text-white border border-white/20"
                            : "text-blue-300/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-red-500/20 p-4 mt-4">
                  <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Danger Zone</h4>
                  <button className="w-full mt-2 px-3 py-2 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
                    <TrashIcon className="h-4 w-4" />
                    Deactivate Account
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Full Name</label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Email Address</label>
                            <div className="relative">
                              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                              <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white/60 placeholder:text-blue-300/30 cursor-not-allowed"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Phone Number</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/30 text-sm">+44</span>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-12 pr-3 py-2 sm:py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Role</label>
                            <div className="relative">
                              <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                              <input
                                type="text"
                                value="Super Admin"
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white/60 placeholder:text-blue-300/30 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              Edit Profile
                            </button>
                          ) : (
                            <>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                                Save Changes
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </form>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 sm:mt-8 pt-6 border-t border-white/10">
                        <div>
                          <p className="text-xs text-blue-300/50">Account Created</p>
                          <p className="text-sm font-medium text-white">15 Jan 2026</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300/50">Last Login</p>
                          <p className="text-sm font-medium text-white">Today, 10:30 AM</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300/50">Admin Level</p>
                          <p className="text-sm font-medium text-white">Full Access</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300/50">Actions</p>
                          <button className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                            View Activity Log
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                        <div>
                          <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Current Password</label>
                          <div className="relative">
                            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                            <input
                              type="password"
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                              placeholder="Enter current password"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">New Password</label>
                          <div className="relative">
                            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                              placeholder="Enter new password"
                              required
                            />
                          </div>
                          <p className="text-xs text-blue-300/30 mt-1">Must be at least 8 characters</p>
                        </div>
                        <div>
                          <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
                          <div className="relative">
                            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-10 py-2 sm:py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                              placeholder="Confirm new password"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                          Update Password
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <GlobeAltIcon className="h-5 w-5 text-blue-300/50" />
                            <div>
                              <p className="text-sm font-medium text-white">Region</p>
                              <p className="text-xs text-blue-300/50">United Kingdom</p>
                            </div>
                          </div>
                          <select className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                            <option value="uk">United Kingdom</option>
                            <option value="us">United States</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <CurrencyPoundIcon className="h-5 w-5 text-blue-300/50" />
                            <div>
                              <p className="text-sm font-medium text-white">Currency</p>
                              <p className="text-xs text-blue-300/50">British Pound (£)</p>
                            </div>
                          </div>
                          <select className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                            <option value="gbp">£ GBP</option>
                            <option value="usd">$ USD</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <ClockIcon className="h-5 w-5 text-blue-300/50" />
                            <div>
                              <p className="text-sm font-medium text-white">Timezone</p>
                              <p className="text-xs text-blue-300/50">GMT (London)</p>
                            </div>
                          </div>
                          <select className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                            <option value="gmt">GMT (London)</option>
                            <option value="est">EST (New York)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <ComputerDesktopIcon className="h-5 w-5 text-blue-300/50" />
                            <div>
                              <p className="text-sm font-medium text-white">Theme</p>
                              <p className="text-xs text-blue-300/50">Dark Mode</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/10 border border-white/20 text-white">
                              <MoonIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/60 transition-colors">
                              <SunIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
                      <div className="space-y-3">
                        {[
                          { id: "bookings", label: "New Bookings", desc: "Get notified when a new booking is made" },
                          { id: "salons", label: "Salon Registrations", desc: "Get notified when a new salon registers" },
                          { id: "payments", label: "Payment Confirmations", desc: "Get notified when payments are completed" },
                          { id: "suppliers", label: "Supplier Updates", desc: "Get notified about supplier activity" },
                          { id: "system", label: "System Alerts", desc: "Important system notifications" },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                            <div>
                              <p className="text-sm font-medium text-white">{item.label}</p>
                              <p className="text-xs text-blue-300/50">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}