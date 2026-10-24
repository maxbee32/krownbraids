// app/dashboard/suppliers/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
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
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ScissorsIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../../components/ThreeScene";
import {
  SupplierDetailDrawer,
  SupplierWithStatus,
} from "./SupplierDetailDrawer";

// ─── Helpers ───
function mapStatusLabel(status: string | null): string {
  switch (status) {
    case "APPROVED":
      return "Active";
    case "PENDING_APPROVAL":
      return "Pending";
    case "PAYMENT_CONFIRMED":
      return "Awaiting Approval";
    case "REVIEW":
      return "In Review";
    case "REJECTED":
      return "Rejected";
    case "NOT_STARTED":
      return "Not Started";
    case "IN_PROGRESS":
      return "In Progress";
    default:
      return "Pending";
  }
}

function getStatusBadge(status: string | null): string {
  const label = mapStatusLabel(status);
  const styles: Record<string, string> = {
    Active: "bg-green-500/20 text-green-400 border border-green-400/30",
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
    "Awaiting Approval":
      "bg-blue-500/20 text-blue-400 border border-blue-400/30",
    "In Review": "bg-indigo-500/20 text-indigo-400 border border-indigo-400/30",
    Rejected: "bg-red-500/20 text-red-400 border border-red-400/30",
    "Not Started": "bg-gray-500/20 text-gray-400 border border-gray-400/30",
    "In Progress":
      "bg-purple-500/20 text-purple-400 border border-purple-400/30",
  };
  return styles[label] || styles.Pending;
}

export default function SuppliersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ─── Real data ───
  const [suppliers, setSuppliers] = useState<SupplierWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ─── Alert state ───
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // ─── Drawer state ───
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierWithStatus | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ─── Reject modal state ───
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectBusinessId, setRejectBusinessId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    {
      name: "Bookings",
      icon: CalendarIcon,
      href: "/dashboard/bookings",
      current: false,
    },
    {
      name: "Salons",
      icon: BuildingOfficeIcon,
      href: "/dashboard/salons",
      current: false,
    },
    {
      name: "Suppliers",
      icon: TruckIcon,
      href: "/dashboard/suppliers",
      current: true,
    },
    {
      name: "Customers",
      icon: UserGroupIcon,
      href: "/dashboard/customers",
      current: false,
    },
    {
      name: "Users",
      icon: UserPlusIcon,
      href: "/dashboard/users",
      current: false,
    },
    {
      name: "Categories",
      icon: TagIcon,
      href: "/dashboard/categories",
      current: false,
    },
    {
      name: "Subscriptions",
      icon: CreditCardIcon,
      href: "/dashboard/subscriptions",
      current: false,
    },
    {
      name: "Admin",
      icon: Cog6ToothIcon,
      href: "/dashboard/admin",
      current: false,
    },
  ];

  const statusFilters = [
    "All",
    "Active",
    "Pending",
    "Awaiting Approval",
    "Rejected",
  ];

  // ─── Fetch suppliers on mount ───
  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/auth/supplier", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load suppliers");
          return;
        }

        setSuppliers(data.data || []);
      } catch (err) {
        console.error("❌ Fetch suppliers error:", err);
        setError("Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [router]);

  // ─── Drawer handlers ───
  const openDrawer = (supplier: SupplierWithStatus) => {
    setSelectedSupplier(supplier);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    // small delay so the visual state doesn't flicker during close
    setTimeout(() => setSelectedSupplier(null), 200);
  };

  // Escape key closes drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // ─── Approve ───
  const handleApprove = async (businessId: string | null) => {
    if (!businessId) {
      showAlert("error", "This supplier hasn't started onboarding yet.");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }

    setActionLoadingId(businessId);
    try {
      const res = await fetch(`/api/auth/supplier/approve?id=${businessId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Safely parse — server may return HTML on error
      let data: any;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        showAlert(
          "error",
          `Unexpected server response (${res.status}). Please try again.`
        );
        return;
      }

      if (res.ok && data.status === "success") {
        setSuppliers((prev) =>
          prev.map((s) =>
            s.businessId === businessId ? { ...s, status: "APPROVED" } : s
          )
        );
        setSelectedSupplier((prev) =>
          prev && prev.businessId === businessId
            ? { ...prev, status: "APPROVED" }
            : prev
        );
        closeDrawer();
        showAlert("success", "Supplier approved successfully.");
      } else {
        showAlert("error", data.message || "Failed to approve supplier");
      }
    } catch (err) {
      console.error("❌ Approve error:", err);
      showAlert("error", "Failed to approve supplier");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─── Reject: opens the modal ───
  const handleReject = (businessId: string | null) => {
    if (!businessId) {
      showAlert("error", "This supplier hasn't started onboarding yet.");
      return;
    }
    setRejectBusinessId(businessId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  // ─── Reject: actual API call ───
  const confirmReject = async () => {
    if (!rejectBusinessId) return;
    if (!rejectReason.trim()) {
      showAlert("error", "Please provide a reason for rejection.");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }

    const businessId = rejectBusinessId;
    setActionLoadingId(businessId);

    try {
      const res = await fetch(`/api/auth/supplier/reject?id=${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason: rejectReason.trim() }),
      });

      let data: any;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        showAlert(
          "error",
          `Unexpected server response (${res.status}). Please try again.`
        );
        return;
      }

      if (res.ok && data.status === "success") {
        setSuppliers((prev) =>
          prev.map((s) =>
            s.businessId === businessId ? { ...s, status: "REJECTED" } : s
          )
        );
        setSelectedSupplier((prev) =>
          prev && prev.businessId === businessId
            ? { ...prev, status: "REJECTED" }
            : prev
        );
        closeDrawer();
        setRejectModalOpen(false);
        setRejectBusinessId(null);
        showAlert("success", "Supplier rejected successfully.");
      } else {
        showAlert("error", data.message || "Failed to reject supplier");
      }
    } catch (err) {
      console.error("❌ Reject error:", err);
      showAlert("error", "Failed to reject supplier");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─── Filtering ───
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      (s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || mapStatusLabel(s.status) === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ─── Stats ───
  const stats = {
    total: suppliers.length,
    approved: suppliers.filter((s) => s.status === "APPROVED").length,
    pending: suppliers.filter(
      (s) =>
        s.status === "PENDING_APPROVAL" || s.status === "PAYMENT_CONFIRMED"
    ).length,
    rejected: suppliers.filter((s) => s.status === "REJECTED").length,
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
          <p className="text-sm text-blue-300/60">Loading suppliers...</p>
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
            <Link
              href="/dashboard"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  KROWNBRAIDS
                </h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">
                  Suppliers
                </p>
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
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2">
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Supplier</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutLoading ? (
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white/60"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
                    <span className="text-sm font-bold text-white">
                      KROWNBRAIDS
                    </span>
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
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
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
                      <svg
                        className="animate-spin h-4 w-4 text-red-400/60"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
            {/* Alert toast */}
            {alert && (
              <div
                className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${
                  alert.type === "success"
                    ? "bg-green-500/20 border border-green-400/30 text-green-400"
                    : alert.type === "info"
                    ? "bg-blue-500/20 border border-blue-400/30 text-blue-400"
                    : "bg-red-500/20 border border-red-400/30 text-red-400"
                }`}
              >
                {alert.type === "success" ? (
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm flex-1">{alert.message}</span>
                <button
                  onClick={() => setAlert(null)}
                  className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Fetch error */}
            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">
                  Approved
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-yellow-400/50 uppercase tracking-wider">
                  Pending
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-yellow-400">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-red-400/50 uppercase tracking-wider">
                  Rejected
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-red-400">
                  {stats.rejected}
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
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
                {filteredSuppliers.map((supplier) => {
                  const statusLabel = mapStatusLabel(supplier.status);
                  const isActionable =
                    supplier.status === "PENDING_APPROVAL" ||
                    supplier.status === "PAYMENT_CONFIRMED";
                  const isWorking = actionLoadingId === supplier.businessId;

                  return (
                    <div
                      key={supplier.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                            🚚
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                              {supplier.companyName || supplier.fullName}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-blue-300/50 truncate">
                              {supplier.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {supplier.isVerified && (
                            <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                          )}
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${getStatusBadge(
                              supplier.status
                            )}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                          <EnvelopeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate">{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                          <PhoneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate">{supplier.phone}</span>
                        </div>
                        {supplier.planName && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60">
                            <CreditCardIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {supplier.planName}
                              {supplier.billingCycle &&
                                ` • ${supplier.billingCycle}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Payment / Subscription */}
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5 text-[10px] sm:text-xs">
                        <div className="text-white/60">
                          {supplier.paymentStatus === "SUCCESS" ? (
                            <span className="text-green-400 font-medium">
                              ✓ Paid
                            </span>
                          ) : supplier.paymentStatus ? (
                            <span className="text-yellow-400">
                              {supplier.paymentStatus}
                            </span>
                          ) : (
                            <span className="text-blue-300/30">No payment</span>
                          )}
                        </div>
                        <div className="text-white/60">
                          {supplier.onboardingCompleted ? (
                            <span className="text-blue-300">
                              Onboarding done
                            </span>
                          ) : (
                            <span className="text-yellow-300/60">
                              Step: {supplier.onboardingStep || "—"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5">
                        {isActionable ? (
                          <>
                            <button
                              onClick={() => openDrawer(supplier)}
                              className="flex-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-white bg-blue-600/40 hover:bg-blue-600/60 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <EyeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Review
                            </button>
                            <button
                              onClick={() => handleApprove(supplier.businessId)}
                              disabled={isWorking}
                              className="flex-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-white bg-green-600/40 hover:bg-green-600/60 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(supplier.businessId)}
                              disabled={isWorking}
                              className="flex-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-red-400/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openDrawer(supplier)}
                              className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <EyeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              View
                            </button>
                            <button className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                              <PencilSquareIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Edit
                            </button>
                            <button className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-1">
                              <TrashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[800px] sm:min-w-full">
                    <thead>
                      <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">
                          Supplier
                        </th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">
                          Contact
                        </th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">
                          Plan
                        </th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">
                          Verified
                        </th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">
                          Status
                        </th>
                        <th className="pb-1.5 sm:pb-2 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.map((supplier) => {
                        const statusLabel = mapStatusLabel(supplier.status);
                        const isActionable =
                          supplier.status === "PENDING_APPROVAL" ||
                          supplier.status === "PAYMENT_CONFIRMED";
                        const isWorking =
                          actionLoadingId === supplier.businessId;

                        return (
                          <tr
                            key={supplier.id}
                            className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xs sm:text-sm">
                                  🚚
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">
                                    {supplier.companyName || supplier.fullName}
                                  </p>
                                  <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate">
                                    {supplier.fullName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">
                              {supplier.email}
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden md:table-cell">
                              {supplier.planName || "—"}
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              {supplier.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs text-cyan-400">
                                  <ShieldCheckIcon className="h-3.5 w-3.5" />
                                  Verified
                                </span>
                              ) : (
                                <span className="text-xs text-blue-300/30">
                                  Unverified
                                </span>
                              )}
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              <span
                                className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusBadge(
                                  supplier.status
                                )}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5">
                              <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                                {isActionable ? (
                                  <>
                                    <button
                                      onClick={() => openDrawer(supplier)}
                                      className="px-2 py-1 rounded text-[10px] font-medium text-blue-400 hover:bg-blue-500/10"
                                    >
                                      Review
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleApprove(supplier.businessId)
                                      }
                                      disabled={isWorking}
                                      className="px-2 py-1 rounded text-[10px] font-medium text-green-400 hover:bg-green-500/10 disabled:opacity-50"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleReject(supplier.businessId)
                                      }
                                      disabled={isWorking}
                                      className="px-2 py-1 rounded text-[10px] font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => openDrawer(supplier)}
                                      className="p-1 rounded hover:bg-white/10 text-blue-300/50 hover:text-blue-300 transition-colors"
                                    >
                                      <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors">
                                      <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors">
                                      <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredSuppliers.length === 0 && !error && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">🚚</div>
                <p className="text-sm sm:text-base text-white/60">
                  No suppliers found
                </p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <SupplierDetailDrawer
        supplier={selectedSupplier}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onApprove={handleApprove}
        onReject={handleReject}
        isWorking={
          !!selectedSupplier &&
          actionLoadingId === selectedSupplier.businessId
          
        }
          onNotify={showAlert}   // ← ADD THIS

      />

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={() => {
              setRejectModalOpen(false);
              setRejectBusinessId(null);
            }}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-md bg-gradient-to-b from-blue-950 to-indigo-950 border border-white/15 rounded-2xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  Reject Supplier
                </h3>
                <p className="text-xs text-blue-300/60 mt-1">
                  Provide a reason. The supplier will be notified by email.
                </p>
              </div>

              <div className="p-5">
                <label className="text-xs text-blue-300/60 uppercase tracking-wider block mb-2">
                  Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="e.g. Missing company registration documents"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-red-400/50 resize-none"
                  autoFocus
                />
              </div>

              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectBusinessId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={
                    !rejectReason.trim() ||
                    actionLoadingId === rejectBusinessId
                  }
                  className="flex-1 py-2.5 rounded-xl bg-red-600/60 hover:bg-red-600/80 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoadingId === rejectBusinessId ? (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <XCircleIcon className="h-4 w-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}