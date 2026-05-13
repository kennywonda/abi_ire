import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/middleware/adminAuth";
import AdminNav from "@/components/admin/admin-nav";
import { Toaster } from "@/components/ui/toaster";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Toaster />
    </div>
  );
}
