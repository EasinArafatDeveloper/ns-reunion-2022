'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Globe, Briefcase, CreditCard, Send, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const SponsorPage = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01732657219',
    nagad: '01732657219',
    rocket: '01732657219'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentCountry: '',
    occupation: '',
    amount: '',
    paymentSystem: '', // Set to empty initially
    transactionId: '',
  });

  const countries = [
    { code: 'Bangladesh', label: language === 'bn' ? 'বাংলাদেশ (Bangladesh)' : 'Bangladesh' },
    { code: 'Italy', label: language === 'bn' ? 'ইতালি (Italy)' : 'Italy' },
    { code: 'Korea', label: language === 'bn' ? 'কোরিয়া (Korea)' : 'Korea' },
    { code: 'Malaysia', label: language === 'bn' ? 'মালয়েশিয়া (Malaysia)' : 'Malaysia' },
    { code: 'Saudi Arabia', label: language === 'bn' ? 'সৌদি আরব (Saudi Arabia)' : 'Saudi Arabia' },
    { code: 'Japan', label: language === 'bn' ? 'জাপান (Japan)' : 'Japan' },
    { code: 'India', label: language === 'bn' ? 'ভারত (India)' : 'India' },
  ];

  React.useEffect(() => {
    const fetchPaymentNumbers = async () => {
      try {
        const res = await fetch('/api/admin/content');
        const data = await res.json();
        
        const bkashVal = data.find((c: any) => c.key === 'bkash_number')?.value || '01732657219';
        const nagadVal = data.find((c: any) => c.key === 'nagad_number')?.value || '01732657219';
        const rocketVal = data.find((c: any) => c.key === 'rocket_number')?.value || '01732657219';
        
        setPaymentNumbers({ bkash: bkashVal, nagad: nagadVal, rocket: rocketVal });
      } catch (err) {
        console.error('Error fetching payment numbers:', err);
      }
    };
    fetchPaymentNumbers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation: Ensure payment operator is selected
    if (!formData.paymentSystem) {
      Swal.fire({
        icon: 'error',
        title: language === 'bn' ? 'পেমেন্ট অপারেটর সিলেক্ট করুন!' : 'Select Payment Operator!',
        text: language === 'bn' 
          ? 'অনুগ্রহ করে বিকাশ, নগদ বা রকেটের যেকোনো একটি পেমেন্ট অপারেটর নির্বাচন করুন।' 
          : 'Please select bKash, Nagad, or Rocket to proceed with sponsorship payment.',
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: language === 'bn' ? 'স্পন্সরশিপ আবেদন সফল!' : 'Sponsorship Submitted Successfully!',
          text: language === 'bn' 
            ? 'আমাদের সাথে যুক্ত হওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ!' 
            : 'Thank you so much for sponsoring us and supporting NS Reunion!',
          confirmButtonColor: '#1a1a54',
          customClass: { popup: 'rounded-[2rem]' },
        });
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          currentCountry: '',
          occupation: '',
          amount: '',
          paymentSystem: '',
          transactionId: '',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-[1.2rem] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-primary";
  const labelClasses = "block text-sm font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest";

  return (
    <main className={`min-h-screen bg-[#F8FAFC] ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />

      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs mb-4 uppercase tracking-widest"
          >
            ⭐ {language === 'bn' ? 'সহযোগিতা ও স্পন্সরশিপ' : 'Support & Sponsorship'} ⭐
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-6xl font-black text-primary mb-4"
          >
            {language === 'bn' ? 'স্পন্সরশিপ' : 'Sponsorship'}
          </motion.h1>
          <p className="text-gray-500 font-bold text-lg max-w-xl mx-auto">
            {language === 'bn' 
              ? 'রিইউনিয়ন ২০২৬-কে আরও সুন্দর ও প্রাণবন্ত করতে আপনার স্পন্সরশিপ দিয়ে আমাদের পাশে থাকুন।' 
              : 'Make the Reunion 2026 grand and unforgettable with your generous sponsorship support.'}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 md:p-12 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Basic Information */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/5 rounded-2xl text-secondary">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  {language === 'bn' ? 'প্রাথমিক তথ্য' : 'Basic Information'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'নাম' : 'Name'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ex: John Doe" 
                    className={inputClasses} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ইমেইল' : 'Email'}</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="john@example.com" 
                    className={inputClasses} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="Ex: 017XXXXXXXX" 
                    className={inputClasses} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'পেশা' : 'Occupation'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.occupation} 
                    onChange={e => setFormData({...formData, occupation: e.target.value})} 
                    placeholder={language === 'bn' ? 'উদা: ব্যবসায়ী, ইঞ্জিনিয়ার' : 'Ex: Businessman, Engineer'} 
                    className={inputClasses} 
                  />
                </div>
              </div>
            </section>

            {/* Location Info */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/5 rounded-2xl text-secondary">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  {language === 'bn' ? 'দেশ সংক্রান্ত তথ্য' : 'Location Details'}
                </h2>
              </div>
              
              <div>
                <label className={labelClasses}>{language === 'bn' ? 'বর্তমান দেশ' : 'Current Country'}</label>
                <select 
                  required 
                  value={formData.currentCountry} 
                  onChange={e => setFormData({...formData, currentCountry: e.target.value})} 
                  className={inputClasses}
                >
                  <option value="">{language === 'bn' ? 'দেশ নির্বাচন করুন' : 'Select Current Country'}</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Payment Info */}
            <section className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white rounded-2xl text-secondary shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  {language === 'bn' ? 'স্পন্সরশিপ ও পেমেন্ট বিবরণী' : 'Sponsorship & Payment'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'টাকার পরিমাণ (৳)' : 'Sponsorship Amount (৳)'}</label>
                    <input 
                      type="number" 
                      required 
                      value={formData.amount} 
                      onChange={e => setFormData({...formData, amount: e.target.value})} 
                      placeholder="Ex: 5000" 
                      className={`${inputClasses} bg-white`} 
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment System'}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Bkash', 'Nagad', 'Rocket'].map((opt) => (
                        <label 
                          key={opt} 
                          className={`flex flex-col items-center justify-center gap-2 p-3 bg-white border ${
                            formData.paymentSystem === opt ? 'border-secondary ring-1 ring-secondary' : 'border-gray-200'
                          } rounded-2xl cursor-pointer transition-all hover:border-secondary`}
                        >
                          <input 
                            type="radio" 
                            name="paymentSystem" 
                            value={opt} 
                            checked={formData.paymentSystem === opt} 
                            onChange={e => setFormData({...formData, paymentSystem: e.target.value})} 
                            className="accent-secondary" 
                          />
                          <span className="font-bold text-primary text-sm uppercase">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.transactionId} 
                      onChange={e => setFormData({...formData, transactionId: e.target.value})} 
                      placeholder="Ex: TR12345678" 
                      className={`${inputClasses} bg-white border-secondary/30`} 
                    />
                  </div>
                </div>
                {formData.paymentSystem ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary p-6 rounded-[1.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-primary/20 min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                    <p className="text-xs font-black text-white/60 tracking-[0.2em] mb-2 uppercase">
                      {language === 'bn' 
                        ? `এই ${formData.paymentSystem.toUpperCase()} নম্বরে পেমেন্ট বা সেন্ড মানি করুন` 
                        : `Send Sponsorship To this ${formData.paymentSystem.toUpperCase()} Number`}
                    </p>
                    <p className="text-3xl font-black mb-4 tracking-wider">
                      {paymentNumbers[formData.paymentSystem.toLowerCase() as keyof typeof paymentNumbers]}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-white/10 px-3 py-1.5 rounded-full w-fit">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>
                        {language === 'bn' 
                          ? `${formData.paymentSystem.toUpperCase()} পার্সোনাল` 
                          : `${formData.paymentSystem.toUpperCase()} Personal`}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white border border-dashed border-gray-200 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center gap-2 text-gray-400 min-h-[220px]">
                    <CreditCard className="w-8 h-8 text-gray-300 animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-wider text-primary">
                      {language === 'bn' ? 'পেমেন্ট অপারেটর সিলেক্ট করুন' : 'Select Payment Operator'}
                    </p>
                    <p className="text-xs font-bold max-w-xs text-gray-400">
                      {language === 'bn' 
                        ? 'নম্বর ও পেমেন্ট বিবরণী দেখতে বিকাশ, নগদ অথবা রকেট সিলেক্ট করুন।' 
                        : 'Select bKash, Nagad, or Rocket to view instructions and sponsorship receiver number.'}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-opacity-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{language === 'bn' ? 'স্পন্সরশিপ আবেদন সম্পন্ন করুন' : 'Submit Sponsorship'}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default SponsorPage;
