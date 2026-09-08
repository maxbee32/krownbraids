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
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ScissorsIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ThreeScene from "../../components/ThreeScene";

// Types
interface Salon {
  id: number;
  name: string;
  ownerId: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerFullName: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  website: string;
  description: string;
  postalCode: string;
  state: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

export default function SalonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: true },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Users", icon: UserPlusIcon, href: "/dashboard/users", current: false },
    { name: "Categories", icon: TagIcon, href: "/dashboard/categories", current: false },
    { name: "Subscriptions", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Status filter options
  const statusFilters = ["All", "PENDING_APPROVAL", "APPROVED", "REJECTED"];

  // Show alert
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Fetch salons from API
  const fetchSalons = async () => {
    try {
      setLoadingSalons(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/auth/salon", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error('Failed to fetch salons');
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      
      // Handle different response formats
      let salonData = [];
      if (Array.isArray(data)) {
        salonData = data;
      } else if (data.data && Array.isArray(data.data)) {
        salonData = data.data;
      } else if (data.value && Array.isArray(data.value)) {
        salonData = data.value;
      } else {
        console.warn("Unexpected data format:", data);
        salonData = [];
      }
      
      console.log("Processed salon data:", salonData);
      console.log("Salon statuses:", salonData.map((s: Salon) => ({ id: s.id, name: s.name, status: s.status })));
      
      setSalons(salonData);
      setLoadingSalons(false);
    } catch (error) {
      console.error("Error fetching salons:", error);
      showAlert('error', 'Failed to fetch salons');
      setLoadingSalons(false);
    }
  };

  // Approve salon
  const handleApprove = async (salonId: number) => {
    try {
      setProcessingId(salonId);
      const token = localStorage.getItem('adminToken');
      
      console.log("Approving salon:", salonId);
      
      const response = await fetch(`/api/auth/salon/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ salonId }),
      });

      const data = await response.json();
      console.log("Approve response:", data);

      if (response.ok) {
        showAlert('success', `Salon approved successfully!`);
        // Wait a moment before refreshing to allow backend to update
        setTimeout(() => {
          fetchSalons();
        }, 500);
      } else {
        showAlert('error', data.message || 'Failed to approve salon');
      }
    } catch (error) {
      console.error("Error approving salon:", error);
      showAlert('error', 'Failed to approve salon');
    } finally {
      setProcessingId(null);
    }
  };

  // Reject salon
  const handleReject = async () => {
    if (!selectedSalonId || !rejectReason.trim()) {
      showAlert('error', 'Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(selectedSalonId);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/auth/salon/reject`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          salonId: selectedSalonId,
          rejectionReason: rejectReason 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', `Salon rejected successfully`);
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedSalonId(null);
        setTimeout(() => {
          fetchSalons();
        }, 500);
      } else {
        showAlert('error', data.message || 'Failed to reject salon');
      }
    } catch (error) {
      console.error("Error rejecting salon:", error);
      showAlert('error', 'Failed to reject salon');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter salons based on search and status
  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.ownerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || salon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats - Recalculate whenever salons change
  const stats = {
    total: salons.length,
    pending: salons.filter((s) => s.status === "PENDING_APPROVAL").length,
    approved: salons.filter((s) => s.status === "ACTIVE").length,
    rejected: salons.filter((s) => s.status === "REJECTED").length,
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }
    fetchSalons();
    setLoading(false);
  }, [router]);

  // Debug effect to log when salons change
  useEffect(() => {
    console.log("Salons updated:", salons);
    console.log("Stats:", stats);
  }, [salons]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: "bg-green-500/20 text-green-400 border border-green-400/30",
      PENDING_APPROVAL: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
      REJECTED: "bg-red-500/20 text-red-400 border border-red-400/30",
    };
    return styles[status] || styles.PENDING_APPROVAL;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "PENDING_APPROVAL":
        return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "REJECTED":
        return <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Approved";
      case "PENDING_APPROVAL":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
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
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Salons</p>
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
            <button
              onClick={fetchSalons}
              className="bg-white/10 hover:bg-white/20 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white/80 transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden xs:inline">Refresh</span>
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

        {/* Alert */}
        {alert && (
          <div className={`mx-3 sm:mx-4 md:mx-6 lg:mx-8 mt-2 p-3 rounded-xl flex items-center gap-3 ${
            alert.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/30 text-green-400'
              : alert.type === 'info'
              ? 'bg-blue-500/20 border border-blue-400/30 text-blue-400'
              : 'bg-red-500/20 border border-red-400/30 text-red-400'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <XCircleIcon className="h-5 w-5" />
            )}
            <span className="text-sm">{alert.message}</span>
            <button 
              onClick={() => setAlert(null)}
              className="ml-auto text-white/50 hover:text-white"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Approved</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-yellow-400/50 uppercase tracking-wider">Pending</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-red-400/50 uppercase tracking-wider">Rejected</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-red-400">{stats.rejected}</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search by name, owner, city, or email..."
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
                    {status === "PENDING_APPROVAL" ? "Pending" :
                     status === "ACTIVE" ? "Active" :
                     status === "REJECTED" ? "Rejected" : "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loadingSalons && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500/30 border-t-blue-500"></div>
                <p className="ml-3 text-sm text-blue-300/60">Loading salons...</p>
              </div>
            )}

            {/* Grid View */}
            {!loadingSalons && viewMode === "grid" && (
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
                          <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{salon.name}</h3>
                          <p className="text-[10px] sm:text-xs text-blue-300/50 truncate">
                            Owner: {salon.ownerFullName || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${getStatusBadge(salon.status)}`}>
                        {getStatusDisplay(salon.status)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.city || "N/A"}, {salon.country || "UK"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <PhoneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                        <EnvelopeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.email || "N/A"}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
                      <div className="text-left">
                        <p className="text-[10px] sm:text-xs text-white/60">
                          Joined: <span className="text-white">{formatDate(salon.createdAt)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] sm:text-xs text-white/60">
                          Owner ID: <span className="text-white font-medium">{salon.ownerId}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
<div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5">
  {salon.status === "PENDING_APPROVAL" && (
    <>
      <button
        onClick={() => handleApprove(salon.id)}
        disabled={processingId === salon.id}
        className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
      >
        {processingId === salon.id ? (
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <>
            <CheckCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Approve</span>
          </>
        )}
      </button>
      <button
        onClick={() => {
          setSelectedSalonId(salon.id);
          setShowRejectModal(true);
        }}
        disabled={processingId === salon.id}
        className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
      >
        <XCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span>Reject</span>
      </button>
    </>
  )}
  {salon.status !== "PENDING_APPROVAL" && (
    <>
      <button 
        onClick={() => router.push(`/dashboard/salons/${salon.id}`)}
        className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <EyeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden xs:inline">View</span>
      </button>
      <button 
        onClick={() => router.push(`/dashboard/salons/${salon.id}/edit`)}
        className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <PencilSquareIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden xs:inline">Edit</span>
      </button>
    </>
  )}
</div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {!loadingSalons && viewMode === "list" && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[700px] sm:min-w-full">
                    <thead>
                      <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Salon</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">Owner</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">Location</th>
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
                                <BuildingOfficeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">{salon.name}</p>
                                <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate sm:hidden">{salon.ownerFullName || "Unknown"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">
                            {salon.ownerFullName || "Unknown"}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">
                            {salon.city || "N/A"}, {salon.country || "UK"}
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                            <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(salon.status)}`}>
                              {getStatusIcon(salon.status)}
                              {getStatusDisplay(salon.status)}
                            </span>
                          </td>
                          <td className="py-1.5 sm:py-2 md:py-2.5">
  <div className="flex items-center justify-end gap-1 sm:gap-1.5">
    {salon.status === "PENDING_APPROVAL" && (
      <>
        <button
          onClick={() => handleApprove(salon.id)}
          disabled={processingId === salon.id}
          className="p-1 rounded hover:bg-green-500/20 text-green-400/70 hover:text-green-400 transition-colors disabled:opacity-50"
          title="Approve"
        >
          {processingId === salon.id ? (
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
        <button
          onClick={() => {
            setSelectedSalonId(salon.id);
            setShowRejectModal(true);
          }}
          disabled={processingId === salon.id}
          className="p-1 rounded hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Reject"
        >
          <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </>
    )}
    <button 
      onClick={() => router.push(`/dashboard/salons/${salon.id}`)}
      className="p-1 rounded hover:bg-white/10 text-blue-300/50 hover:text-blue-300 transition-colors"
      title="View"
    >
      <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </button>
    <button 
      onClick={() => router.push(`/dashboard/salons/${salon.id}/edit`)}
      className="p-1 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors"
      title="Edit"
    >
      <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

            {!loadingSalons && filteredSalons.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">🏪</div>
                <p className="text-sm sm:text-base text-white/60">No salons found</p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Reject Salon</h3>
            <p className="text-sm text-blue-300/60 mb-4">Please provide a reason for rejecting this salon.</p>
            <textarea
              className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-400/50 resize-none h-24"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedSalonId(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processingId !== null}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingId === selectedSalonId ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                ) : (
                  'Reject Salon'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}