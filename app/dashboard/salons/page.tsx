// app/dashboard/salons/page.tsx
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
  ClockIcon,  // ← Added this import
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ThreeScene from "../../components/ThreeScene";

export default function SalonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: true },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Status filter options
  const statusFilters = ["All", "Active", "Pending", "Inactive"];

  // All salons data
  const allSalons = [
    {
      id: 1,
      name: "Divine Braids",
      owner: "Nana Yaa",
      location: "London, UK",
      phone: "+44 20 1234 5678",
      email: "divine@braids.co.uk",
      status: "Active",
      rating: 4.8,
      bookings: 89,
      revenue: "£12,450",
      image: "💇‍♀️",
      verified: true,
      joined: "2026-01-15",
    },
    {
      id: 2,
      name: "Royal Twist",
      owner: "Ama Serwaa",
      location: "Birmingham, UK",
      phone: "+44 121 234 5678",
      email: "royal@twist.co.uk",
      status: "Pending",
      rating: 4.5,
      bookings: 56,
      revenue: "£8,230",
      image: "👑",
      verified: false,
      joined: "2026-02-20",
    },
    {
      id: 3,
      name: "Braids & Beauty",
      owner: "Efua Botwe",
      location: "Manchester, UK",
      phone: "+44 161 345 6789",
      email: "braids@beauty.co.uk",
      status: "Active",
      rating: 4.9,
      bookings: 112,
      revenue: "£18,750",
      image: "💅",
      verified: true,
      joined: "2025-11-10",
    },
    {
      id: 4,
      name: "Krown Braids",
      owner: "Akua Serwaa",
      location: "Leeds, UK",
      phone: "+44 113 456 7890",
      email: "krown@braids.co.uk",
      status: "Active",
      rating: 4.7,
      bookings: 78,
      revenue: "£10,890",
      image: "👸",
      verified: true,
      joined: "2026-01-05",
    },
    {
      id: 5,
      name: "Ghanaian Styles",
      owner: "Kwame Mensah",
      location: "Glasgow, UK",
      phone: "+44 141 567 8901",
      email: "ghanaian@styles.co.uk",
      status: "Inactive",
      rating: 4.2,
      bookings: 34,
      revenue: "£4,560",
      image: "🇬🇭",
      verified: false,
      joined: "2025-12-01",
    },
    {
      id: 6,
      name: "Afro Hair Hub",
      owner: "Adwoa Owusu",
      location: "London, UK",
      phone: "+44 20 9876 5432",
      email: "info@afrohairhub.co.uk",
      status: "Active",
      rating: 4.6,
      bookings: 67,
      revenue: "£9,340",
      image: "🌍",
      verified: true,
      joined: "2026-03-10",
    },
  ];

  // Filter salons based on search and status
  const filteredSalons = allSalons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || salon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: allSalons.length,
    active: allSalons.filter((s) => s.status === "Active").length,
    pending: allSalons.filter((s) => s.status === "Pending").length,
    inactive: allSalons.filter((s) => s.status === "Inactive").length,
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
      Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
      Inactive: "bg-red-500/20 text-red-400 border border-red-400/30",
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Pending":
        return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "Inactive":
        return <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const handleLogout = () => {
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
          <p className="text-sm text-blue-300/60">Loading salons...</p>
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
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">Salons</h1>
              <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">
                Manage all registered salons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10 text-xs sm:text-sm"
            >
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2">
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Salon</span>
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
                <p className="text-[8px] sm:text-[10px] text-yellow-400/50 uppercase tracking-wider">Pending</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-yellow-400">{stats.pending}</p>
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
                  placeholder="Search salons..."
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
                {filteredSalons.map((salon) => (
                  <div
                    key={salon.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl sm:text-2xl">
                          {salon.image}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white">{salon.name}</h3>
                          <p className="text-[10px] sm:text-xs text-blue-300/50">Owner: {salon.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {salon.verified && (
                          <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                        )}
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${getStatusBadge(salon.status)}`}>
                          {salon.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <PhoneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <EnvelopeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.email}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) =>
                            i < Math.floor(salon.rating) ? (
                              <StarIconSolid key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
                            ) : (
                              <StarIcon key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400/30" />
                            )
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/60">{salon.rating}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] sm:text-xs text-white/60">
                          <span className="text-white font-medium">{salon.bookings}</span> bookings
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/60">
                          Revenue: <span className="text-green-400 font-medium">{salon.revenue}</span>
                        </p>
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
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Salon</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">Owner</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">Location</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Bookings</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Rating</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Status</th>
                        <th className="pb-1.5 sm:pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalons.map((salon) => (
                        <tr key={salon.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs sm:text-sm">
                                {salon.image}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">{salon.name}</p>
                                <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate sm:hidden">{salon.owner}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">
                            {salon.owner}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">
                            {salon.location}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm font-medium text-white">
                            {salon.bookings}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {[...Array(5)].map((_, i) =>
                                i < Math.floor(salon.rating) ? (
                                  <StarIconSolid key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
                                ) : (
                                  <StarIcon key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400/30" />
                                )
                              )}
                              <span className="text-[10px] sm:text-xs text-white/60 ml-0.5 sm:ml-1">{salon.rating}</span>
                            </div>
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(salon.status)}`}>
                              {getStatusIcon(salon.status)}
                              {salon.status}
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

            {filteredSalons.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">🏪</div>
                <p className="text-sm sm:text-base text-white/60">No salons found</p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}