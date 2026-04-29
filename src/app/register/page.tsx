'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, BookOpen, Briefcase, Ruler, CreditCard, Send, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    section: '',
    department: '',
    code: '',
    institute: '',
    currentSection: '',
    currentDepartment: '',
    occupation: '',
    tshirtSize: '',
    amount: '',
    paymentOption: 'bkash',
    transactionId: '',
    comment: '',
    photo: '' // Base64 string
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        Swal.fire('Error', 'Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: language === 'bn' ? 'রেজিস্ট্রেশন সফল!' : 'Registration Successful!',
          text: language === 'bn' ? 'আমরা আপনার তথ্য পেয়েছি। ধন্যবাদ!' : 'We have received your information. Thank you!',
          confirmButtonColor: '#1a1a54',
          customClass: { popup: 'rounded-[2rem]' }
        });
        // Clear form
        setFormData({
          name: '', email: '', phone: '', section: '', department: '', code: '',
          institute: '', currentSection: '', currentDepartment: '', occupation: '',
          tshirtSize: '', amount: '', paymentOption: 'bkash', comment: '', photo: ''
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black text-primary mb-4">
            {language === 'bn' ? 'রেজিস্ট্রেশন ফরম' : 'Registration Form'}
          </motion.h1>
          <p className="text-gray-500 font-bold text-lg">
            {language === 'bn' ? 'আপনার তথ্য দিয়ে রিইউনিয়ন ২০২২-এ অংশগ্রহণ নিশ্চিত করুন' : 'Join the grand celebration by filling out your details below'}
          </p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <section>
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-primary/5 rounded-2xl text-secondary"><User className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'প্রাথমিক তথ্য' : 'Basic Information'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'পুরো নাম' : 'Full Name'}</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: John Doe" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ইমেইল' : 'Email Address'}</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="017XXXXXXXX" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ছবি আপলোড' : 'Photo Upload'}</label>
                  <div className="relative group">
                    <input type="file" required accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={`w-full px-5 py-4 bg-gray-50 border-2 border-dashed ${formData.photo ? 'border-green-400' : 'border-gray-200'} rounded-[1.2rem] flex items-center justify-center gap-3 text-gray-400 group-hover:border-primary transition-all`}>
                      <Camera className={`w-5 h-5 ${formData.photo ? 'text-green-500' : ''}`} />
                      <span className={`font-bold ${formData.photo ? 'text-green-600' : ''}`}>
                        {formData.photo ? (language === 'bn' ? 'ছবি নির্বাচন করা হয়েছে' : 'Photo Selected') : (language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose Photo')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-primary/5 rounded-2xl text-secondary"><BookOpen className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'শিক্ষা ও বিভাগ' : 'Education & Section'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'সেকশন' : 'Section'}</label>
                  <select required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className={inputClasses}>
                    <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select Section'}</option>
                    <option value="ক">ক</option>
                    <option value="খ">খ</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'বিভাগ' : 'Department'}</label>
                  <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className={inputClasses}>
                    <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select Dept'}</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'কোড (ঐচ্ছিক)' : 'Code (Optional)'}</label>
                  <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Ex: SSC-2022" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'বর্তমান প্রতিষ্ঠান' : 'Current Institute'}</label>
                  <input type="text" required value={formData.institute} onChange={e => setFormData({...formData, institute: e.target.value})} placeholder="University/College" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'বর্তমান সেকশন' : 'Current Section'}</label>
                  <input type="text" value={formData.currentSection} onChange={e => setFormData({...formData, currentSection: e.target.value})} placeholder="Section Name" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'বর্তমান বিভাগ' : 'Current Department'}</label>
                  <input type="text" value={formData.currentDepartment} onChange={e => setFormData({...formData, currentDepartment: e.target.value})} placeholder="Dept Name" className={inputClasses} />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-primary/5 rounded-2xl text-secondary"><Briefcase className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Details'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'পেশা (ঐচ্ছিক)' : 'Occupation (Optional)'}</label>
                  <input type="text" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="Ex: Student, Engineer" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'টি-শার্ট সাইজ' : 'T-shirt Size'}</label>
                  <select required value={formData.tshirtSize} onChange={e => setFormData({...formData, tshirtSize: e.target.value})} className={inputClasses}>
                    <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select Size'}</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-white rounded-2xl text-secondary shadow-sm"><CreditCard className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'পেমেন্ট সংক্রান্ত তথ্য' : 'Payment Information'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'টাকার পরিমাণ' : 'Amount of Money'}</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Ex: 500" className={`${inputClasses} bg-white`} />
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'পেমেন্ট অপশন' : 'Payment Option'}</label>
                    <div className="flex gap-4">
                      {['bkash', 'nagad'].map((opt) => (
                        <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-4 bg-white border ${formData.paymentOption === opt ? 'border-secondary' : 'border-gray-100'} rounded-2xl cursor-pointer transition-all`}>
                          <input type="radio" name="payment" value={opt} checked={formData.paymentOption === opt} onChange={e => setFormData({...formData, paymentOption: e.target.value})} className="accent-secondary" />
                          <span className="font-bold text-primary uppercase">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}</label>
                    <input type="text" required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} placeholder="Ex: 8XJ9K2L0" className={`${inputClasses} bg-white border-secondary/30`} />
                  </div>
                </div>
                <div className="bg-primary p-6 rounded-[1.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-primary/20">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                  <p className="text-xs font-black text-white/60 tracking-[0.2em] mb-2 uppercase">{language === 'bn' ? 'এই নম্বরে টাকা পাঠান' : 'Send Money To'}</p>
                  <p className="text-3xl font-black mb-4 tracking-wider">01301295298</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-white/10 px-3 py-1.5 rounded-full w-fit"><AlertCircle className="w-3.5 h-3.5" /><span>{language === 'bn' ? 'বিকাশ/নগদ পার্সোনাল' : 'Bkash/Nagad Personal'}</span></div>
                </div>
              </div>
            </section>

            <section>
              <label className={labelClasses}>{language === 'bn' ? 'মতামত (ঐচ্ছিক)' : 'Comment (Optional)'}</label>
              <textarea rows={4} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} placeholder="Your message..." className={`${inputClasses} resize-none`}></textarea>
            </section>

            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-opacity-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /><span>{language === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Submit Registration'}</span></>}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default RegisterPage;
