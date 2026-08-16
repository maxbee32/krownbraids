// app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyPoundIcon,
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScissorsIcon,
  Cog6ToothIcon,
  TruckIcon,
  StarIcon as StarIconOutline,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ThreeScene from "../components/ThreeScene";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: true },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Users", icon: UserPlusIcon, href: "/dashboard/users", current: false },
    { name: "Categories", icon: TagIcon, href: "/dashboard/categories", current: false },
    { name: "Subscriptions", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Stats data with click handlers
  const stats = [
    {
      title: "Total Bookings",
      value: "247",
      change: "+12.5%",
      trend: "up",
      icon: CalendarIcon,
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/bookings",
    },
    {
      title: "Total Salons",
      value: "156",
      change: "+5.2%",
      trend: "up",
      icon: BuildingOfficeIcon,
      color: "from-purple-500 to-pink-500",
      link: "/dashboard/salons",
    },
    {
      title: "Hair Suppliers",
      value: "89",
      change: "+8.7%",
      trend: "up",
      icon: TruckIcon,
      color: "from-amber-500 to-orange-500",
      link: "/dashboard/suppliers",
    },
    {
      title: "Total Customers",
      value: "1,284",
      change: "+18.3%",
      trend: "up",
      icon: UserGroupIcon,
      color: "from-green-500 to-emerald-500",
      link: "/dashboard/customers",
    },
    {
      title: "Revenue",
      value: "£45,230",
      change: "-2.4%",
      trend: "down",
      icon: CurrencyPoundIcon,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Recent bookings
  const recentBookings = [
    {
      id: 1,
      customer: "Ama Mensah",
      salon: "Divine Braids",
      service: "Box Braids",
      date: "2026-08-06",
      time: "10:30 AM",
      status: "Confirmed",
      amount: "£150",
    },
    {
      id: 2,
      customer: "Esi Osei",
      salon: "Royal Twist",
      service: "Knotless Braids",
      date: "2026-08-06",
      time: "1:00 PM",
      status: "Pending",
      amount: "£200",
    },
    {
      id: 3,
      customer: "Nana Adwoa",
      salon: "Braids & Beauty",
      service: "Goddess Braids",
      date: "2026-08-05",
      time: "9:00 AM",
      status: "Completed",
      amount: "£250",
    },
    {
      id: 4,
      customer: "Abena Kumi",
      salon: "Krown Braids",
      service: "Crochet Braids",
      date: "2026-08-05",
      time: "2:30 PM",
      status: "Cancelled",
      amount: "£180",
    },
  ];

  // Pending approvals with quick actions
  const pendingApprovals = [
    { id: 1, name: "Royal Twist", owner: "Ama Serwaa", type: "Salon Registration", date: "2026-08-06" },
    { id: 2, name: "Afro Hair Supplies UK", owner: "Kwame Osei", type: "Supplier Registration", date: "2026-08-06" },
    { id: 3, name: "Braids & Beauty", owner: "Efua Botwe", type: "Salon Registration", date: "2026-08-05" },
  ];

  // Top salons
  const topSalons = [
    { name: "Divine Braids", bookings: 89, rating: 4.8 },
    { name: "Braids & Beauty", bookings: 112, rating: 4.9 },
    { name: "Krown Braids", bookings: 78, rating: 4.7 },
  ];

  // UK city distribution
  const ukCities = [
    { name: "London", count: 43, percentage: 70 },
    { name: "Birmingham", count: 28, percentage: 45 },
    { name: "Manchester", count: 19, percentage: 30 },
    { name: "Leeds", count: 15, percentage: 24 },
    { name: "Glasgow", count: 12, percentage: 19 },
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
        // Try to get the name from various possible field names
        const name = parsed.fullName || parsed.name || parsed.adminName || "Admin";
        setAdminName(name);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        setAdminName("Admin");
      }
    }

    // Set current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    setLoading(false);
    return () => clearInterval(interval);
  }, [router]);

  const getStatusBadge = (status: string) => {
    const styles = {
      Confirmed: "bg-green-500/20 text-green-400 border border-green-400/30",
      Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
      Completed: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
      Cancelled: "bg-red-500/20 text-red-400 border border-red-400/30",
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          <p className="text-sm text-blue-300/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 overflow-hidden">
      <ThreeScene />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 bg-white/5 backdrop-blur-md border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white/60 hover:text-white transition-colors p-1"
            >
              <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">UK Admin Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-300/40">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 border border-white/10">
              <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/50" />
              <span className="text-xs sm:text-sm text-white/80 hidden xs:inline">{adminName}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutLoading ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <ArrowRightOnRectangleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Sticky/Fixed */}
          <div className="hidden lg:block w-56 xl:w-64 border-r border-white/10 bg-gradient-to-b from-blue-950/50 to-indigo-950/50 backdrop-blur-sm flex-shrink-0 overflow-y-auto p-3 xl:p-4 space-y-1">
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
                    disabled={logoutLoading}
                    className="w-full text-sm text-red-400/60 hover:text-red-400 transition-colors px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-left flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {logoutLoading ? (
                      <svg className="animate-spin h-4 w-4 text-red-400/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {/* Welcome Section */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Welcome back, {adminName}! 👋</h2>
                  <p className="text-xs sm:text-sm text-blue-300/60 mt-0.5 sm:mt-1">
                    Here's what's happening with your salon booking platform today.
                  </p>
                </div>
                <button className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs text-white/80 transition-all">
                  <PlusIcon className="h-4 w-4" />
                  New Booking
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-2.5 sm:p-3 md:p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => stat.link && router.push(stat.link)}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`} />
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-blue-300/50 uppercase tracking-wider truncate">{stat.title}</p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold text-white mt-0.5 sm:mt-1">{stat.value}</p>
                        <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                          {stat.trend === "up" ? (
                            <ArrowTrendingUpIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-400" />
                          )}
                          <span className={`text-[8px] sm:text-xs ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} p-1.5 sm:p-2 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              {[
                { name: "Manage Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", color: "from-purple-500 to-pink-500", count: "156" },
                { name: "Hair Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", color: "from-amber-500 to-orange-500", count: "89" },
                { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", color: "from-green-500 to-emerald-500", count: "1,284" },
                { name: "Admin Settings", icon: Cog6ToothIcon, href: "/dashboard/admin", color: "from-blue-500 to-cyan-500", count: "⚙️" },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-2.5 sm:p-3 md:p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} p-1.5 sm:p-2 inline-block shadow-lg`}>
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">{item.count}</span>
                    </div>
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-white mt-1.5 sm:mt-2">{item.name}</h3>
                    <p className="hidden xs:block text-[8px] sm:text-[10px] md:text-xs text-blue-300/50">View & manage</p>
                  </Link>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Recent Bookings</h3>
                    <Link href="/dashboard/bookings" className="text-[10px] sm:text-xs text-blue-300/50 hover:text-white transition-colors flex items-center gap-1">
                      View All
                      <EyeIcon className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full min-w-[500px] sm:min-w-full">
                      <thead>
                        <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                          <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-4 font-medium">Customer</th>
                          <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-4 font-medium hidden sm:table-cell">Salon</th>
                          <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-4 font-medium hidden md:table-cell">Service</th>
                          <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-4 font-medium">Amount</th>
                          <th className="pb-1.5 sm:pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-1.5 sm:py-2 pr-2 sm:pr-4">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold text-white flex-shrink-0">
                                  {booking.customer.charAt(0)}
                                </div>
                                <span className="text-[10px] sm:text-xs md:text-sm text-white truncate">{booking.customer}</span>
                              </div>
                            </td>
                            <td className="py-1.5 sm:py-2 pr-2 sm:pr-4 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">{booking.salon}</td>
                            <td className="py-1.5 sm:py-2 pr-2 sm:pr-4 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">{booking.service}</td>
                            <td className="py-1.5 sm:py-2 pr-2 sm:pr-4 text-[10px] sm:text-xs md:text-sm font-medium text-white">{booking.amount}</td>
                            <td className="py-1.5 sm:py-2">
                              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Pending Approvals */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Pending Approvals</h3>
                    <span className="text-[10px] sm:text-xs text-yellow-400 bg-yellow-500/20 px-1.5 sm:px-2 py-0.5 rounded-full animate-pulse">3</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {pendingApprovals.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                          <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-[10px] sm:text-xs text-blue-300/50 truncate">{item.owner} • {item.type}</p>
                          <p className="text-[8px] sm:text-[10px] text-blue-300/30">{item.date}</p>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1">
                          <button className="p-0.5 sm:p-1 rounded hover:bg-green-500/20 text-green-400 transition-colors" title="Approve">
                            <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button className="p-0.5 sm:p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors" title="Reject">
                            <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 sm:mt-3 w-full text-center text-[10px] sm:text-xs text-blue-300/50 hover:text-white transition-colors">
                    View All Approvals →
                  </button>
                </div>

                {/* Top Salons */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 md:mb-4">🏆 Top Salons</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {topSalons.map((salon, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{salon.name}</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs text-blue-300/50">{salon.bookings} bookings</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                i < Math.floor(salon.rating) ? (
                                  <StarIconSolid key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
                                ) : (
                                  <StarIconOutline key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400/30" />
                                )
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-white/60">{salon.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UK Salon Distribution */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-semibold text-white">UK Salon Distribution</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {ukCities.map((city) => (
                      <div key={city.name}>
                        <div className="flex items-center justify-between text-[10px] sm:text-sm">
                          <span className="text-white/60">{city.name}</span>
                          <span className="text-white font-medium text-[10px] sm:text-sm">{city.count} salons</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5 sm:mt-1">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${city.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link 
                    href="/dashboard/salons" 
                    className="mt-3 sm:mt-4 block w-full text-center text-[10px] sm:text-xs text-blue-300/50 hover:text-white transition-colors"
                  >
                    View All Salons →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}