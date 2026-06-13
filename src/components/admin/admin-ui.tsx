// src/components/admin/admin-ui.tsx
// Shared UI primitives for the admin dashboard — pure white/black minimalist theme

"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ── Buttons ───────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40",
  secondary:
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40",
  ghost:
    "text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-40",
  outline:
    "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[11px] tracking-[0.14em] gap-1.5",
  md: "px-4 py-2 text-[11px] tracking-[0.16em] gap-2",
  lg: "px-6 py-3 text-[11.5px] tracking-[0.18em] gap-2.5",
};

export function AdminButton({
  variant = "primary",
  size = "md",
  loading,
  iconBefore,
  iconAfter,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled ?? loading}
      className={cn(
        "inline-flex items-center justify-center font-medium uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 focus-visible:outline-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin shrink-0" />
      ) : (
        iconBefore && <span className="shrink-0">{iconBefore}</span>
      )}
      {children}
      {!loading && iconAfter && <span className="shrink-0">{iconAfter}</span>}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const AdminInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={cn(
            "w-full bg-white border text-gray-900 px-3 py-2 text-[13px] outline-none transition-colors placeholder:text-gray-300",
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-gray-900",
            className
          )}
        />
        {error && <p className="text-red-500 text-[11px]">{error}</p>}
        {hint && !error && <p className="text-gray-400 text-[11px]">{hint}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";

// ── Textarea ──────────────────────────────────────────────────────

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, rows = 4, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          {...props}
          className={cn(
            "w-full bg-white border text-gray-900 px-3 py-2 text-[13px] outline-none transition-colors resize-y placeholder:text-gray-300",
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-gray-900",
            className
          )}
        />
        {error && <p className="text-red-500 text-[11px]">{error}</p>}
        {hint && !error && <p className="text-gray-400 text-[11px]">{hint}</p>}
      </div>
    );
  }
);
AdminTextarea.displayName = "AdminTextarea";

// ── Select ────────────────────────────────────────────────────────

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export const AdminSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          {...props}
          className={cn(
            "w-full bg-white border text-gray-900 px-3 py-2 text-[13px] outline-none transition-colors appearance-none",
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-gray-900",
            className
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-[11px]">{error}</p>}
      </div>
    );
  }
);
AdminSelect.displayName = "AdminSelect";

// ── Toggle / Switch ───────────────────────────────────────────────

export function AdminToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[13px] text-gray-700">{label}</span>
        {description && (
          <span className="text-[11px] text-gray-400 mt-0.5">{description}</span>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative shrink-0 w-10 h-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900",
          checked ? "bg-gray-900" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  trend?: { direction: "up" | "down" | "neutral"; label: string };
  accent?: boolean;
}) {
  return (
    <div className={cn("border p-5 sm:p-6 bg-white", accent ? "border-gray-900" : "border-gray-100")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-gray-400 font-medium mb-2">
            {label}
          </p>
          <p
            className="text-gray-900 font-light leading-none"
            style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
          >
            {value}
          </p>
          {sub && <p className="text-gray-400 text-[11px] mt-2">{sub}</p>}
          {trend && (
            <p
              className={cn(
                "text-[11px] mt-2",
                trend.direction === "up" && "text-green-600",
                trend.direction === "down" && "text-red-500",
                trend.direction === "neutral" && "text-gray-400"
              )}
            >
              {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="shrink-0 w-9 h-9 bg-gray-100 flex items-center justify-center">
            <Icon size={18} className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────

export function AdminCard({
  title,
  description,
  children,
  actions,
  className,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white border border-gray-100", className)}>
      {(title ?? description ?? actions) && (
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            {title && (
              <h2 className="text-gray-800 text-[13px] font-medium tracking-wide">{title}</h2>
            )}
            {description && (
              <p className="text-gray-400 text-[11px] mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children && <div className="px-5 sm:px-6 py-5">{children}</div>}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────

type StatusType = "success" | "warning" | "error" | "danger" | "neutral" | "info";

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  error:   "bg-red-50 text-red-600 border border-red-200",
  danger:  "bg-red-50 text-red-600 border border-red-200",
  neutral: "bg-gray-50 text-gray-500 border border-gray-200",
  info:    "bg-blue-50 text-blue-600 border border-blue-200",
};

export function StatusBadge({
  type,
  status,
  children,
}: {
  type?: StatusType;
  status?: StatusType;
  children: React.ReactNode;
}) {
  const resolved = status ?? type ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase font-medium",
        statusStyles[resolved]
      )}
    >
      {children}
    </span>
  );
}

// ── Empty state ───────────────────────────────────────────────────

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
          <Icon size={22} className="text-gray-300" />
        </div>
      )}
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-[12px] max-w-xs mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

// ── Page loader ───────────────────────────────────────────────────

export function AdminPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border border-gray-100" />
          <div className="absolute inset-0 border-t border-gray-900 animate-spin" />
        </div>
        <p className="text-gray-400 text-[11px] tracking-[0.2em] uppercase">Loading</p>
      </div>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────

export function ConfirmDialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  description,
  message,
  confirmLabel = "Confirm",
  loading,
  danger,
}: {
  open: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
  danger?: boolean;
}) {
  if (!open) return null;
  const handleClose = onCancel ?? onClose ?? (() => {});
  const body = message ?? description;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white border border-gray-200 p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-gray-900 text-[15px] font-light mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          {title}
        </h3>
        {body && (
          <p className="text-gray-500 text-[13px] mb-6 leading-relaxed">{body}</p>
        )}
        <div className="flex gap-3 justify-end">
          <AdminButton variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton variant={danger ? "danger" : "primary"} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────

export function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[9.5px] tracking-[0.22em] uppercase text-gray-400 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function AdminTableRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-gray-50 transition-colors",
        onClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50/50"
      )}
    >
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 text-[13px] text-gray-600", className)}>
      {children}
    </td>
  );
}

// ── Form action bar ───────────────────────────────────────────────
// Place at the bottom of any form. Adds generous top spacing so the
// buttons always have room to breathe below the last field.

export function AdminFormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 flex-wrap">
      {children}
    </div>
  );
}
