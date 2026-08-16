// app/dashboard/categories/page.tsx
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
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  TruckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ScissorsIcon,
  TagIcon,
  UserPlusIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import ThreeScene from "../../components/ThreeScene";

// ==========================================
// CATEGORY TYPE
// ==========================================

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

// ==========================================
// PAGE
// ==========================================

export default function CategoriesPage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navItems = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      href: "/dashboard",
      current: false,
    },
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
      current: false,
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
      current: true,
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

  // ==========================================
  // ALERT
  // ==========================================

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      type,
      message,
    });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // ==========================================
  // GET ALL CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/auth/categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        showAlert("error", "Server error. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      console.log("Categories response:", data);

      if (!response.ok) {
        showAlert("error", data?.message || "Failed to load categories");
        setLoading(false);
        return;
      }

      // Map the data to ensure active is properly set
      const categoriesData = Array.isArray(data) ? data : data?.data || [];
      const mappedCategories = categoriesData.map((cat: any) => ({
        ...cat,
        active: cat.active === true || cat.active === "true" || cat.active === 1,
      }));

      setCategories(mappedCategories);
    } catch (error) {
      console.error("Fetch categories error:", error);
      showAlert("error", "Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/");
      return;
    }

    fetchCategories();
  }, [router]);

  // ==========================================
  // STATS
  // ==========================================

  const stats = {
    total: categories.length,
    active: categories.filter((category) => category.active === true).length,
    inactive: categories.filter((category) => category.active === false).length,
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCategories = categories.filter((category) => {
    const search = searchTerm.toLowerCase();

    return (
      category.name?.toLowerCase().includes(search) ||
      category.description?.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setFormData({
      name: "",
      description: "",
    });
    setShowAddModal(true);
  };

  // ==========================================
  // CREATE CATEGORY
  // ==========================================

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/auth/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        showAlert("error", "Server error. Please try again.");
        return;
      }

      const data = await response.json();

      console.log("Create category response:", data);

      if (!response.ok) {
        showAlert("error", data?.message || "Failed to create category");
        return;
      }

      // Add returned category
      const newCategory = {
        ...data,
        active: data.active === true || data.active === "true" || data.active === 1,
      };

      setCategories((previous) => [...previous, newCategory]);

      showAlert("success", "Category added successfully!");
      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Create category error:", error);
      showAlert("error", "Unable to create category");
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowEditModal(true);
  };

  // ==========================================
  // UPDATE CATEGORY
  // ==========================================

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(`/api/auth/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        showAlert("error", "Server error. Please try again.");
        return;
      }

      const data = await response.json();

      console.log("Update category response:", data);

      if (!response.ok) {
        showAlert("error", data?.message || "Failed to update category");
        return;
      }

      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id
            ? { ...data, active: category.active }
            : category
        )
      );

      showAlert("success", "Category updated successfully!");
      setShowEditModal(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Update category error:", error);
      showAlert("error", "Unable to update category");
    }
  };

  // ==========================================
  // ACTIVATE CATEGORY
  // ==========================================

  // ==========================================
// ACTIVATE CATEGORY
// ==========================================

const handleActivateCategory = async (id: number) => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/");
      return;
    }

    console.log("Activating category ID:", id);

    // Use the correct activate endpoint
    const response = await fetch(`/api/auth/categories/${id}/activate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      showAlert("error", "Server error. Please try again.");
      return;
    }

    const data = await response.json();

    console.log("Activate response:", data);

    if (!response.ok) {
      showAlert("error", data?.message || "Failed to activate category");
      return;
    }

    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? { ...category, ...data, active: true }
          : category
      )
    );

    showAlert("success", "Category activated successfully!");
  } catch (error) {
    console.error("Activate category error:", error);
    showAlert("error", "Unable to activate category");
  }
};

// ==========================================
// DEACTIVATE CATEGORY
// ==========================================

const handleDeactivateCategory = async (id: number) => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/");
      return;
    }

    console.log("Deactivating category ID:", id);

    // Use the correct deactivate endpoint
    const response = await fetch(`/api/auth/categories/${id}/deactivate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      showAlert("error", "Server error. Please try again.");
      return;
    }

    const data = await response.json();

    console.log("Deactivate response:", data);

    if (!response.ok) {
      showAlert("error", data?.message || "Failed to deactivate category");
      return;
    }

    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? { ...category, ...data, active: false }
          : category
      )
    );

    showAlert("success", "Category deactivated successfully!");
  } catch (error) {
    console.error("Deactivate category error:", error);
    showAlert("error", "Unable to deactivate category");
  }
};

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDeleteCategory = async () => {
    const { categoryId } = deleteModal;
    if (!categoryId) return;

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(`/api/auth/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setCategories((previous) =>
          previous.filter((category) => category.id !== categoryId)
        );
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
        showAlert("success", "Category deleted successfully!");
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        showAlert("error", "Server error. Please try again.");
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setCategories((previous) =>
          previous.filter((category) => category.id !== categoryId)
        );
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
        showAlert("success", "Category deleted successfully!");
      } else {
        showAlert("error", data?.message || "Failed to delete category");
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
      }
    } catch (error) {
      console.error("Delete category error:", error);
      showAlert("error", "Unable to delete category");
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
    }
  };

  const openDeleteModal = (category: Category) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      router.push("/");
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-sm text-blue-300/60">Loading categories...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 overflow-hidden">
      <ThreeScene />

      <div className="relative z-10 flex flex-col h-full">
        {/* ======================================
            TOP NAVIGATION
        ====================================== */}

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
                  Hairstyle Categories
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-green-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Category</span>
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
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
          {/* ======================================
              DESKTOP SIDEBAR
          ====================================== */}

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

          {/* ======================================
              MOBILE SIDEBAR
          ====================================== */}

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
                    className="w-full text-sm text-red-400/60 hover:text-red-400 transition-colors px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-left flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ======================================
              MAIN CONTENT
          ====================================== */}

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {/* ALERT */}

            {alert && (
              <div
                className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${
                  alert.type === "success"
                    ? "bg-green-500/20 border border-green-400/30 text-green-400"
                    : "bg-red-500/20 border border-red-400/30 text-red-400"
                }`}
              >
                {alert.type === "success" ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{alert.message}</span>
              </div>
            )}

            {/* ======================================
                STATS
            ====================================== */}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">
                  Total Categories
                </p>

                <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                  {stats.total}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">
                  Active
                </p>

                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">
                  {stats.active}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-red-400/50 uppercase tracking-wider">
                  Inactive
                </p>

                <p className="text-base sm:text-lg md:text-xl font-bold text-red-400">
                  {stats.inactive}
                </p>
              </div>
            </div>

            {/* ======================================
                SEARCH
            ====================================== */}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />

                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-7 sm:px-9 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {/* ======================================
                CATEGORY GRID
            ====================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                        <TagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>

                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white">
                          {category.name}
                        </h3>

                        <p className="text-[10px] sm:text-xs text-blue-300/50 mt-1">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                        category.active
                          ? "bg-green-500/20 text-green-400 border border-green-400/30"
                          : "bg-red-500/20 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {category.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* ==================================
                      CATEGORY ACTIONS
                  ================================== */}

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {category.active ? (
                        <button
                          onClick={() =>
                            handleDeactivateCategory(category.id)
                          }
                          className="text-[10px] sm:text-xs text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateCategory(category.id)}
                          className="text-[10px] sm:text-xs text-green-400/70 hover:text-green-400 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </div>

                    <div className="flex gap-1 sm:gap-1.5">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors"
                        title="Edit category"
                      >
                        <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={() => openDeleteModal(category)}
                        className="p-1.5 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors"
                        title="Delete category"
                      >
                        <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ======================================
                NO RESULTS
            ====================================== */}

            {filteredCategories.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">🏷️</div>

                <p className="text-sm sm:text-base text-white/60">
                  {searchTerm
                    ? "No categories found"
                    : "No categories available"}
                </p>

                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Add your first category"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          ADD CATEGORY MODAL
      ========================================== */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add Category</h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              {/* NAME */}

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">
                  Category Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  placeholder="e.g. Box Braids"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  placeholder="Brief description of the hairstyle category"
                  rows={3}
                />
              </div>

              {/* BUTTONS */}

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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-green-500/30 transition-all hover:scale-[1.02]"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          EDIT CATEGORY MODAL
      ========================================== */}

      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Category</h2>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditCategory} className="space-y-4">
              {/* NAME */}

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">
                  Category Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  rows={3}
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-yellow-500/30 transition-all hover:scale-[1.02]"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">
              Delete Category
            </h2>

            <p className="text-white/60 text-center text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                "{deleteModal.categoryName}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 mb-6">
              <p className="text-red-300/70 text-xs text-center">
                ⚠️ Warning: This will permanently delete the category.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" })
                }
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCategory}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-red-500/30 transition-all hover:scale-[1.02]"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}