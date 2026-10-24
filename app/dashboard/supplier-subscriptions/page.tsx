// app/dashboard/supplier-subscriptions/page.tsx
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
  CreditCardIcon,
  UserPlusIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import ThreeScene from "../../components/ThreeScene";

interface SupplierPlan {
  id: number;
  name: string;
  code: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProducts: number | null;
  maxOrdersPerMonth: number | null;
  maxTeamMembers: number | null;
  maxWarehouses: number | null;
  bulkPricing: boolean;
  apiAccess: boolean;
  featuredListings: boolean;
  customBranding: boolean;
  whiteLabel: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  advancedReporting: boolean;
  multiCurrency: boolean;
  popular: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function SupplierSubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SupplierPlan | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [plans, setPlans] = useState<SupplierPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; planId: number | null; planName: string }>({
    isOpen: false,
    planId: null,
    planName: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    monthlyPrice: "",
    yearlyPrice: "",
    maxProducts: "",
    maxOrdersPerMonth: "",
    maxTeamMembers: "",
    maxWarehouses: "",
    bulkPricing: false,
    apiAccess: false,
    featuredListings: false,
    customBranding: false,
    whiteLabel: false,
    analytics: false,
    prioritySupport: false,
    advancedReporting: false,
    multiCurrency: false,
    popular: false,
  });

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard", current: false },
    { name: "Bookings", icon: CalendarIcon, href: "/dashboard/bookings", current: false },
    { name: "Salons", icon: BuildingOfficeIcon, href: "/dashboard/salons", current: false },
    { name: "Suppliers", icon: TruckIcon, href: "/dashboard/suppliers", current: false },
    { name: "Customers", icon: UserGroupIcon, href: "/dashboard/customers", current: false },
    { name: "Users", icon: UserPlusIcon, href: "/dashboard/users", current: false },
    { name: "Categories", icon: TagIcon, href: "/dashboard/categories", current: false },
    { name: "Salon Plans", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: false },
    { name: "Supplier Plans", icon: TruckIcon, href: "/dashboard/supplier-subscriptions", current: true },
    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // ═══════════════════════════════════════════
  // FETCH PLANS
  // ═══════════════════════════════════════════
  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/auth/supplier-subscription-plans', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setPlans([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const plansData = Array.isArray(data) ? data : data.data || [];
        setPlans(plansData);
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Failed to fetch supplier plans');
      }
    } catch (error) {
      console.error('Error fetching supplier plans:', error);
      showAlert('error', 'Failed to fetch supplier plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push("/");
      return;
    }
    fetchPlans();
    setLoading(false);
  }, [router]);

  // ═══════════════════════════════════════════
  // ADD PLAN
  // ═══════════════════════════════════════════
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.monthlyPrice) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      const payload = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        monthlyPrice: parseFloat(formData.monthlyPrice),
        yearlyPrice: parseFloat(formData.yearlyPrice) || parseFloat(formData.monthlyPrice) * 10,
        maxProducts: formData.maxProducts ? parseInt(formData.maxProducts) : null,
        maxOrdersPerMonth: formData.maxOrdersPerMonth ? parseInt(formData.maxOrdersPerMonth) : null,
        maxTeamMembers: formData.maxTeamMembers ? parseInt(formData.maxTeamMembers) : null,
        maxWarehouses: formData.maxWarehouses ? parseInt(formData.maxWarehouses) : null,
        bulkPricing: formData.bulkPricing,
        apiAccess: formData.apiAccess,
        featuredListings: formData.featuredListings,
        customBranding: formData.customBranding,
        whiteLabel: formData.whiteLabel,
        analytics: formData.analytics,
        prioritySupport: formData.prioritySupport,
        advancedReporting: formData.advancedReporting,
        multiCurrency: formData.multiCurrency,
        popular: formData.popular,
        active: true,
      };

      const response = await fetch('/api/auth/supplier-subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Supplier plan added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchPlans();
      } else {
        showAlert('error', data.message || 'Failed to add supplier plan');
      }
    } catch (error) {
      console.error('Error adding supplier plan:', error);
      showAlert('error', 'Failed to add supplier plan');
    }
  };

  // ═══════════════════════════════════════════
  // EDIT PLAN
  // ═══════════════════════════════════════════
  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const token = localStorage.getItem('adminToken');

      const payload = {
        name: formData.name,
        description: formData.description,
        monthlyPrice: parseFloat(formData.monthlyPrice),
        yearlyPrice: parseFloat(formData.yearlyPrice) || parseFloat(formData.monthlyPrice) * 10,
        maxProducts: formData.maxProducts ? parseInt(formData.maxProducts) : null,
        maxOrdersPerMonth: formData.maxOrdersPerMonth ? parseInt(formData.maxOrdersPerMonth) : null,
        maxTeamMembers: formData.maxTeamMembers ? parseInt(formData.maxTeamMembers) : null,
        maxWarehouses: formData.maxWarehouses ? parseInt(formData.maxWarehouses) : null,
        bulkPricing: formData.bulkPricing,
        apiAccess: formData.apiAccess,
        featuredListings: formData.featuredListings,
        customBranding: formData.customBranding,
        whiteLabel: formData.whiteLabel,
        analytics: formData.analytics,
        prioritySupport: formData.prioritySupport,
        advancedReporting: formData.advancedReporting,
        multiCurrency: formData.multiCurrency,
        popular: formData.popular,
      };

      const response = await fetch(`/api/auth/supplier-subscription-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Plan updated successfully!');
        setShowEditModal(false);
        setEditingPlan(null);
        resetForm();
        fetchPlans();
      } else {
        showAlert('error', data.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      showAlert('error', 'Failed to update plan');
    }
  };

  // ═══════════════════════════════════════════
  // TOGGLE ACTIVE
  // ═══════════════════════════════════════════
  const handleToggleStatus = async (plan: SupplierPlan) => {
    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = !plan.active;

      const response = await fetch(`/api/auth/supplier-subscription-plans/${plan.id}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setPlans(prev => prev.map(p => 
          p.id === plan.id ? { ...p, active: newStatus } : p
        ));
        showAlert('success', `Plan ${newStatus ? 'activated' : 'deactivated'}!`);
      } else {
        const data = await response.json();
        showAlert('error', data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling plan:', error);
      showAlert('error', 'Failed to toggle status');
    }
  };

  // ═══════════════════════════════════════════
  // DELETE PLAN
  // ═══════════════════════════════════════════
  const handleDeletePlan = async () => {
    const { planId } = deleteModal;
    if (!planId) return;

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`/api/auth/supplier-subscription-plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        setPlans(prev => prev.filter(p => p.id !== planId));
        setDeleteModal({ isOpen: false, planId: null, planName: "" });
        showAlert('success', 'Plan deleted successfully!');
      } else {
        const data = await response.json();
        showAlert('error', data.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showAlert('error', 'Failed to delete plan');
    }
  };

  // ═══════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      monthlyPrice: "",
      yearlyPrice: "",
      maxProducts: "",
      maxOrdersPerMonth: "",
      maxTeamMembers: "",
      maxWarehouses: "",
      bulkPricing: false,
      apiAccess: false,
      featuredListings: false,
      customBranding: false,
      whiteLabel: false,
      analytics: false,
      prioritySupport: false,
      advancedReporting: false,
      multiCurrency: false,
      popular: false,
    });
  };

  const openEditModal = (plan: SupplierPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code,
      description: plan.description || '',
      monthlyPrice: plan.monthlyPrice.toString(),
      yearlyPrice: plan.yearlyPrice?.toString() || '',
      maxProducts: plan.maxProducts?.toString() || '',
      maxOrdersPerMonth: plan.maxOrdersPerMonth?.toString() || '',
      maxTeamMembers: plan.maxTeamMembers?.toString() || '',
      maxWarehouses: plan.maxWarehouses?.toString() || '',
      bulkPricing: plan.bulkPricing || false,
      apiAccess: plan.apiAccess || false,
      featuredListings: plan.featuredListings || false,
      customBranding: plan.customBranding || false,
      whiteLabel: plan.whiteLabel || false,
      analytics: plan.analytics || false,
      prioritySupport: plan.prioritySupport || false,
      advancedReporting: plan.advancedReporting || false,
      multiCurrency: plan.multiCurrency || false,
      popular: plan.popular || false,
    });
    setShowEditModal(true);
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

  const stats = {
    total: plans.length,
    active: plans.filter(p => p.active).length,
    popular: plans.filter(p => p.popular).length,
    avgPrice: plans.length > 0 
      ? (plans.reduce((a, p) => a + p.monthlyPrice, 0) / plans.length).toFixed(2)
      : "0.00",
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingPlans) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
        <ThreeScene />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-sm text-blue-300/60">Loading supplier plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 overflow-hidden">
      <ThreeScene />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Nav */}
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
              <TruckIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Supplier Plans</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Plan</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1.5"
            >
              <ArrowRightOnRectangleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
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
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-blue-950 to-indigo-950 z-50 lg:hidden p-4 border-r border-white/10 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-6 w-6 text-cyan-400" />
                    <span className="text-sm font-bold text-white">KROWNBRAIDS</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
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
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {alert && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${
                alert.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                  : 'bg-red-500/20 border border-red-400/30 text-red-400'
              }`}>
                {alert.type === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                <span className="text-sm">{alert.message}</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total Plans</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Active</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-purple-400/50 uppercase tracking-wider">Popular</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-purple-400">{stats.popular}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-amber-400/50 uppercase tracking-wider">Avg Price</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-amber-400">£{stats.avgPrice}</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search supplier plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-7 sm:px-9 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all ${
                    !plan.active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="h-1 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-3" />

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">{plan.name}</h3>
                        {plan.popular && (
                          <span className="text-[8px] bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 rounded-full text-white font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-white mt-1">£{plan.monthlyPrice}</p>
                      <p className="text-[10px] sm:text-xs text-blue-300/50">/month</p>
                      {plan.description && (
                        <p className="text-[10px] sm:text-xs text-white/40 mt-1">{plan.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                        plan.active 
                          ? "bg-green-500/20 text-green-400 border border-green-400/30"
                          : "bg-red-500/20 text-red-400 border border-red-400/30"
                      }`}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-[8px] text-white/40">{plan.code}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                      <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                      {plan.maxProducts === null ? "Unlimited products" : `${plan.maxProducts} products`}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                      <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                      {plan.maxOrdersPerMonth === null ? "Unlimited orders" : `${plan.maxOrdersPerMonth} orders/month`}
                    </div>
                    {plan.bulkPricing && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                        Bulk pricing
                      </div>
                    )}
                    {plan.apiAccess && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                        API access
                      </div>
                    )}
                    {plan.whiteLabel && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                        White-label
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`text-[10px] sm:text-xs font-medium transition-colors ${
                        plan.active 
                          ? 'text-red-400/60 hover:text-red-400' 
                          : 'text-green-400/60 hover:text-green-400'
                      }`}
                    >
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <div className="flex gap-1 sm:gap-1.5">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-1 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors"
                      >
                        <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, planId: plan.id, planName: plan.name })}
                        className="p-1 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">📦</div>
                <p className="text-sm sm:text-base text-white/60">No supplier plans found</p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal (shared component could be built later) */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {showEditModal ? 'Edit Supplier Plan' : 'Add Supplier Plan'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingPlan(null);
                  resetForm();
                }}
                className="text-white/60 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditPlan : handleAddPlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                    required
                    disabled={showEditModal}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Monthly Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Yearly Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Products (blank = unlimited)</label>
                  <input
                    type="number"
                    value={formData.maxProducts}
                    onChange={(e) => setFormData({ ...formData, maxProducts: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Orders/Month</label>
                  <input
                    type="number"
                    value={formData.maxOrdersPerMonth}
                    onChange={(e) => setFormData({ ...formData, maxOrdersPerMonth: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Team Members</label>
                  <input
                    type="number"
                    value={formData.maxTeamMembers}
                    onChange={(e) => setFormData({ ...formData, maxTeamMembers: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Warehouses</label>
                  <input
                    type="number"
                    value={formData.maxWarehouses}
                    onChange={(e) => setFormData({ ...formData, maxWarehouses: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'bulkPricing', label: 'Bulk Pricing' },
                    { key: 'apiAccess', label: 'API Access' },
                    { key: 'featuredListings', label: 'Featured Listings' },
                    { key: 'customBranding', label: 'Custom Branding' },
                    { key: 'whiteLabel', label: 'White Label' },
                    { key: 'analytics', label: 'Analytics' },
                    { key: 'prioritySupport', label: 'Priority Support' },
                    { key: 'advancedReporting', label: 'Advanced Reporting' },
                    { key: 'multiCurrency', label: 'Multi-Currency' },
                    { key: 'popular', label: 'Popular (Featured)' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-white/60">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                        className="w-4 h-4 accent-amber-500"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-sm font-medium text-white"
                >
                  {showEditModal ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Delete Supplier Plan</h2>
            <p className="text-white/60 text-center text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{deleteModal.planName}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, planId: null, planName: "" })}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm text-white"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}