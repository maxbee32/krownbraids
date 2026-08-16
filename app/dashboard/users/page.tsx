// app/dashboard/users/page.tsx
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
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ScissorsIcon,
  UserPlusIcon,
  TagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../../components/ThreeScene";

interface User {
  id: number | string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt?: string;
  profileUpdated?: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Users", icon: UserPlusIcon, href: "/dashboard/users", current: true },
    { name: "Categories", icon: TagIcon, href: "/dashboard/categories", current: false },
    { name: "Subscriptions", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: false },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  const roleFilters = ["All", "SUPER_ADMIN", "ADMIN", "USER", "SALON_OWNER", "SUPPLIER"];

  // Helper function to normalize status for display
  const normalizeStatus = (status: string): string => {
    if (!status) return "INACTIVE";
    return status.toUpperCase();
  };

  // Helper function to check if user is active
  const isUserActive = (status: string): boolean => {
    const normalized = normalizeStatus(status);
    return normalized === "ACTIVE";
  };

  // Helper function to format role for display
  const formatRole = (role: string): string => {
    if (!role) return "user";
    return role.toLowerCase().replace('_', ' ');
  };

  // Helper function to get role badge style
  const getRoleBadgeClass = (role: string): string => {
    const normalizedRole = role?.toUpperCase() || "USER";
    const styles: Record<string, string> = {
      SUPER_ADMIN: "bg-purple-500/20 text-purple-400 border border-purple-400/30",
      ADMIN: "bg-indigo-500/20 text-indigo-400 border border-indigo-400/30",
      USER: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
      SALON_OWNER: "bg-green-500/20 text-green-400 border border-green-400/30",
      SUPPLIER: "bg-amber-500/20 text-amber-400 border border-amber-400/30",
    };
    return styles[normalizedRole] || styles.USER;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch("/api/auth/add-admin", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Raw API response:", data);
        
        let usersData = data.data || data || [];
        
        if (!Array.isArray(usersData)) {
          usersData = [];
        }
        
        setUsers(usersData);
        
        // If we have a selected user, update their data with the fresh data
        if (selectedUser) {
          const updatedUser = usersData.find((u: User) => u.id === selectedUser.id);
          if (updatedUser) {
            setSelectedUser(updatedUser);
            // Also update the edit form data with the fresh values
            setEditFormData({
              fullName: updatedUser.fullName || "",
              email: updatedUser.email || "",
              phoneNumber: updatedUser.phoneNumber || "",
              role: updatedUser.role || "",
            });
          }
        }
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      showAlert('error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }
    fetchUsers();
    setLoading(false);
  }, [router]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      showAlert('error', 'Full name and email are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch("/api/auth/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showAlert('error', 'Service unavailable. Please try again later.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'User added successfully! A temporary password has been sent to their email.');
        setShowAddModal(false);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
        });
        fetchUsers();
      } else {
        showAlert('error', data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error("Add user error:", error);
      showAlert('error', 'Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified update handler for all user types
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("adminToken");
      
      // Use the same endpoint for all user types (super admin, admin, etc.)
      const response = await fetch(`/api/auth/add-admin/${selectedUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editFormData.fullName,
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
        }),
      });

      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        if (response.ok) {
          showAlert('success', 'User updated successfully!');
          setIsEditing(false);
          await fetchUsers();
          setShowViewModal(false);
          return;
        } else {
          showAlert('error', 'Failed to update user. Please try again.');
          return;
        }
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'User updated successfully!');
        setIsEditing(false);
        await fetchUsers();
        setShowViewModal(false);
      } else {
        showAlert('error', data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("Update user error:", error);
      if (error instanceof SyntaxError && error.message.includes('Unexpected end of JSON')) {
        showAlert('success', 'User updated successfully!');
        setIsEditing(false);
        await fetchUsers();
        setShowViewModal(false);
      } else {
        showAlert('error', 'Failed to update user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem("adminToken");
      
      // Use the same endpoint for all user types
      const response = await fetch(`/api/auth/add-admin/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (response.ok) {
          showAlert('success', 'User deleted successfully!');
          setShowViewModal(false);
          fetchUsers();
          return;
        }
        showAlert('error', 'Service unavailable. Please try again later.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'User deleted successfully!');
        setShowViewModal(false);
        fetchUsers();
      } else {
        showAlert('error', data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Delete user error:", error);
      showAlert('error', 'Failed to delete user. Please try again.');
    }
  };

  const handleToggleStatus = async (id: number | string, currentStatus: string) => {
    const isCurrentlyActive = normalizeStatus(currentStatus) === "ACTIVE";
    const newStatusString = isCurrentlyActive ? "INACTIVE" : "ACTIVE";
    
    try {
      const token = localStorage.getItem("adminToken");
      
      // Use the same endpoint for all user types
      const response = await fetch(`/api/auth/add-admin/${id}?status=${newStatusString}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (response.ok) {
          showAlert('success', `User ${newStatusString.toLowerCase()}d successfully!`);
          await fetchUsers();
          return;
        }
        showAlert('error', 'Service unavailable. Please try again later.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', `User ${newStatusString.toLowerCase()}d successfully!`);
        await fetchUsers();
      } else {
        showAlert('error', data.message || `Failed to ${newStatusString.toLowerCase()} user`);
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      showAlert('error', 'Failed to update user status. Please try again.');
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

  // Open view modal
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "",
    });
    setIsEditing(false);
    setShowViewModal(true);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role?.toUpperCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => isUserActive(u.status)).length,
    admins: users.filter((u) => {
      const role = u.role?.toUpperCase() || "";
      return role === "SUPER_ADMIN" || role === "ADMIN";
    }).length,
    inactive: users.filter((u) => !isUserActive(u.status)).length,
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-sm text-blue-300/60">Loading users...</p>
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
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">User Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add User</span>
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

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
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
                  <XCircleIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{alert.message}</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total Users</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Active</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-purple-400/50 uppercase tracking-wider">Admins</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-purple-400">{stats.admins}</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-7 sm:px-9 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {roleFilters.map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm capitalize whitespace-nowrap transition-all duration-200 ${
                      filterRole === role
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-blue-300/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {role === "All" ? "All" : role.toLowerCase().replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[600px] sm:min-w-full">
                    <thead>
                      <tr className="text-left text-[10px] sm:text-xs text-blue-300/50 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">User</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden sm:table-cell">Email</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium hidden md:table-cell">Role</th>
                        <th className="pb-1.5 sm:pb-2 pr-2 sm:pr-3 font-medium">Status</th>
                        <th className="pb-1.5 sm:pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const normalizedStatus = normalizeStatus(user.status);
                        const isActive = normalizedStatus === "ACTIVE";
                        const isSuperAdmin = user.role?.toUpperCase() === "SUPER_ADMIN";
                        
                        return (
                          <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold text-white flex-shrink-0 ${
                                  isSuperAdmin 
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                                    : "bg-gradient-to-br from-blue-400 to-cyan-400"
                                }`}>
                                  {user.fullName?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] sm:text-xs md:text-sm text-white truncate">
                                    {user.fullName}
                                    {isSuperAdmin && (
                                      <span className="ml-1.5 text-[8px] sm:text-[10px] text-purple-400">★</span>
                                    )}
                                  </p>
                                  <p className="text-[8px] sm:text-[10px] text-blue-300/50 truncate sm:hidden">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3 text-[10px] sm:text-xs md:text-sm text-white/60 hidden sm:table-cell">
                              {user.email}
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs capitalize font-medium ${getRoleBadgeClass(user.role)}`}>
                                {formatRole(user.role)}
                              </span>
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5 pr-2 sm:pr-3">
                              <button
                                onClick={() => handleToggleStatus(user.id, user.status)}
                                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${
                                  isActive
                                    ? "bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30"
                                } hover:scale-105 transition-transform`}
                              >
                                {normalizedStatus}
                              </button>
                            </td>
                            <td className="py-1.5 sm:py-2 md:py-2.5">
                              <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                                <button 
                                  onClick={() => handleViewUser(user)}
                                  className="p-1 rounded hover:bg-white/10 text-blue-400/50 hover:text-blue-400 transition-colors"
                                  title="View/Edit User"
                                >
                                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                                <button 
                                  onClick={() => handleToggleStatus(user.id, user.status)}
                                  className="p-1 rounded hover:bg-white/10 text-blue-300/50 hover:text-blue-300 transition-colors"
                                  title={isActive ? "Deactivate" : "Activate"}
                                >
                                  {isActive ? (
                                    <XCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  ) : (
                                    <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors"
                                >
                                  <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredUsers.length === 0 && !loadingUsers && (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="text-4xl sm:text-5xl mb-3">👤</div>
                  <p className="text-sm sm:text-base text-white/60">No users found</p>
                  <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    placeholder="+44 20 1234 5678"
                  />
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                <p className="text-xs text-blue-300/70">
                  <ShieldCheckIcon className="h-4 w-4 inline-block mr-1" />
                  Role and temporary password will be assigned by the system automatically.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit User' : 'User Details'}
              </h2>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  setIsEditing(false);
                }} 
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl font-bold text-white">
                    {selectedUser.fullName?.charAt(0) || "U"}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Full Name</label>
                    <p className="text-white text-sm">{selectedUser.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Email</label>
                    <p className="text-white text-sm">{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Phone Number</label>
                    <p className="text-white text-sm">{selectedUser.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Role</label>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize font-medium ${getRoleBadgeClass(selectedUser.role)}`}>
                      {formatRole(selectedUser.role)}
                      {selectedUser.role?.toUpperCase() === "SUPER_ADMIN" && " ★"}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Status</label>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isUserActive(selectedUser.status)
                        ? "bg-green-500/20 text-green-400 border border-green-400/30"
                        : "bg-red-500/20 text-red-400 border border-red-400/30"
                    }`}>
                      {normalizeStatus(selectedUser.status)}
                    </span>
                  </div>
                  {selectedUser.createdAt && (
                    <div>
                      <label className="text-xs text-blue-300/50 uppercase tracking-wider block">Created At</label>
                      <p className="text-white text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit User
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleDeleteUser(selectedUser.id);
                    }}
                    className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isUserActive(selectedUser.status) ? (
                    <>
                      <XCircleIcon className="h-4 w-4" />
                      Deactivate Account
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4" />
                      Activate Account
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/30" />
                    <input
                      type="tel"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50 [&>option]:bg-indigo-950 [&>option]:text-white"
                  >
                    <option value="USER" className="bg-indigo-950 text-white">User</option>
                    <option value="ADMIN" className="bg-indigo-950 text-white">Admin</option>
                    <option value="SUPER_ADMIN" className="bg-indigo-950 text-white">Super Admin</option>
                    <option value="SALON_OWNER" className="bg-indigo-950 text-white">Salon Owner</option>
                    <option value="SUPPLIER" className="bg-indigo-950 text-white">Supplier</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}