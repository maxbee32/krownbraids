// app/dashboard/suppliers/SupplierDetailDrawer.tsx
"use client";

import { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  CreditCard,
  Calendar,
  TriangleAlert,
} from "lucide-react";

export interface SupplierWithStatus {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean | null;
  isVerified: boolean | null;
  createdAt: string | null;
  lastLogin: string | null;
  role: string | null;

  businessId: string | null;
  companyName: string | null;
  companyType: string | null;
  planName: string | null;
  billingCycle: string | null;

  status: string | null;
  onboardingStep: string | null;
  onboardingCompleted: boolean | null;

  paymentStatus: string | null;
  paymentReference: string | null;
  paymentCompletedAt: string | null;

  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;

  businessCreatedAt: string | null;
  businessUpdatedAt: string | null;
}

interface Props {
  supplier: SupplierWithStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (businessId: string | null) => void | Promise<void>;
  onReject: (businessId: string | null) => void | Promise<void>;
  isWorking: boolean;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function Row({
  icon,
  label,
  value,
  mono,
  accent,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  accent?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 text-blue-300/60 flex-shrink-0">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div
        className={`text-right text-xs sm:text-sm ${
          mono ? "font-mono break-all" : ""
        } ${accent || "text-white"}`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

export function SupplierDetailDrawer({
  supplier,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isWorking,
  onNotify,
}: Props) {
  // Local toast — shows inside the modal
  const [drawerAlert, setDrawerAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showDrawerAlert = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setDrawerAlert({ type, message });
    // Also bubble up to the parent page so it can display its own toast
    onNotify?.(type, message);
    setTimeout(() => setDrawerAlert(null), 5000);
  };

  if (!isOpen || !supplier) return null;

  const isActionable =
    supplier.status === "PENDING_APPROVAL" ||
    supplier.status === "PAYMENT_CONFIRMED";

  const handleApproveClick = async () => {
    if (!supplier.businessId) return;
    try {
      await onApprove(supplier.businessId);
      // Parent's handleApprove already updates state and calls closeDrawer
      // so on success this drawer will unmount — no local alert needed
    } catch (err) {
      console.error(err);
      showDrawerAlert("error", "Failed to approve supplier.");
    }
  };

  const handleRejectClick = async () => {
    if (!supplier.businessId) return;
    try {
      await onReject(supplier.businessId);
    } catch (err) {
      console.error(err);
      showDrawerAlert("error", "Failed to reject supplier.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
        <div
          className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-blue-950 to-indigo-950 border border-white/15 rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-white/10 px-5 sm:px-6 py-4 flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {supplier.companyName || supplier.fullName}
              </h2>
              <p className="text-xs text-blue-300/60">
                {supplier.status ? supplier.status.replace(/_/g, " ") : "—"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Drawer-local alert */}
            {drawerAlert && (
              <div
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  drawerAlert.type === "success"
                    ? "bg-green-500/20 border border-green-400/30 text-green-400"
                    : drawerAlert.type === "info"
                    ? "bg-blue-500/20 border border-blue-400/30 text-blue-400"
                    : "bg-red-500/20 border border-red-400/30 text-red-400"
                }`}
              >
                {drawerAlert.type === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <TriangleAlert className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm flex-1">{drawerAlert.message}</span>
                <button
                  onClick={() => setDrawerAlert(null)}
                  className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            {isActionable && supplier.businessId && (
              <div className="flex gap-3">
                <button
                  onClick={handleApproveClick}
                  disabled={isWorking}
                  className="flex-1 py-3 rounded-xl bg-green-600/60 hover:bg-green-600/80 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWorking ? (
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
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={isWorking}
                  className="flex-1 py-3 rounded-xl bg-red-600/40 hover:bg-red-600/60 text-red-100 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )}

            {/* Business info */}
            <section>
              <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-3">
                Business
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <Row
                  icon={<Building className="h-4 w-4" />}
                  label="Company"
                  value={supplier.companyName}
                />
                <Row label="Type" value={supplier.companyType} />
                <Row
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={supplier.email}
                />
                <Row
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={supplier.phone}
                />
                <Row
                  label="Plan"
                  value={
                    supplier.planName && supplier.billingCycle
                      ? `${supplier.planName} • ${supplier.billingCycle}`
                      : supplier.planName
                  }
                />
              </div>
            </section>

            {/* Account info */}
            <section>
              <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-3">
                Account
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <Row label="Supplier ID" value={supplier.id} mono />
                <Row label="Business ID" value={supplier.businessId} mono />
                <Row
                  label="Verified"
                  value={supplier.isVerified ? "Yes" : "No"}
                  accent={supplier.isVerified ? "text-cyan-400" : undefined}
                />
                <Row
                  label="Active"
                  value={supplier.isActive ? "Yes" : "No"}
                  accent={supplier.isActive ? "text-green-400" : "text-red-400"}
                />
                <Row
                  icon={<Calendar className="h-4 w-4" />}
                  label="Registered"
                  value={formatDate(supplier.createdAt)}
                />
                <Row
                  label="Last login"
                  value={formatDate(supplier.lastLogin)}
                />
              </div>
            </section>

            {/* Onboarding status */}
            <section>
              <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-3">
                Onboarding
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <Row label="Step" value={supplier.onboardingStep || "—"} />
                <Row
                  label="Completed"
                  value={supplier.onboardingCompleted ? "Yes" : "No"}
                />
                <Row
                  label="Business created"
                  value={formatDate(supplier.businessCreatedAt)}
                />
                <Row
                  label="Last updated"
                  value={formatDate(supplier.businessUpdatedAt)}
                />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-3">
                Payment
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <Row
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Status"
                  value={supplier.paymentStatus}
                  accent={
                    supplier.paymentStatus === "SUCCESS"
                      ? "text-green-400"
                      : supplier.paymentStatus === "PENDING"
                      ? "text-yellow-400"
                      : undefined
                  }
                />
                <Row
                  label="Reference"
                  value={supplier.paymentReference}
                  mono
                />
                <Row
                  label="Paid at"
                  value={formatDate(supplier.paymentCompletedAt)}
                />
              </div>
            </section>

            {/* Subscription */}
            <section>
              <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider mb-3">
                Subscription
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                <Row
                  label="Start"
                  value={formatDate(supplier.subscriptionStartDate)}
                />
                <Row
                  label="End"
                  value={formatDate(supplier.subscriptionEndDate)}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}