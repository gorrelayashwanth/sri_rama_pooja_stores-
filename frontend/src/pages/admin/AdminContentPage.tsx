import { FileText, Image, LayoutPanelTop, Sparkles } from "lucide-react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";

const contentBlocks = [
  {
    title: "Homepage Hero",
    description: "Manage the main title, subtitle, and hero background media.",
    status: "Connected to frontend copy",
    icon: LayoutPanelTop,
  },
  {
    title: "Category Highlights",
    description: "Review category card labels and homepage category imagery.",
    status: "Images updated",
    icon: Image,
  },
  {
    title: "Store Story",
    description: "Plan content for about page, store information, and trust signals.",
    status: "Ready for API",
    icon: FileText,
  },
];

export function AdminContentPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Content" subtitle="Storefront Copy" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-playfair font-bold text-puja-text">Content Control</h1>
              <p className="text-sm text-puja-muted">This admin section is now routed correctly and gives you a proper place for managing storefront content.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-saffron-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-saffron-700">
              <Sparkles className="h-4 w-4" />
              Planned for content CMS wiring
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {contentBlocks.map((block) => (
            <div key={block.title} className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f7f4] text-[#2d4a2d]">
                <block.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-puja-text">{block.title}</h2>
              <p className="mt-2 text-sm leading-7 text-puja-muted">{block.description}</p>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-saffron-600">{block.status}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
