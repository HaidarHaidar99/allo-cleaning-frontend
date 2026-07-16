import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const SettingsContext = createContext();

const defaultSettings = {
  // Contact details & socials
  whatsapp: '15550192834',
  email: 'info@allocleaning.com',
  phone: '+1 (555) 019-2834',
  address: '123 Sparkle Way, Clean City',
  instagram: 'https://instagram.com/allocleaning',
  facebook: 'https://facebook.com/allocleaning',
  
  // Home Page hero
  heroTag: 'Sparkling Clean, Guaranteed',
  heroTitle: 'Professional Cleaning Services for Home & Office',
  heroDescription: 'Experience the joy of a spotless environment. We deliver top-tier, reliable, and eco-friendly cleaning services tailored to your exact needs.',
  
  // Home Page stats
  stat1Number: '5,000+',
  stat1Label: 'Happy Customers',
  stat2Number: '12,000+',
  stat2Label: 'Completed Jobs',
  stat3Number: '150+',
  stat3Label: 'Vetted Cleaners',
  stat4Number: '100%',
  stat4Label: 'Satisfaction Rate',
  
  // Contact Page texts
  contactTitle: 'Contact Our Support Team',
  contactDescription: 'Have questions about our packages or need a custom cleanup quote? Leave us a message below, and our team will reach out shortly!'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to fetch global settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalSettings = async (newSettings, token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Update settings error:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateGlobalSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
