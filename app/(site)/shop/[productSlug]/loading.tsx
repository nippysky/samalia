// app/shop/[productSlug]/loading.tsx
export default function ProductLoading() {
  return (
    <main className="bg-white text-black">
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,430px)]">
        <section className="grid min-w-0 grid-cols-2 gap-px bg-white">
          <div className="aspect-4/5 animate-pulse bg-black/5" />
          <div className="aspect-4/5 animate-pulse bg-black/5" />
          <div className="aspect-4/5 animate-pulse bg-black/5" />
          <div className="aspect-4/5 animate-pulse bg-black/5" />
        </section>

        <aside className="border-l border-black/10 bg-white px-7 py-8">
          <div className="h-3 w-32 animate-pulse bg-black/10" />
          <div className="mt-6 h-8 w-56 animate-pulse bg-black/10" />
          <div className="mt-5 h-20 w-full animate-pulse bg-black/10" />
          <div className="mt-8 h-12 w-full animate-pulse bg-black/10" />
          <div className="mt-8 h-40 w-full animate-pulse bg-black/10" />
        </aside>
      </div>

      <div className="lg:hidden">
        <div className="aspect-4/5 min-h-[62svh] animate-pulse bg-black/5" />
        <div className="px-4 py-8">
          <div className="h-3 w-32 animate-pulse bg-black/10" />
          <div className="mt-6 h-8 w-56 animate-pulse bg-black/10" />
          <div className="mt-5 h-20 w-full animate-pulse bg-black/10" />
          <div className="mt-8 h-12 w-full animate-pulse bg-black/10" />
        </div>
      </div>
    </main>
  );
}