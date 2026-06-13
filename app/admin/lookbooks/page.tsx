// app/admin/lookbooks/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminEmptyState,
  AdminPageLoader,
  ConfirmDialog,
  StatusBadge,
} from "@/src/components/admin/admin-ui";
import { getLookbooks, deleteLookbook, toggleLookbookPublished } from "@/src/actions/lookbooks";
import { formatDate } from "@/src/lib/utils";
import type { Lookbook, LookbookLook } from "@/src/generated/prisma/client";

type LookbookWithLooks = Lookbook & { looks: LookbookLook[] };

export default function LookbooksPage() {
  const [lookbooks, setLookbooks] = React.useState<LookbookWithLooks[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLookbooks((await getLookbooks()) as LookbookWithLooks[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteLookbook(deleteTarget);
    setDeleteTarget(null);
    await load();
  }

  async function handleToggle(lb: LookbookWithLooks) {
    await toggleLookbookPublished(lb.id, !lb.isPublished);
    await load();
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="Lookbooks"
      subtitle={`${lookbooks.length} collections`}
      actions={
        <Link href="/admin/lookbooks/new">
          <AdminButton size="sm">+ New Lookbook</AdminButton>
        </Link>
      }
    >
      {lookbooks.length === 0 ? (
        <AdminEmptyState
          title="No lookbooks yet"
          description="Create your first lookbook collection."
          action={
            <Link href="/admin/lookbooks/new">
              <AdminButton>+ Create Lookbook</AdminButton>
            </Link>
          }
        />
      ) : (
        <AdminTable headers={["Cover", "Title", "Season", "Looks", "Status", "Date", ""]}>
          {lookbooks.map((lb) => (
            <AdminTableRow key={lb.id}>
              <AdminTableCell>
                {lb.coverImageSrc ? (
                  <img src={lb.coverImageSrc} alt={lb.title} className="w-14 h-18 object-cover" />
                ) : (
                  <div className="w-14 h-18 bg-gray-50" />
                )}
              </AdminTableCell>
              <AdminTableCell>
                <div>
                  <p className="text-gray-800 font-medium text-sm">{lb.title}</p>
                  {lb.subtitle && <p className="text-gray-400 text-xs mt-0.5">{lb.subtitle}</p>}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 text-sm">{lb.season ?? "—"}</span>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 tabular-nums text-sm">{lb.looks.length}</span>
              </AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={lb.isPublished ? "success" : "neutral"}>
                  {lb.isPublished ? "Published" : "Draft"}
                </StatusBadge>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-400 text-sm">{formatDate(lb.createdAt)}</span>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 justify-end">
                  <AdminButton variant="ghost" size="sm" onClick={() => handleToggle(lb)}>
                    {lb.isPublished ? "Unpublish" : "Publish"}
                  </AdminButton>
                  <Link href={`/admin/lookbooks/${lb.id}`}>
                    <AdminButton variant="outline" size="sm">Edit</AdminButton>
                  </Link>
                  <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(lb.id)}>
                    Delete
                  </AdminButton>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Lookbook"
        message="This will permanently remove the lookbook and all its looks."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </AdminPageShell>
  );
}
