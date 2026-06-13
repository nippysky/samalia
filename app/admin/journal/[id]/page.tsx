// app/admin/journal/[id]/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  AdminSelect,
  AdminPageLoader,
  ConfirmDialog,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import {
  getJournalArticleById,
  updateJournalArticle,
  addJournalBlock,
  updateJournalBlock,
  deleteJournalBlock,
} from "@/src/actions/journal";
import type { JournalArticle, JournalBlock } from "@/src/generated/prisma/client";

type ArticleFull = JournalArticle & { blocks: JournalBlock[] };

const BLOCK_TYPES = [
  { value: "PARAGRAPH", label: "Paragraph" },
  { value: "HEADING", label: "Heading" },
  { value: "QUOTE", label: "Quote" },
  { value: "IMAGE", label: "Image" },
  { value: "DIVIDER", label: "Divider" },
];

export default function EditJournalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = React.useState<ArticleFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showAddBlock, setShowAddBlock] = React.useState(false);
  const [deleteBlockId, setDeleteBlockId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState<Record<string, unknown>>({});

  // New block form
  const [newBlockType, setNewBlockType] = React.useState("PARAGRAPH");
  const [newBlockContent, setNewBlockContent] = React.useState("");
  const [newBlockImage, setNewBlockImage] = React.useState<{ publicId: string; src: string; alt: string } | null>(null);
  const [addingBlock, setAddingBlock] = React.useState(false);

  async function load() {
    const a = await getJournalArticleById(params.id);
    if (a) {
      setArticle(a as ArticleFull);
      setForm({
        title: a.title,
        slug: a.slug,
        subtitle: a.subtitle ?? "",
        category: a.category ?? "",
        excerpt: a.excerpt ?? "",
        author: a.author ?? "",
        published: a.published,
        coverImagePublicId: a.coverImagePublicId ?? "",
        coverImageSrc: a.coverImageSrc ?? "",
        coverImageAlt: a.coverImageAlt ?? "",
      });
    }
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!article) return;
    setSaving(true);
    setError("");
    try {
      const result = await updateJournalArticle(article.id, {
        ...form,
        publishedAt: form.published && !article.publishedAt ? new Date() : article.publishedAt,
      });
      if (result && "error" in result) { setError("Validation failed"); return; }
      await load();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddBlock() {
    if (!article) return;
    setAddingBlock(true);
    try {
      await addJournalBlock(
        article.id,
        newBlockType as JournalBlock["type"],
        newBlockContent,
        newBlockImage?.publicId,
        newBlockImage?.src,
        newBlockImage?.alt
      );
      setNewBlockContent("");
      setNewBlockImage(null);
      setShowAddBlock(false);
      await load();
    } finally {
      setAddingBlock(false);
    }
  }

  async function handleDeleteBlock() {
    if (!deleteBlockId) return;
    await deleteJournalBlock(deleteBlockId);
    setDeleteBlockId(null);
    await load();
  }

  if (loading || !article) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title={article.title}
      subtitle="Edit article"
      actions={
        <div className="flex gap-2">
          <AdminButton variant="secondary" size="sm" onClick={async () => {
            await updateJournalArticle(article.id, { published: !article.published, publishedAt: !article.published ? new Date() : article.publishedAt });
            await load();
          }}>
            {article.published ? "Unpublish" : "Publish"}
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/journal")}>← Back</AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl">
        {/* Left: meta */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSave} className="space-y-5">
            <AdminCard>
              <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Meta</h3>
              <div className="space-y-3">
                <AdminInput label="Title" value={form.title as string} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <AdminInput label="Slug" value={form.slug as string} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <AdminInput label="Subtitle" value={form.subtitle as string} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <AdminInput label="Category" value={form.category as string} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <AdminInput label="Author" value={form.author as string} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
                <AdminTextarea label="Excerpt" value={form.excerpt as string} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Cover Image</h3>
              <CloudinaryUpload
                label="Cover"
                value={(form.coverImageSrc as string) ? { publicId: form.coverImagePublicId as string, src: form.coverImageSrc as string, alt: form.coverImageAlt as string } : null}
                onChange={(v) => setForm({ ...form, coverImagePublicId: v?.publicId ?? "", coverImageSrc: v?.src ?? "", coverImageAlt: v?.alt ?? "" })}
                folder="journal"
              />
            </AdminCard>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <AdminButton type="submit" loading={saving}>Save Changes</AdminButton>
          </form>
        </div>

        {/* Right: Content blocks */}
        <div className="lg:col-span-3">
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">
                Content Blocks ({article.blocks.length})
              </h3>
              {!showAddBlock && (
                <AdminButton size="sm" variant="ghost" onClick={() => setShowAddBlock(true)}>
                  + Add Block
                </AdminButton>
              )}
            </div>

            <div className="space-y-3">
              {article.blocks.map((block: any) => (
                <div key={block.id} className="p-3 bg-gray-50 border border-gray-100 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-600 text-xs uppercase tracking-wider">{block.type}</span>
                      {block.type === "IMAGE" && block.imageSrc ? (
                        <img src={block.imageSrc} alt={block.imageAlt ?? ""} className="mt-2 w-full h-28 object-cover" />
                      ) : (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2 whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => setDeleteBlockId(block.id)}
                    >
                      ×
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>

            {/* Add block form */}
            {showAddBlock && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-gray-500 text-xs uppercase tracking-wider">Add Block</h4>
                <AdminSelect
                  label="Block Type"
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value)}
                  options={BLOCK_TYPES}
                />
                {newBlockType === "IMAGE" ? (
                  <CloudinaryUpload
                    label="Image"
                    value={newBlockImage}
                    onChange={setNewBlockImage}
                    folder="journal/blocks"
                  />
                ) : newBlockType !== "DIVIDER" && (
                  <AdminTextarea
                    label="Content"
                    value={newBlockContent}
                    onChange={(e) => setNewBlockContent(e.target.value)}
                    rows={newBlockType === "PARAGRAPH" ? 4 : 2}
                  />
                )}
                <div className="flex gap-2">
                  <AdminButton size="sm" loading={addingBlock} onClick={handleAddBlock}>Add</AdminButton>
                  <AdminButton size="sm" variant="ghost" onClick={() => setShowAddBlock(false)}>Cancel</AdminButton>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteBlockId}
        title="Remove Block"
        message="This block will be permanently removed from the article."
        confirmLabel="Remove"
        onConfirm={handleDeleteBlock}
        onCancel={() => setDeleteBlockId(null)}
        danger
      />
    </AdminPageShell>
  );
}
