// app/dashboard/salons/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  TruckIcon,
  Cog6ToothIcon,
  ScissorsIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ThreeScene from "../../../components/ThreeScene";

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

export default function SalonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
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

  // Show alert
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Fetch salon details
  const fetchSalon = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(`/api/auth/salon/${salonId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          showAlert('error', 'Salon not found');
          setTimeout(() => router.push("/dashboard/salons"), 1500);
          return;
        }
        throw new Error('Failed to fetch salon details');
      }

      const data = await response.json();
      console.log("Salon details:", data);
      
      // Handle different response formats
      let salonData = data;
      if (data.data) {
        salonData = data.data;
      } else if (data.value) {
        salonData = data.value;
      }
      
      setSalon(salonData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salon:", error);
      showAlert('error', 'Failed to fetch salon details');
      setLoading(false);
    }
  };

  // Approve salon
  const handleApprove = async () => {
    if (!salon) return;
    
    try {
      setProcessingId(salon.id);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/auth/salon/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ salonId: salon.id }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', `Salon approved successfully!`);
        setTimeout(() => {
          fetchSalon();
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
    if (!salon || !rejectReason.trim()) {
      showAlert('error', 'Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(salon.id);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/auth/salon/reject`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          salonId: salon.id,
          rejectionReason: rejectReason 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', `Salon rejected successfully`);
        setShowRejectModal(false);
        setRejectReason("");
        setTimeout(() => {
          fetchSalon();
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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }
    fetchSalon();
  }, [salonId, router]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: "bg-green-500/20 text-green-400 border border-green-400/30",
      PENDING_APPROVAL: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
      REJECTED: "bg-red-500/20 text-red-400 border border-red-400/30",
    };
    return styles[status] || styles.PENDING_APPROVAL;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved";
      case "PENDING_APPROVAL":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case "PENDING_APPROVAL":
        return <ClockIcon className="h-6 w-6 text-yellow-400" />;
      case "REJECTED":
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-400" />;
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
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
          <p className="text-sm text-blue-300/60">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-white">Salon Not Found</h2>
          <p className="text-blue-300/60 mt-2">The salon you're looking for doesn't exist.</p>
          <Link href="/dashboard/salons" className="mt-4 inline-block px-6 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors">
            Back to Salons
          </Link>
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
            <Link href="/dashboard/salons" className="text-white/60 hover:text-white transition-colors">
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Salon Details</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => router.push(`/dashboard/salons/${salon.id}/edit`)}
              className="bg-white/10 hover:bg-white/20 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white/80 transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Edit</span>
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
          {/* Sidebar */}
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
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-blue-950 to-indigo-950 z-50 lg:hidden p-4 border-r border-white/10 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ScissorsIcon className="h-6 w-6 text-cyan-400" />
                    <span className="text-sm font-bold text-white">KROWNBRAIDS</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white transition-colors">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => (
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
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={() => { setSidebarOpen(false); handleLogout(); }}
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
            <div className="max-w-4xl mx-auto">
              {/* Salon Header */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl sm:text-4xl">
                      <BuildingOfficeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">{salon.name}</h1>
                      <p className="text-sm text-blue-300/50">Owner: {salon.ownerFullName || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusBadge(salon.status)}`}>
                      {getStatusIcon(salon.status)}
                      {getStatusDisplay(salon.status)}
                    </div>
                    {salon.status === "PENDING_APPROVAL" && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleApprove}
                          disabled={processingId === salon.id}
                          className="px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {processingId === salon.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          disabled={processingId === salon.id}
                          className="px-4 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Salon Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Business Information */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-cyan-400" />
                    Business Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-blue-300/50">Description</p>
                      <p className="text-sm text-white">{salon.description || "No description provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Website</p>
                      <p className="text-sm text-white">
                        {salon.website ? (
                          <a href={salon.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                            {salon.website}
                          </a>
                        ) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Joined</p>
                      <p className="text-sm text-white">{formatDate(salon.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Last Updated</p>
                      <p className="text-sm text-white">{formatDate(salon.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-cyan-400" />
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-blue-300/50">Email</p>
                      <p className="text-sm text-white">{salon.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Phone</p>
                      <p className="text-sm text-white">{salon.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Address</p>
                      <p className="text-sm text-white">
                        {salon.address || "N/A"}, {salon.city || "N/A"}, {salon.country || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Postal Code</p>
                      <p className="text-sm text-white">{salon.postalCode || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-cyan-400" />
                    Owner Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-blue-300/50">Full Name</p>
                      <p className="text-sm font-medium text-white">{salon.ownerFullName || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Owner ID</p>
                      <p className="text-sm text-white">{salon.ownerId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">First Name</p>
                      <p className="text-sm text-white">{salon.ownerFirstName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Last Name</p>
                      <p className="text-sm text-white">{salon.ownerLastName || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                    Social Media
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-blue-300/50">Facebook</p>
                      <p className="text-sm text-white">{salon.facebook || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Instagram</p>
                      <p className="text-sm text-white">{salon.instagram || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">Twitter</p>
                      <p className="text-sm text-white">{salon.twitter || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/50">State/Region</p>
                      <p className="text-sm text-white">{salon.state || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-6 flex gap-3">
                <Link
                  href="/dashboard/salons"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Back to Salons
                </Link>
                <Link
                  href={`/dashboard/salons/${salon.id}/edit`}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Edit Salon
                </Link>
              </div>
            </div>
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
                {processingId === salon?.id ? (
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