import { Globe, MapPin, Phone, Save, Store, TimerReset } from "lucide-react";
import { useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { STORE_INFO } from "../../config/store";

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: STORE_INFO.name,
    phone: STORE_INFO.phoneDisplay,
    hours: STORE_INFO.hours,
    address: STORE_INFO.addressLines.join(" "),
    website: "https://sriramapoojastore.com",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <AdminHeader title="Settings" subtitle="Store Setup" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-playfair font-bold text-puja-text">Store Settings</h1>
              <p className="text-sm text-puja-muted">This page is now properly available in admin and no longer redirects into the storefront layout.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-bold text-puja-text">Store Name</span>
                <input
                  value={settings.storeName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-puja-text">Phone</span>
                <input
                  value={settings.phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-puja-text">Working Hours</span>
                <input
                  value={settings.hours}
                  onChange={(e) => setSettings((prev) => ({ ...prev, hours: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-puja-text">Website</span>
                <input
                  value={settings.website}
                  onChange={(e) => setSettings((prev) => ({ ...prev, website: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-puja-text">Address</span>
                <textarea
                  rows={4}
                  value={settings.address}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm font-medium ${saved ? "text-green-600" : "text-puja-muted"}`}>
                {saved ? "Settings saved locally. API persistence can be connected next." : "Ready for real settings API integration."}
              </p>
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2d4a2d] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a2b1a]"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <Store className="h-6 w-6 text-[#2d4a2d]" />
              <p className="mt-4 text-sm font-medium text-gray-500">Storefront Sync</p>
              <p className="mt-2 text-sm leading-6 text-puja-text">Store links and map settings are now centralized and easier to manage.</p>
            </div>
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <MapPin className="h-6 w-6 text-saffron-600" />
              <p className="mt-4 text-sm font-medium text-gray-500">Location</p>
              <p className="mt-2 text-sm leading-6 text-puja-text">{STORE_INFO.addressLines.join(" ")}</p>
            </div>
            <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600" />
                <TimerReset className="h-5 w-5 text-blue-600" />
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">Quick Info</p>
              <p className="mt-2 text-sm leading-6 text-puja-text">{STORE_INFO.phoneDisplay} • {STORE_INFO.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
