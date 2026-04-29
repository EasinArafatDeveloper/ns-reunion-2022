'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe } from 'lucide-react';

const AdminContentPage = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'bn'>('bn');

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (path: string, value: string) => {
    const newContent = { ...content };
    const keys = path.split('.');
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]][activeLang] = value;
    setContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      alert('Content saved successfully!');
    } catch (error) {
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-500">Manage bilingual content for the entire website</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200 flex">
              <button
                onClick={() => setActiveLang('bn')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${activeLang === 'bn' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Bangla
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${activeLang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                English
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Hero Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> Hero Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title ({activeLang === 'bn' ? 'বাংলা' : 'English'})</label>
                <input
                  type="text"
                  value={content.hero.title[activeLang]}
                  onChange={(e) => handleChange('hero.title', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle ({activeLang === 'bn' ? 'বাংলা' : 'English'})</label>
                <textarea
                  value={content.hero.subtitle[activeLang]}
                  onChange={(e) => handleChange('hero.subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>
            </div>
          </section>

          {/* Event Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" /> Event Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details ({activeLang === 'bn' ? 'বাংলা' : 'English'})</label>
              <textarea
                value={content.event.details[activeLang]}
                onChange={(e) => handleChange('event.details', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
              />
            </div>
          </section>

          {/* Notice & Gallery Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" /> Notice
              </h2>
              <textarea
                value={content.notice[activeLang]}
                onChange={(e) => handleChange('notice', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
              />
            </section>
            
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-pink-500" /> Gallery Title
              </h2>
              <input
                type="text"
                value={content.gallery.title[activeLang]}
                onChange={(e) => handleChange('gallery.title', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </section>
          </div>

          {/* Email Templates */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Save className="w-5 h-5 text-indigo-500" /> Email Templates
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Subject ({activeLang === 'bn' ? 'বাংলা' : 'English'})</label>
                <input
                  type="text"
                  value={content.emailTemplates.registrationSubject[activeLang]}
                  onChange={(e) => handleChange('emailTemplates.registrationSubject', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Body ({activeLang === 'bn' ? 'বাংলা' : 'English'}) - Use {'{name}'} for placeholder</label>
                <textarea
                  value={content.emailTemplates.registrationBody[activeLang]}
                  onChange={(e) => handleChange('emailTemplates.registrationBody', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-48"
                />
              </div>
            </div>
          </section>
          
          {/* More sections like Notice, Gallery etc. would follow the same pattern */}
          <p className="text-center text-gray-400 italic">Notice, Gallery, and Footer sections follow the same bilingual logic above.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminContentPage;
