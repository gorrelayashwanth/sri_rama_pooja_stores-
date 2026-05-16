import { Globe, MapPin, Phone, Save, Store, TimerReset, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api/axios";

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "",
    logo: "",
    phone: "",
    email: "",
    address: "",
    workingHours: "",
    currency: "INR",
    taxRate: 0,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data.data) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put('/settings', settings);
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center italic text-puja-muted">Loading settings...</div>;

  return (
    <AdminLayout>
      <AdminHeader title="Settings" subtitle="Store Configuration" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-playfair font-bold text-puja-text">General Settings</h1>
                <p className="text-sm text-puja-muted">Control your store's identity and operational status.</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${settings.maintenanceMode ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                <div className={`h-2 w-2 rounded-full animate-pulse ${settings.maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-xs font-black uppercase tracking-widest">{settings.maintenanceMode ? 'Maintenance' : 'Live'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Store Name</span>
                <input
                  value={settings.storeName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Store Logo URL</span>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={settings.logo || ""}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logo: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Customer Support Email</span>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Contact Phone</span>
                <input
                  value={settings.phone || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Working Hours</span>
                <input
                  value={settings.workingHours || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, workingHours: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                  placeholder="e.g. 9:00 AM - 9:00 PM"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Tax Rate (%)</span>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings((prev) => ({ ...prev, taxRate: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-widest text-puja-text">Store Address</span>
                <textarea
                  rows={3}
                  value={settings.address || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                />
              </label>

              <div className="md:col-span-2 p-6 rounded-[24px] bg-red-50 border border-red-100 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900">Maintenance Mode</h4>
                      <p className="text-xs text-red-700">When enabled, customers will see a maintenance page.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-gray-100">
              <p className={`text-sm font-medium ${message.type === 'success' ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2d4a2d] px-10 py-4 text-sm font-bold text-white transition-all hover:bg-[#1a2b1a] shadow-lg shadow-green-100 disabled:opacity-50"
              >
                {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save className="h-4 w-4" />}
                Save All Changes
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <Store className="h-6 w-6 text-[#2d4a2d]" />
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400">Live Preview</p>
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo Preview" className="h-12 mx-auto mb-2 object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-400 text-[10px]">No Logo</div>
                )}
                <p className="text-sm font-bold text-puja-text">{settings.storeName || "Your Store Name"}</p>
                <p className="text-[10px] text-puja-muted mt-1">{settings.workingHours || "Hours Not Set"}</p>
              </div>
            </div>
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <MapPin className="h-6 w-6 text-saffron-600" />
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400">Location</p>
              <p className="mt-2 text-xs leading-relaxed text-puja-text font-medium">{settings.address || "No address configured"}</p>
            </div>
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600" />
                <TimerReset className="h-5 w-5 text-blue-600" />
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400">Contact Channels</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-puja-text font-bold">{settings.phone || "No phone"}</p>
                <p className="text-xs text-puja-muted">{settings.email || "No email"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

