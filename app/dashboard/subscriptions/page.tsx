// app/dashboard/subscriptions/page.tsx
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

interface Plan {
  id: number;
  name: string;
  code: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxServices: number;
  maxBookingsPerMonth: number;
  onlineBooking: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  popular: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  subscriberCount?: number;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    monthlyPrice: "",
    yearlyPrice: "",
    maxServices: "",
    maxBookingsPerMonth: "",
    onlineBooking: false,
    analytics: false,
    prioritySupport: false,
    customBranding: false,
    popular: false,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; planId: number | null; planName: string }>({
    isOpen: false,
    planId: null,
    planName: "",
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
    { name: "Subscriptions", icon: CreditCardIcon, href: "/dashboard/subscriptions", current: true },
    { name: "Supplier Plans", icon: TruckIcon, href: "/dashboard/supplier-subscriptions", current: false },

    { name: "Admin", icon: Cog6ToothIcon, href: "/dashboard/admin", current: false },
  ];

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/auth/subscription-plans', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        loadFallbackPlans();
        setLoadingPlans(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched plans:', data);
        
        let plansData = data.data || data || [];
        if (!Array.isArray(plansData)) {
          plansData = [];
        }
        
        // Map the data to ensure isActive is properly set
        const mappedPlans = plansData.map((p: any) => ({
          ...p,
          isActive: p.isActive === true || p.isActive === 'true' || p.active === true,
        }));
        
        setPlans(mappedPlans);
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Failed to fetch subscription plans');
        loadFallbackPlans();
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      showAlert('error', 'Failed to fetch subscription plans');
      loadFallbackPlans();
    } finally {
      setLoadingPlans(false);
    }
  };

  // Fallback plans if API fails
  const loadFallbackPlans = () => {
    setPlans([
      {
        id: 1,
        name: "Starter",
        code: "STARTER",
        description: "Perfect for new salons getting started",
        monthlyPrice: 29,
        yearlyPrice: 290,
        maxServices: 10,
        maxBookingsPerMonth: 50,
        onlineBooking: true,
        analytics: false,
        prioritySupport: false,
        customBranding: false,
        popular: false,
        isActive: true,
        subscriberCount: 45,
      },
      {
        id: 2,
        name: "Professional",
        code: "PROFESSIONAL",
        description: "For growing salons with more demand",
        monthlyPrice: 49,
        yearlyPrice: 490,
        maxServices: 25,
        maxBookingsPerMonth: 200,
        onlineBooking: true,
        analytics: true,
        prioritySupport: true,
        customBranding: false,
        popular: true,
        isActive: true,
        subscriberCount: 78,
      },
      {
        id: 3,
        name: "Enterprise",
        code: "ENTERPRISE",
        description: "For large salons and chains",
        monthlyPrice: 99,
        yearlyPrice: 990,
        maxServices: 100,
        maxBookingsPerMonth: 1000,
        onlineBooking: true,
        analytics: true,
        prioritySupport: true,
        customBranding: true,
        popular: false,
        isActive: true,
        subscriberCount: 34,
      },
    ]);
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

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.monthlyPrice || !formData.maxServices || !formData.maxBookingsPerMonth) {
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
        maxServices: parseInt(formData.maxServices),
        maxBookingsPerMonth: parseInt(formData.maxBookingsPerMonth),
        onlineBooking: formData.onlineBooking,
        analytics: formData.analytics,
        prioritySupport: formData.prioritySupport,
        customBranding: formData.customBranding,
        popular: formData.popular,
      };

      console.log('Creating plan:', payload);

      const response = await fetch('/api/auth/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        showAlert('error', 'Server error. Please try again.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Subscription plan added successfully!');
        setShowAddModal(false);
        setFormData({
          name: "",
          code: "",
          description: "",
          monthlyPrice: "",
          yearlyPrice: "",
          maxServices: "",
          maxBookingsPerMonth: "",
          onlineBooking: false,
          analytics: false,
          prioritySupport: false,
          customBranding: false,
          popular: false,
        });
        fetchPlans();
      } else {
        showAlert('error', data.message || 'Failed to add subscription plan');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
      showAlert('error', 'Failed to add subscription plan');
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPlan || !formData.name || !formData.code || !formData.monthlyPrice) {
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
        maxServices: parseInt(formData.maxServices),
        maxBookingsPerMonth: parseInt(formData.maxBookingsPerMonth),
        onlineBooking: formData.onlineBooking,
        analytics: formData.analytics,
        prioritySupport: formData.prioritySupport,
        customBranding: formData.customBranding,
        popular: formData.popular,
      };

      console.log('Updating plan:', editingPlan.id, payload);

      const response = await fetch(`/api/auth/subscription-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          showAlert('error', 'API endpoint not found. Please check if the server is running.');
        } else {
          showAlert('error', `Server error: ${text.substring(0, 100)}`);
        }
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Plan updated successfully!');
        setShowEditModal(false);
        setEditingPlan(null);
        setFormData({
          name: "",
          code: "",
          description: "",
          monthlyPrice: "",
          yearlyPrice: "",
          maxServices: "",
          maxBookingsPerMonth: "",
          onlineBooking: false,
          analytics: false,
          prioritySupport: false,
          customBranding: false,
          popular: false,
        });
        fetchPlans();
      } else {
        showAlert('error', data.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      showAlert('error', 'Failed to update plan');
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = !plan.isActive;
      
      console.log(`Toggling plan ${plan.id} (${plan.name}) from ${plan.isActive} to ${newStatus}`);

      // Build the full updated plan data
      const updatedPlanData = {
        name: plan.name,
        code: plan.code,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        maxServices: plan.maxServices,
        maxBookingsPerMonth: plan.maxBookingsPerMonth,
        onlineBooking: plan.onlineBooking,
        analytics: plan.analytics,
        prioritySupport: plan.prioritySupport,
        customBranding: plan.customBranding,
        popular: plan.popular,
        isActive: newStatus,
      };

      // Try PATCH first
      let response = await fetch(`/api/auth/subscription-plans/${plan.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      // If PATCH fails, try PUT with full data
      if (response.status === 404 || response.status === 405 || response.status === 500) {
        console.log('PATCH failed, trying PUT as fallback...');
        
        response = await fetch(`/api/auth/subscription-plans/${plan.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPlanData),
        });
      }

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          showAlert('error', 'API endpoint not found. Please check if the server is running.');
        } else {
          showAlert('error', `Server error: ${text.substring(0, 100)}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Toggle status response data:', data);

      if (response.ok) {
        // Update the plan in the local state immediately
        setPlans(prevPlans => {
          const updatedPlans = prevPlans.map(p => 
            p.id === plan.id 
              ? { ...p, isActive: newStatus }
              : p
          );
          console.log('Updated plans:', updatedPlans);
          return updatedPlans;
        });
        
        showAlert('success', `Plan ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        
        // DO NOT call fetchPlans() here - it will revert your changes
      } else {
        showAlert('error', data.message || 'Failed to update plan status');
      }
    } catch (error) {
      console.error('Error toggling plan status:', error);
      showAlert('error', 'Failed to update plan status');
    }
  };

  const handleDeletePlan = async () => {
    const { planId } = deleteModal;
    if (!planId) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/auth/subscription-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      
      if (response.status === 204) {
        setPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
        setDeleteModal({ isOpen: false, planId: null, planName: "" });
        showAlert('success', 'Plan deleted successfully!');
        return;
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        showAlert('error', 'Server error. Please try again.');
        setDeleteModal({ isOpen: false, planId: null, planName: "" });
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
        setDeleteModal({ isOpen: false, planId: null, planName: "" });
        showAlert('success', 'Plan deleted successfully!');
      } else {
        showAlert('error', data.message || 'Failed to delete plan');
        setDeleteModal({ isOpen: false, planId: null, planName: "" });
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showAlert('error', 'Failed to delete plan');
      setDeleteModal({ isOpen: false, planId: null, planName: "" });
    }
  };

  const openDeleteModal = (plan: Plan) => {
    setDeleteModal({
      isOpen: true,
      planId: plan.id,
      planName: plan.name,
    });
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code,
      description: plan.description || '',
      monthlyPrice: plan.monthlyPrice.toString(),
      yearlyPrice: plan.yearlyPrice?.toString() || '',
      maxServices: plan.maxServices?.toString() || '',
      maxBookingsPerMonth: plan.maxBookingsPerMonth?.toString() || '',
      onlineBooking: plan.onlineBooking || false,
      analytics: plan.analytics || false,
      prioritySupport: plan.prioritySupport || false,
      customBranding: plan.customBranding || false,
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

  // Stats
  const stats = {
    total: plans.length,
    active: plans.filter((p) => p.isActive).length,
    totalSubscribers: plans.reduce((acc, plan) => acc + (plan.subscriberCount || 0), 0),
    revenue: plans.reduce((acc, plan) => acc + (plan.isActive ? plan.monthlyPrice : 0), 0),
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
          <p className="text-sm text-blue-300/60">Loading subscriptions...</p>
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
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Subscription Plans</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 sm:gap-2"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Plan</span>
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
                <p className="text-[8px] sm:text-[10px] text-blue-300/50 uppercase tracking-wider">Total Plans</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-green-400/50 uppercase tracking-wider">Active</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-purple-400/50 uppercase tracking-wider">Total Subscribers</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-purple-400">{stats.totalSubscribers}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 border border-white/10">
                <p className="text-[8px] sm:text-[10px] text-amber-400/50 uppercase tracking-wider">Monthly Revenue</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-amber-400">£{stats.revenue}</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300/30" />
                <input
                  type="text"
                  placeholder="Search plans by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-7 sm:px-9 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {filteredPlans.map((plan) => {
                const getColor = (name: string) => {
                  const colors = {
                    'starter': 'from-blue-500 to-cyan-500',
                    'professional': 'from-purple-500 to-pink-500',
                    'enterprise': 'from-amber-500 to-orange-500',
                    'premium': 'from-red-500 to-pink-500',
                  };
                  return colors[name.toLowerCase() as keyof typeof colors] || 'from-gray-500 to-gray-600';
                };

                return (
                  <div
                    key={plan.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] ${
                      !plan.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`h-1 w-full rounded-full bg-gradient-to-r ${getColor(plan.name)} mb-3`} />

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
                        {plan.yearlyPrice && (
                          <p className="text-[10px] text-green-400/60">Save with annual: £{plan.yearlyPrice}/year</p>
                        )}
                        {plan.description && (
                          <p className="text-[10px] sm:text-xs text-white/40 mt-1">{plan.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                          plan.isActive 
                            ? "bg-green-500/20 text-green-400 border border-green-400/30"
                            : "bg-red-500/20 text-red-400 border border-red-400/30"
                        }`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-[8px] text-white/40">{plan.code}</span>
                        {plan.subscriberCount !== undefined && (
                          <span className="text-[8px] sm:text-[10px] text-white/40">
                            {plan.subscriberCount} subscribers
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                        {plan.maxServices} services
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                        {plan.maxBookingsPerMonth} bookings/month
                      </div>
                      {plan.onlineBooking && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                          <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                          Online booking
                        </div>
                      )}
                      {plan.analytics && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                          <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                          Analytics
                        </div>
                      )}
                      {plan.prioritySupport && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                          <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                          Priority support
                        </div>
                      )}
                      {plan.customBranding && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
                          <CheckCircleIcon className="h-3 w-3 text-green-400 flex-shrink-0" />
                          Custom branding
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={`text-[10px] sm:text-xs font-medium transition-colors ${
                          plan.isActive 
                            ? 'text-red-400/60 hover:text-red-400' 
                            : 'text-green-400/60 hover:text-green-400'
                        }`}
                      >
                        {plan.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <div className="flex gap-1 sm:gap-1.5">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="p-1 rounded hover:bg-white/10 text-yellow-300/50 hover:text-yellow-300 transition-colors"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(plan)}
                          className="p-1 rounded hover:bg-white/10 text-red-400/50 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl mb-3">💳</div>
                <p className="text-sm sm:text-base text-white/60">No subscription plans found</p>
                <p className="text-xs sm:text-sm text-blue-300/40 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add Subscription Plan</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="e.g., Pro"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="e.g., PRO"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="Describe the plan..."
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="29.99"
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="299.99"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Services *</label>
                  <input
                    type="number"
                    value={formData.maxServices}
                    onChange={(e) => setFormData({ ...formData, maxServices: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Bookings/Month *</label>
                  <input
                    type="number"
                    value={formData.maxBookingsPerMonth}
                    onChange={(e) => setFormData({ ...formData, maxBookingsPerMonth: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Features</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.onlineBooking}
                      onChange={(e) => setFormData({ ...formData, onlineBooking: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    Online Booking
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.analytics}
                      onChange={(e) => setFormData({ ...formData, analytics: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    Analytics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.prioritySupport}
                      onChange={(e) => setFormData({ ...formData, prioritySupport: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    Priority Support
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.customBranding}
                      onChange={(e) => setFormData({ ...formData, customBranding: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    Custom Branding
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    Popular (Featured)
                  </label>
                </div>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-[1.02]"
                >
                  Add Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && editingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Plan</h2>
              <button onClick={() => { setShowEditModal(false); setEditingPlan(null); }} className="text-white/60 hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditPlan} className="space-y-4">
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Plan Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Services *</label>
                  <input
                    type="number"
                    value={formData.maxServices}
                    onChange={(e) => setFormData({ ...formData, maxServices: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Max Bookings/Month *</label>
                  <input
                    type="number"
                    value={formData.maxBookingsPerMonth}
                    onChange={(e) => setFormData({ ...formData, maxBookingsPerMonth: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Features</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.onlineBooking}
                      onChange={(e) => setFormData({ ...formData, onlineBooking: e.target.checked })}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Online Booking
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.analytics}
                      onChange={(e) => setFormData({ ...formData, analytics: e.target.checked })}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Analytics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.prioritySupport}
                      onChange={(e) => setFormData({ ...formData, prioritySupport: e.target.checked })}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Priority Support
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.customBranding}
                      onChange={(e) => setFormData({ ...formData, customBranding: e.target.checked })}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Custom Branding
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Popular (Featured)
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingPlan(null); }}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-yellow-500/30 transition-all hover:scale-[1.02]"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white text-center mb-2">Delete Subscription Plan</h2>
            <p className="text-white/60 text-center text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{deleteModal.planName}"</span>? 
              This action cannot be undone and all associated data will be permanently removed.
            </p>

            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 mb-6">
              <p className="text-red-300/70 text-xs text-center">
                ⚠️ Warning: This will permanently delete the plan and any associated subscriptions.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, planId: null, planName: "" })}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-red-500/30 transition-all hover:scale-[1.02]"
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