import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const SettingsContext = createContext();

const defaultSettings = {
  whatsapp: '15550192834',
  email: 'info@allocleaning.com',
  phone: '+1 (555) 019-2834',
  address: '123 Sparkle Way, Clean City',
  instagram: 'https://instagram.com/allocleaning',
  facebook: 'https://facebook.com/allocleaning',
  heroTag: 'Sparkling Clean, Guaranteed',
  heroTitle: 'Professional Cleaning Services for Home & Office',
  heroDescription: 'Experience the joy of a spotless environment. We deliver top-tier, reliable, and eco-friendly cleaning services tailored to your exact needs.',
  stat1Number: '5,000+',
  stat1Label: 'Happy Customers',
  stat2Number: '12,000+',
  stat2Label: 'Completed Jobs',
  stat3Number: '150+',
  stat3Label: 'Vetted Cleaners',
  stat4Number: '100%',
  stat4Label: 'Satisfaction Rate',
  contactTitle: 'Contact Our Support Team',
  contactDescription: 'Have questions about our packages or need a custom cleanup quote? Leave us a message below, and our team will reach out shortly!'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  const updateGlobalSettings = async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to update settings.' };
      }

      if (data.settings) {
        setSettings(data.settings);
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message || 'Failed to connect to the server.' };
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        updateGlobalSettings
      }}
    >
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
