// app/admin/page.tsx
import { getOrderStats } from "@/src/actions/orders";
import { getProducts } from "@/src/actions/products";
import { getAppointmentStats } from "@/src/actions/appointments";
import { getHeroSlides } from "@/src/actions/hero";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import { StatCard } from "@/src/components/admin/admin-ui";
import Link from "next/link";

export default async function AdminDashboard() {
  const [orderStats, products, apptStats, heroSlides] = await Promise.all([
    getOrderStats(),
    getProducts(),
    getAppointmentStats(),
    getHeroSlides(),
  ]);

  const quickLinks = [
    { label: "Add Product", href: "/admin/products/new", icon: "+" },
    { label: "New Lookbook", href: "/admin/lookbooks/new", icon: "+" },
    { label: "New Article", href: "/admin/journal/new", icon: "+" },
    { label: "Hero Slides", href: "/admin/hero", icon: "→" },
  ];

  return (
    <AdminPageShell title="Dashboard" subtitle="Welcome back">
      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Orders"
          value={orderStats.total}
          sub={`${orderStats.pending} pending`}
          accent
        />
        <StatCard
          label="Revenue"
          value={`₦${(orderStats.totalRevenue / 100).toLocaleString()}`}
          sub="paid orders"
        />
        <StatCard
          label="Products"
          value={products.length}
          sub="in catalogue"
        />
        <StatCard
          label="Appointments"
          value={apptStats.total}
          sub={`${apptStats.pending} pending`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Pipeline */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-5">
          <h3 className="text-gray-600 text-xs tracking-[0.15em] uppercase mb-4">
            Order Pipeline
          </h3>
          <div className="space-y-3">
            {[
              { label: "Pending", count: orderStats.pending, color: "bg-yellow-500/20 text-yellow-400" },
              { label: "In Production", count: orderStats.inProduction, color: "bg-blue-500/20 text-blue-400" },
              { label: "Shipped", count: orderStats.shipped, color: "bg-green-500/20 text-green-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 font-medium ${s.color}`}>
                  {s.label}
                </span>
                <div className="flex-1 h-1.5 bg-gray-50 overflow-hidden">
                  <div
                    className="h-full bg-gray-900 transition-all"
                    style={{
                      width: orderStats.total
                        ? `${(s.count / orderStats.total) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-gray-500 text-sm tabular-nums">{s.count}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/orders"
            className="inline-block mt-4 text-xs text-gray-600 hover:text-gray-900 tracking-wider transition-colors"
          >
            View all orders →
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 p-5">
          <h3 className="text-gray-600 text-xs tracking-[0.15em] uppercase mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickLinks.map((ql) => (
              <Link
                key={ql.href}
                href={ql.href}
                className="flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-300 transition-all group"
              >
                <span className="text-sm text-gray-800 group-hover:text-gray-900 transition-colors">
                  {ql.label}
                </span>
                <span className="text-gray-600 text-sm">{ql.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white border border-gray-100 p-5">
        <h3 className="text-gray-600 text-xs tracking-[0.15em] uppercase mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Hero Slides", value: heroSlides.length, href: "/admin/hero" },
            { label: "Products", value: products.length, href: "/admin/products" },
            { label: "Appointments", value: apptStats.confirmed, note: "confirmed", href: "/admin/appointments" },
            { label: "Low Stock", value: "—", href: "/admin/inventory" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-center p-3 bg-gray-50 hover:bg-white/6 border border-gray-100 hover:border-gray-200 transition-all"
            >
              <div className="text-xl font-light text-gray-900 mb-0.5">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
