// app/dashboard/salons/[id]/edit/page.tsx
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
import ThreeScene from "../../../../components/ThreeScene";

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

export default function EditSalonPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phoneNumber: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });

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
      
      // Handle different response formats
      let salonData = data;
      if (data.data) {
        salonData = data.data;
      } else if (data.value) {
        salonData = data.value;
      }
      
      setSalon(salonData);
      setFormData({
        name: salonData.name || "",
        description: salonData.description || "",
        email: salonData.email || "",
        phoneNumber: salonData.phoneNumber || "",
        website: salonData.website || "",
        address: salonData.address || "",
        city: salonData.city || "",
        state: salonData.state || "",
        country: salonData.country || "",
        postalCode: salonData.postalCode || "",
        facebook: salonData.facebook || "",
        instagram: salonData.instagram || "",
        twitter: salonData.twitter || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salon:", error);
      showAlert('error', 'Failed to fetch salon details');
      setLoading(false);
    }
  };

  // Update salon
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/auth/salon/${salonId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Salon updated successfully!');
        setTimeout(() => {
          router.push(`/dashboard/salons/${salonId}`);
        }, 1500);
      } else {
        showAlert('error', data.message || 'Failed to update salon');
      }
    } catch (error) {
      console.error("Error updating salon:", error);
      showAlert('error', 'Failed to update salon');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
      return;
    }
    fetchSalon();
  }, [salonId, router]);

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
            <Link href={`/dashboard/salons/${salonId}`} className="text-white/60 hover:text-white transition-colors">
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <ScissorsIcon className="h-6 w-6 sm:h-7 sm:w-8 text-cyan-400" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">KROWNBRAIDS</h1>
                <p className="hidden xs:block text-[8px] sm:text-[9px] md:text-[10px] text-blue-300/50 tracking-widest uppercase">Edit Salon</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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
              {/* Header */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl sm:text-4xl">
                      <BuildingOfficeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">{salon.name}</h1>
                      <p className="text-sm text-blue-300/50">Editing salon details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${salon.status === "APPROVED" ? "bg-green-500/20 text-green-400" : salon.status === "REJECTED" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {salon.status === "APPROVED" ? "Approved" : salon.status === "REJECTED" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleUpdate} className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <BuildingOfficeIcon className="h-5 w-5 text-cyan-400" />
                      Basic Information
                    </h2>
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Salon Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter salon name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none"
                      placeholder="Enter salon description"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2 mt-2">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-cyan-400" />
                      Contact Information
                    </h2>
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter website URL"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 mt-2">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-cyan-400" />
                      Address
                    </h2>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">State/Region</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter state/region"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter country"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter postal code"
                    />
                  </div>

                  {/* Social Media */}
                  <div className="md:col-span-2 mt-2">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                      Social Media
                    </h2>
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter Facebook URL"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter Instagram URL"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300/50 uppercase tracking-wider block mb-1.5">Twitter</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      placeholder="Enter Twitter URL"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <Link
                    href={`/dashboard/salons/${salonId}`}
                    className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}