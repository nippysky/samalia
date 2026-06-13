// app/admin/appointments/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminEmptyState,
  AdminPageLoader,
  StatusBadge,
  AdminSelect,
  AdminTextarea,
  StatCard,
} from "@/src/components/admin/admin-ui";
import { getAppointments, updateAppointmentStatus, getAppointmentStats } from "@/src/actions/appointments";
import { formatDateTime, appointmentStatusLabel } from "@/src/lib/utils";
import type { Appointment } from "@/src/generated/prisma/client";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const UPDATE_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [stats, setStats] = React.useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [newStatus, setNewStatus] = React.useState<Record<string, string>>({});
  const [adminNotes, setAdminNotes] = React.useState<Record<string, string>>({});

  async function load(s?: string) {
    setLoading(true);
    const [result, statsResult] = await Promise.all([
      getAppointments({ status: (s as Appointment["status"]) || undefined }),
      getAppointmentStats(),
    ]);
    setAppointments(result.items);
    setStats(statsResult);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleUpdateStatus(id: string) {
    setUpdatingId(id);
    await updateAppointmentStatus(id, {
      status: newStatus[id],
      adminNotes: adminNotes[id],
    });
    setUpdatingId(null);
    setExpandedId(null);
    await load(status);
  }

  function statusColor(s: string): "success" | "warning" | "danger" | "neutral" {
    if (s === "CONFIRMED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "CANCELLED" || s === "NO_SHOW") return "danger";
    return "neutral";
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell title="Appointments" subtitle={`${stats.total} total`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} accent />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Completed" value={stats.completed} />
      </div>

      <div className="mb-5">
        <AdminSelect
          value={status}
          onChange={(e) => { setStatus(e.target.value); load(e.target.value); }}
          options={STATUS_OPTIONS}
          className="max-w-[200px]"
        />
      </div>

      {appointments.length === 0 ? (
        <AdminEmptyState title="No appointments found" description="Booking requests will appear here." />
      ) : (
        <AdminTable headers={["Client", "Type", "Date", "Status", ""]}>
          {appointments.map((appt) => (
            <React.Fragment key={appt.id}>
              <AdminTableRow>
                <AdminTableCell>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{appt.clientName}</p>
                    <p className="text-gray-400 text-xs">{appt.clientEmail}</p>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-500 text-sm capitalize">{appt.type.replace(/_/g, " ").toLowerCase()}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-500 text-sm">
                    {appt.scheduledAt ? formatDateTime(appt.scheduledAt) : <span className="text-gray-400 italic">TBD</span>}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={statusColor(appt.status)}>
                    {appointmentStatusLabel(appt.status)}
                  </StatusBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setExpandedId(expandedId === appt.id ? null : appt.id);
                      if (expandedId !== appt.id) {
                        setNewStatus({ ...newStatus, [appt.id]: appt.status });
                        setAdminNotes({ ...adminNotes, [appt.id]: appt.adminNotes ?? "" });
                      }
                    }}
                  >
                    {expandedId === appt.id ? "Close" : "Manage"}
                  </AdminButton>
                </AdminTableCell>
              </AdminTableRow>

              {expandedId === appt.id && (
                <tr>
                  <td colSpan={5} className="bg-gray-50 px-4 pb-4">
                    <div className="border border-gray-100 p-4 space-y-4">
                      {appt.message && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Client Message</p>
                          <p className="text-gray-600 text-sm">{appt.message}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <AdminSelect
                          label="Update Status"
                          value={newStatus[appt.id] ?? appt.status}
                          onChange={(e) => setNewStatus({ ...newStatus, [appt.id]: e.target.value })}
                          options={UPDATE_STATUSES}
                        />
                        <AdminTextarea
                          label="Admin Notes"
                          value={adminNotes[appt.id] ?? ""}
                          onChange={(e) => setAdminNotes({ ...adminNotes, [appt.id]: e.target.value })}
                          rows={2}
                          placeholder="Internal notes…"
                        />
                      </div>
                      <AdminButton
                        size="sm"
                        loading={updatingId === appt.id}
                        onClick={() => handleUpdateStatus(appt.id)}
                      >
                        Save
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </AdminTable>
      )}
    </AdminPageShell>
  );
}
