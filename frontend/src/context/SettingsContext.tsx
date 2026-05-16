import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

interface Settings {
  storeName: string;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  workingHours: string | null;
  currency: string;
  taxRate: number;
  maintenanceMode: boolean;
}

interface Content {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  missionText: string;
}

interface SettingsContextType {
  settings: Settings | null;
  content: Content | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [settingsRes, contentRes] = await Promise.all([
        api.get('/settings'),
        api.get('/content')
      ]);
      setSettings(settingsRes.data.data);
      setContent(contentRes.data.data);
    } catch (error) {
      console.error("Failed to fetch store data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-puja-text font-bold animate-bounce">Sri Rama Pooja Store</p>
        </div>
      </div>
    );
  }

  if (settings?.maintenanceMode) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#4a1d1d] text-white z-[100] px-6 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-playfair font-bold text-saffron-400">Under Maintenance</h1>
          <p className="text-lg text-gray-200">We are currently performing some spiritual updates to our store. We'll be back shortly!</p>
          <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
            <p className="text-sm">For urgent inquiries, please call:</p>
            <p className="text-2xl font-bold text-saffron-400 mt-2">{settings.phone || "+91 92992 07650"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, content, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
