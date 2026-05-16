import { FileText, LayoutPanelTop, Save, Layout, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api/axios";

export function AdminContentPage() {
  const [content, setContent] = useState({
    heroTitle: "",
    heroSubtitle: "",
    aboutText: "",
    missionText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchContent = async () => {
    try {
      const response = await api.get('/content');
      if (response.data.data) {
        setContent(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put('/content', content);
      setMessage({ type: "success", text: "Content updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update content." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center italic text-puja-muted">Loading content CMS...</div>;

  return (
    <AdminLayout>
      <AdminHeader title="Content CMS" subtitle="Storefront Management" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-playfair font-bold text-puja-text">Homepage & Story</h1>
            <p className="text-sm text-puja-muted">Update the main text elements across your storefront.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Hero Section */}
            <div className="space-y-6 p-6 rounded-[28px] bg-gray-50/50 border border-gray-100">
              <div className="flex items-center gap-3 text-saffron-600">
                <LayoutPanelTop className="h-5 w-5" />
                <h3 className="font-bold text-puja-text uppercase text-[10px] tracking-widest">Hero Section</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-puja-muted">Main Headline</span>
                  <input
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    placeholder="e.g. Your One-Stop Shop for All Spiritual Needs"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-puja-muted">Sub-Headline</span>
                  <textarea
                    rows={2}
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    placeholder="Describe your store's value proposition..."
                  />
                </label>
              </div>
            </div>

            {/* About & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-[28px] bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-3 text-green-600">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-bold text-puja-text uppercase text-[10px] tracking-widest">About Store</h3>
                </div>
                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-puja-muted">Our Story</span>
                  <textarea
                    rows={6}
                    value={content.aboutText}
                    onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
              </div>

              <div className="space-y-4 p-6 rounded-[28px] bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-3 text-purple-600">
                  <Quote className="h-5 w-5" />
                  <h3 className="font-bold text-puja-text uppercase text-[10px] tracking-widest">Our Mission</h3>
                </div>
                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-puja-muted">Mission Statement</span>
                  <textarea
                    rows={6}
                    value={content.missionText}
                    onChange={(e) => setContent({ ...content, missionText: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Layout className="h-5 w-5" />
              </div>
              <p className={`text-sm font-medium ${message.type === 'success' ? "text-green-600" : "text-red-600"}`}>
                {message.text || "Changes apply across the entire storefront."}
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2d4a2d] px-10 py-4 text-sm font-bold text-white transition-all hover:bg-[#1a2b1a] shadow-lg shadow-green-100 disabled:opacity-50"
            >
              {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save className="h-4 w-4" />}
              Publish Content
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

