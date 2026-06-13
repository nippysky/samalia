// app/admin/journal/page.tsx
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
import { getJournalArticles, deleteJournalArticle, updateJournalArticle } from "@/src/actions/journal";
import { formatDate } from "@/src/lib/utils";
import type { JournalArticle } from "@/src/generated/prisma/client";

export default function JournalPage() {
  const [articles, setArticles] = React.useState<JournalArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setArticles(await getJournalArticles());
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteJournalArticle(deleteTarget);
    setDeleteTarget(null);
    await load();
  }

  async function handleToggle(article: JournalArticle) {
    await updateJournalArticle(article.id, { published: !article.published });
    await load();
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="Journal"
      subtitle={`${articles.length} articles`}
      actions={
        <Link href="/admin/journal/new">
          <AdminButton size="sm">+ New Article</AdminButton>
        </Link>
      }
    >
      {articles.length === 0 ? (
        <AdminEmptyState
          title="No articles yet"
          description="Publish your first journal entry."
          action={
            <Link href="/admin/journal/new">
              <AdminButton>+ New Article</AdminButton>
            </Link>
          }
        />
      ) : (
        <AdminTable headers={["Cover", "Title", "Category", "Status", "Date", ""]}>
          {articles.map((a) => (
            <AdminTableRow key={a.id}>
              <AdminTableCell>
                {a.coverImageSrc ? (
                  <img src={a.coverImageSrc} alt={a.title} className="w-14 h-10 object-cover" />
                ) : (
                  <div className="w-14 h-10 bg-gray-50" />
                )}
              </AdminTableCell>
              <AdminTableCell>
                <div>
                  <p className="text-gray-800 text-sm font-medium">{a.title}</p>
                  {a.subtitle && <p className="text-gray-400 text-xs mt-0.5">{a.subtitle}</p>}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 text-sm">{a.category ?? "—"}</span>
              </AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={a.published ? "success" : "neutral"}>
                  {a.published ? "Published" : "Draft"}
                </StatusBadge>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-400 text-sm">{formatDate(a.publishedAt ?? a.createdAt)}</span>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 justify-end">
                  <AdminButton variant="ghost" size="sm" onClick={() => handleToggle(a)}>
                    {a.published ? "Unpublish" : "Publish"}
                  </AdminButton>
                  <Link href={`/admin/journal/${a.id}`}>
                    <AdminButton variant="outline" size="sm">Edit</AdminButton>
                  </Link>
                  <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(a.id)}>
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
        title="Delete Article"
        message="This will permanently remove the article and all its content blocks."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </AdminPageShell>
  );
}
