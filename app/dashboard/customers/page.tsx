// app/dashboard/customers/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  TruckIcon,
  Cog6ToothIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  HeartIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ScissorsIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ThreeScene from "../../components/ThreeScene";

export default function CustomersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: true },
    { name: "Users", icon: UserPlusIcon, href: "/dashboard/users", current: false },
    { name: "Categories", icon: TagIcon, href: "/dashboard/categories", current: false },
    { name: "Subscriptions", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Status filter options
  const statusFilters = ["All", "Active", "Inactive", "New"];

  // All customers data
  const allCustomers = [
    {
      id: 1,
      name: "Ama Mensah",
      email: "ama@email.com",
      phone: "+44 20 1234 5678",
      location: "London, UK",
      status: "Active",
      bookings: 12,
      totalSpent: "£1,450",
      joined: "2026-01-15",
      avatar: "A",
      favoriteSalon: "Divine Braids",
      favoriteStyle: "Box Braids",
    },
    {
      id: 2,
      name: "Esi Osei",
      email: "esi@email.com",
      phone: "+44 121 234 5678",
      location: "Birmingham, UK",
      status: "Active",
      bookings: 8,
      totalSpent: "£980",
      joined: "2026-02-20",
      avatar: "E",
      favoriteSalon: "Royal Twist",
      favoriteStyle: "Knotless Braids",
    },
    {
      id: 3,
      name: "Nana Adwoa",
      email: "nana@email.com",
      phone: "+44 161 345 6789",
      location: "Manchester, UK",
      status: "New",
      bookings: 3,
      totalSpent: "£420",
      joined: "2026-08-01",
      avatar: "N",
      favoriteSalon: "Braids & Beauty",
      favoriteStyle: "Goddess Braids",
    },
    {
      id: 4,
      name: "Abena Kumi",
      email: "abena@email.com",
      phone: "+44 113 456 7890",
      location: "Leeds, UK",
      status: "Inactive",
      bookings: 5,
      totalSpent: "£560",
      joined: "2025-12-10",
      avatar: "A",
      favoriteSalon: "Krown Braids",
      favoriteStyle: "Crochet Braids",
    },
    {
      id: 5,
      name: "Akua Serwaa",
      email: "akua@email.com",
      phone: "+44 141 567 8901",
      location: "Glasgow, UK",
      status: "Active",
      bookings: 15,
      totalSpent: "£2,340",
      joined: "2025-11-05",
      avatar: "A",
      favoriteSalon: "Ghanaian Styles",
      favoriteStyle: "Sisterlocks",
    },
    {
      id: 6,
      name: "Kwame Mensah",
      email: "kwame@email.com",
      phone: "+44 20 9876 5432",
      location: "London, UK",
      status: "Active",
      bookings: 7,
      totalSpent: "£890",
      joined: "2026-03-10",
      avatar: "K",
      favoriteSalon: "Divine Braids",
      favoriteStyle: "Faux Locs",
    },
    {
      id: 7,
      name: "Adwoa Owusu",
      email: "adwoa@email.com",
      phone: "+44 161 456 7890",
      location: "Manchester, UK",
      status: "New",
      bookings: 2,
      totalSpent: "£250",
      joined: "2026-08-05",
      avatar: "A",
      favoriteSalon: "Braids & Beauty",
      favoriteStyle: "Butterfly Locs",
    },
  ];

  // Filter customers based on search and status
  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: allCustomers.length,
    active: allCustomers.filter((c) => c.status === "Active").length,
    inactive: allCustomers.filter((c) => c.status === "Inactive").length,
    new: allCustomers.filter((c) => c.status === "New").length,
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }
    setLoading(false);
  }, [router]);

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: "bg-green-500/20 text-green-400 border border-green-400/30",
      Inactive: "bg-red-500/20 text-red-400 border border-red-400/30",
      New: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
    };
    return styles[status as keyof typeof styles] || styles.Active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Inactive":
        return <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "New":
        return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      
      if (token) {
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

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-sm text-blue-300/60">Loading customers...</p>
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
            <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Customers</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10 text-xs sm:text-sm"
            >
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-green-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2">
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Customer</span>
            </button>
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
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Active</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-400/50 uppercase tracking-wider">New</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-blue-400">{stats.new}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-red-400/50 uppercase tracking-wider">Inactive</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-red-400">{stats.inactive}</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search customers..."
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

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-lg sm:text-xl font-bold text-white">
                          {customer.avatar}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white">{customer.name}</h3>
                          <p className="text-[10px] sm:text-xs text-blue-300/50">{customer.location}</p>
                        </div>
                      </div>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${getStatusBadge(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <EnvelopeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <PhoneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <HeartIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">Fav: {customer.favoriteSalon}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <ShoppingBagIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{customer.favoriteStyle}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
                      <div>
                        <p className="text-[10px] sm:text-xs text-white/60">
                          <span className="text-white font-medium">{customer.bookings}</span> bookings
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/60">
                          Joined: <span className="text-white/80">{customer.joined}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-green-400">{customer.totalSpent}</p>
                        <p className="text-[8px] sm:text-[10px] text-blue-300/40">Total spent</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5">
                      <button className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <EyeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">View</span>
                      </button>
                      <button className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <PencilSquareIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <TrashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[700px] sm:min-w-full">
                    <thead>
                      <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Customer</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">Email</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">Location</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Bookings</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Total Spent</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Status</th>
                        <th className="pb-1.5 sm:pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                                {customer.avatar}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">{customer.name}</p>
                                <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate sm:hidden">{customer.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">
                            {customer.email}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">
                            {customer.location}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm font-medium text-white">
                            {customer.bookings}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm font-medium text-green-400">
                            {customer.totalSpent}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(customer.status)}`}>
                              {getStatusIcon(customer.status)}
                              {customer.status}
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
              </div>
            )}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">👤</div>
                <p className="text-sm sm:text-base text-white/60">No customers found</p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}