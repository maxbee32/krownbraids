// app/dashboard/bookings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../../components/ThreeScene";

export default function BookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: true },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Status filter options
  const statusFilters = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

  // All bookings data
  const allBookings = [
    {
      id: 1,
      customer: "Ama Mensah",
      salon: "Divine Braids",
      service: "Box Braids",
      date: "2026-08-06",
      time: "10:30 AM",
      status: "Confirmed",
      amount: "£150",
      phone: "+44 20 1234 5678",
      email: "ama@email.com",
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
      phone: "+44 121 234 5678",
      email: "esi@email.com",
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
      phone: "+44 161 345 6789",
      email: "nana@email.com",
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
      phone: "+44 113 456 7890",
      email: "abena@email.com",
    },
    {
      id: 5,
      customer: "Akua Serwaa",
      salon: "Ghanaian Styles",
      service: "Sisterlocks",
      date: "2026-08-04",
      time: "11:00 AM",
      status: "Confirmed",
      amount: "£300",
      phone: "+44 141 567 8901",
      email: "akua@email.com",
    },
    {
      id: 6,
      customer: "Kwame Mensah",
      salon: "Divine Braids",
      service: "Faux Locs",
      date: "2026-08-04",
      time: "3:00 PM",
      status: "Pending",
      amount: "£220",
      phone: "+44 20 9876 5432",
      email: "kwame@email.com",
    },
  ];

  // Filter bookings based on search and status
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter(b => b.status === "Confirmed").length,
    pending: allBookings.filter(b => b.status === "Pending").length,
    completed: allBookings.filter(b => b.status === "Completed").length,
    cancelled: allBookings.filter(b => b.status === "Cancelled").length,
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push("/");
      return;
    }
    setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Confirmed": return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Pending": return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Completed": return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Cancelled": return <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default: return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
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
          <p className="text-sm text-blue-300/60">Loading bookings...</p>
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
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">Bookings</h1>
              <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Manage all bookings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2">
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">New Booking</span>
            </button>
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
                  <span className="text-sm font-bold text-white">KROWNBRAIDS</span>
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
            {/* Stats Row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Confirmed</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.confirmed}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-yellow-400/50 uppercase tracking-wider">Pending</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10 hidden sm:block">
                <p className="text-[8px] sm:text-[10px] text-blue-400/50 uppercase tracking-wider">Completed</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-blue-400">{stats.completed}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10 hidden sm:block">
                <p className="text-[8px] sm:text-[10px] text-red-400/50 uppercase tracking-wider">Cancelled</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-7 sm:px-9 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                      filterStatus === status
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-blue-300/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full min-w-[600px] sm:min-w-full">
                  <thead>
                    <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Customer</th>
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">Salon</th>
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">Service</th>
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden lg:table-cell">Date</th>
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Amount</th>
                      <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Status</th>
                      <th className="pb-1.5 sm:pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold text-white flex-shrink-0">
                              {booking.customer.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">{booking.customer}</p>
                              <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate sm:hidden">{booking.salon}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">{booking.salon}</td>
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">{booking.service}</td>
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden lg:table-cell">
                          {booking.date} <span className="text-blue-300/30">|</span> {booking.time}
                        </td>
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm font-medium text-white">{booking.amount}</td>
                        <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                          <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-1.5 sm:py-2 md:py-2.5">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                            <button className="p-1 rounded hover:bg-white/10 text-blue-300/50 hover:text-blue-300 transition-colors">
                              <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors">
                              <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors">
                              <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="text-4xl sm:text-5xl mb-3">📅</div>
                  <p className="text-sm sm:text-base text-white/60">No bookings found</p>
                  <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}