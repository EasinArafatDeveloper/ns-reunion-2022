'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, BookOpen, Briefcase, Ruler, CreditCard, Send, Loader2, AlertCircle, MapPin, CheckCircle2, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!registeredData) return;
    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const ticketElement = document.getElementById('digital-ticket');
      if (ticketElement) {
        // Wait briefly to make sure rendering is fully settled
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Render beautiful dynamic PNG directly using browser native engine
        const dataUrl = await toPng(ticketElement, {
          cacheBust: true,
          pixelRatio: 2, // High-res HD export
          backgroundColor: '#ffffff'
        });

        const fileName = `${registeredData.name.replace(/\s+/g, '_')}_reunion_pass.png`;

        // Check if browser supports modern native mobile file sharing AND we are on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        if (isMobile) {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          if (blob) {
            const file = new File([blob], fileName, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: language === 'bn' ? 'রিইউনিয়ন ২০২৬ এন্ট্রি পাস' : 'Reunion 2026 Entry Pass',
                  text: language === 'bn' ? 'আমার রিইউনিয়ন ২০২৬ ডিজিটাল এন্ট্রি টিকিট!' : 'My Reunion 2026 digital entry ticket!'
                });
                setIsDownloading(false);
                return;
              } catch (shareErr) {
                console.log('Native sharing skipped/failed, falling back to direct download', shareErr);
              }
            }
          }
        }

        // Desktop/Standard anchor link download fallback
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        
        // Firefox and Safari require the link to be in the DOM to trigger download clicks programmatically
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsDownloading(false);
      } else {
        throw new Error('Digital ticket element not found in DOM');
      }
    } catch (err: any) {
      console.error('Error downloading ticket image:', err);
      setIsDownloading(false);
      Swal.fire({
        icon: 'error',
        title: language === 'bn' ? 'ডাউনলোড ব্যর্থ হয়েছে' : 'Download Failed',
        text: (language === 'bn' 
          ? 'টিকিট ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে একটি স্ক্রিনশট নিয়ে রাখুন।' 
          : 'Failed to download the ticket. Please take a screenshot instead.') + `\n\n[Debug Info: ${err.message || err}]`,
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01732657219',
    nagad: '01732657219',
    rocket: '01732657219'
  });

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
    paymentOption: '', // Set to empty initially
    transactionId: '',
    comment: '',
    photo: '', // Base64 string
    pickupLocation: '',
    droppingLocation: ''
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        Swal.fire({
          icon: 'error',
          title: language === 'bn' ? 'ছবির সাইজ অনেক বড়!' : 'Image Size Too Large!',
          text: language === 'bn' 
            ? 'অনুগ্রহ করে ৪ মেগাবাইট (4MB) এর চেয়ে ছোট সাইজের ছবি আপলোড করুন।' 
            : 'Please upload an image smaller than 4MB in size.',
          confirmButtonColor: '#1a1a54',
          customClass: { popup: 'rounded-[2rem]' }
        });
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

    // 1. Validation: Ensure Payment Option is selected
    if (!formData.paymentOption) {
      Swal.fire({
        icon: 'error',
        title: language === 'bn' ? 'পেমেন্ট অপারেটর সিলেক্ট করুন!' : 'Select Payment Operator!',
        text: language === 'bn' 
          ? 'অনুগ্রহ করে বিকাশ, নগদ বা রকেটের যেকোনো একটি নির্বাচন করুন।' 
          : 'Please select bKash, Nagad, or Rocket to proceed with payment.',
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
      setIsSubmitting(false);
      return;
    }

    // 2. Validation: Ensure amount is minimum 1000 TK
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum < 1000) {
      Swal.fire({
        icon: 'error',
        title: language === 'bn' ? 'পেমেন্ট অ্যামাউন্ট ভুল!' : 'Invalid Payment Amount!',
        text: language === 'bn' 
          ? 'দুঃখিত, রেজিস্ট্রেশন ফি সর্বনিম্ন ১০০০ টাকা হতে হবে।' 
          : 'Sorry, the minimum registration fee is 1000 TK.',
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
      setIsSubmitting(false);
      return;
    }

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
        setRegisteredData({
          ...formData,
          _id: result.id
        });
        // Clear form
        setFormData({
          name: '', email: '', phone: '', section: '', department: '', code: '',
          institute: '', currentSection: '', currentDepartment: '', occupation: '',
          tshirtSize: '', amount: '', paymentOption: '', transactionId: '', comment: '', photo: '',
          pickupLocation: '', droppingLocation: ''
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
    <main className={`min-h-screen bg-[#F8FAFC] ${language === 'bn' ? 'font-bengali' : 'font-sans'} relative overflow-hidden pb-24`}>
      <Navbar />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="pt-32 max-w-4xl mx-auto px-4 relative z-10">
        
        {!registeredData ? (
          <>
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
                  <div className="relative">
                    {formData.photo ? (
                      <div className="relative w-full h-44 bg-gray-50 border-2 border-dashed border-green-400 rounded-[1.2rem] overflow-hidden flex items-center justify-center group/preview">
                        <img src={formData.photo} alt="Preview" className="w-full h-full object-cover transition-all duration-300 group-hover/preview:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-2 cursor-pointer">
                          <Camera className="w-6 h-6 animate-pulse text-white" />
                          <span className="font-bold text-sm text-white">
                            {language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Photo'}
                          </span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFormData({ ...formData, photo: '' });
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="relative group">
                        <input type="file" required accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.2rem] flex items-center justify-center gap-3 text-gray-400 group-hover:border-primary transition-all">
                          <Camera className="w-5 h-5" />
                          <span className="font-bold">
                            {language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose Photo'}
                          </span>
                        </div>
                      </div>
                    )}
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

            <section>
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-primary/5 rounded-2xl text-secondary"><MapPin className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'ভ্রমণ ও যাতায়াত' : 'Travel & Route'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'পিকআপ লোকেশন (কোথা থেকে উঠবেন)' : 'Pickup Location (Where to board)'}</label>
                  <input type="text" required value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} placeholder={language === 'bn' ? 'যেমন: ঢাকা, বরিশাল, কুয়াকাটা' : 'e.g., Dhaka, Barishal, Kuakata'} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>{language === 'bn' ? 'ড্রপিং লোকেশন (কোথায় নামবেন)' : 'Dropping Location (Where to deboard)'}</label>
                  <input type="text" required value={formData.droppingLocation} onChange={e => setFormData({...formData, droppingLocation: e.target.value})} placeholder={language === 'bn' ? 'যেমন: বরিশাল, কুয়াকাটা, ঢাকা' : 'e.g., Barishal, Kuakata, Dhaka'} className={inputClasses} />
                </div>
              </div>
            </section>

            <section className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-white rounded-2xl text-secondary shadow-sm"><CreditCard className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-primary">{language === 'bn' ? 'পেমেন্ট সংক্রান্ত তথ্য' : 'Payment Information'}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'টাকার পরিমাণ' : 'Amount of Money'}</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Ex: 1000" className={`${inputClasses} bg-white`} />
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'পেমেন্ট অপশন' : 'Payment Option'}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['bkash', 'nagad', 'rocket'].map((opt) => (
                        <label 
                          key={opt} 
                          className={`flex flex-col items-center justify-center gap-2 p-3 bg-white border ${
                            formData.paymentOption === opt ? 'border-secondary ring-1 ring-secondary' : 'border-gray-200'
                          } rounded-2xl cursor-pointer transition-all hover:border-secondary`}
                        >
                          <input 
                            type="radio" 
                            name="payment" 
                            value={opt} 
                            checked={formData.paymentOption === opt} 
                            onChange={e => setFormData({...formData, paymentOption: e.target.value})} 
                            className="accent-secondary" 
                          />
                          <span className="font-bold text-primary uppercase text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>{language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}</label>
                    <input type="text" required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} placeholder="Ex: 8XJ9K2L0" className={`${inputClasses} bg-white border-secondary/30`} />
                  </div>
                </div>

                {formData.paymentOption ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary p-6 rounded-[1.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-primary/20 min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                    <p className="text-xs font-black text-white/60 tracking-[0.2em] mb-2 uppercase">
                      {language === 'bn' 
                        ? `এই ${formData.paymentOption.toUpperCase()} নম্বরে টাকা পাঠান` 
                        : `Send Money To this ${formData.paymentOption.toUpperCase()} Number`}
                    </p>
                    <p className="text-3xl font-black mb-4 tracking-wider">
                      {paymentNumbers[formData.paymentOption as keyof typeof paymentNumbers]}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-white/10 px-3 py-1.5 rounded-full w-fit">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>
                        {language === 'bn' 
                          ? `${formData.paymentOption.toUpperCase()} পার্সোনাল (Send Money)` 
                          : `${formData.paymentOption.toUpperCase()} Personal (Send Money)`}
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
                        ? 'নম্বর ও পেমেন্ট নির্দেশনাবলী দেখতে বিকাশ, নগদ অথবা রকেট সিলেক্ট করুন।' 
                        : 'Select bKash, Nagad, or Rocket to view instructions and destination phone number.'}
                    </p>
                  </div>
                )}
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
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="flex flex-col items-center justify-center text-center pt-8"
          >
            {/* Celebration Badge Check */}
            <div className="w-24 h-24 bg-green-50 rounded-full border-4 border-white flex items-center justify-center shadow-xl mb-6 text-green-500">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tight">
              {language === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন হয়েছে!' : 'Registration Completed!'}
            </h1>
            <p className="text-gray-500 font-bold text-lg max-w-lg mb-12">
              {language === 'bn' 
                ? 'আপনাকে ধন্যবাদ! আপনার তথ্য সফলভাবে রেকর্ড করা হয়েছে। আপনার ডিজিটাল আইডি এন্ট্রি পাসটি নিচে তৈরি করা হলো:' 
                : 'Thank you! Your information has been securely received. Below is your official digital entry pass:'}
            </p>

            {/* Premium Digital Entry Ticket Pass Card Wrapper */}
            <div 
              id="digital-ticket"
              className="relative w-full max-w-md bg-white border rounded-[3rem] shadow-2xl overflow-hidden p-[1px]"
              style={{ borderColor: '#f3f4f6' }}
            >
              
              {/* Ticket Top Branding Accent Banner */}
              <div 
                className="p-8 relative overflow-hidden flex flex-col items-center"
                style={{ backgroundColor: '#1a1a54', color: '#ffffff' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-xl pointer-events-none" />
                
                {/* Custom Pass Badge Tag */}
                <span 
                  className="px-3.5 py-1 text-white rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm z-10"
                  style={{ backgroundColor: '#ff8c00' }}
                >
                  {language === 'bn' ? 'অফিসিয়াল এন্ট্রি পাস' : 'Official Entry Pass'}
                </span>
                
                <h3 className="text-3xl font-black tracking-tight mb-1 text-white z-10">Reunion 2.0 (2026)</h3>
                
                {/* Slogan Text: Unity is Diversity */}
                <p 
                  className="text-[11px] font-black uppercase tracking-widest mt-1 z-10"
                  style={{ color: '#ff8c00' }}
                >
                  {language === 'bn' ? 'একতাই বল • Unity in Diversity' : 'Unity in Diversity'}
                </p>
              </div>

              {/* Scalloped side ticket cutouts */}
              <div 
                className="absolute top-[180px] -left-3 w-6 h-6 border-r rounded-full z-10 shadow-inner" 
                style={{ backgroundColor: '#F8FAFC', borderColor: '#f3f4f6' }}
              />
              <div 
                className="absolute top-[180px] -right-3 w-6 h-6 border-l rounded-full z-10 shadow-inner" 
                style={{ backgroundColor: '#F8FAFC', borderColor: '#f3f4f6' }}
              />
              
              {/* Tear-off Dashed Divider Line */}
              <div 
                className="absolute top-[191px] left-6 right-6 border-t-2 border-dashed z-10" 
                style={{ borderTopColor: '#e5e7eb' }}
              />

              {/* Ticket Detail Body */}
              <div className="p-8 pt-12 flex flex-col items-center bg-white">
                
                {/* Circular Profile Image thumbnail */}
                {registeredData.photo ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl relative -mt-20 z-20">
                    <img src={registeredData.photo} alt={registeredData.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div 
                    className="w-28 h-28 rounded-full border-4 border-white shadow-xl relative -mt-20 z-20 flex items-center justify-center font-black text-3xl"
                    style={{ backgroundColor: '#f3f4f6', color: '#1a1a54' }}
                  >
                    {registeredData.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                {/* User Information */}
                <h2 className="text-2xl font-black mt-4 tracking-tight" style={{ color: '#1a1a54' }}>{registeredData.name}</h2>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: '#ff8c00' }}>
                  ID: #{registeredData._id ? registeredData._id.toString().slice(-6).toUpperCase() : 'PENDING'}
                </p>

                {/* Ticket Details Grid */}
                <div 
                  className="w-full grid grid-cols-2 gap-y-5 gap-x-4 border-t border-b py-6 my-6"
                  style={{ borderTopColor: '#f3f4f6', borderBottomColor: '#f3f4f6' }}
                >
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>{language === 'bn' ? 'স্থান' : 'Location'}</span>
                    <span className="font-bold text-sm" style={{ color: '#1a1a54' }}>{language === 'bn' ? 'কুয়াকাটা সমুদ্র সৈকত' : 'Kuakata Sea Beach'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</span>
                    <span className="font-bold text-sm" style={{ color: '#1a1a54' }}>{language === 'bn' ? '৩১শে ডিসেম্বর, ২০২৬' : 'Dec 31, 2026'}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>{language === 'bn' ? 'টি-শার্ট সাইজ' : 'T-Shirt Size'}</span>
                    <span className="font-bold text-sm" style={{ color: '#1a1a54' }}>{registeredData.tshirtSize}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>{language === 'bn' ? 'পিকআপ লোকেশন' : 'Pickup Location'}</span>
                    <span className="font-bold text-sm" style={{ color: '#ff8c00' }}>{registeredData.pickupLocation || 'Not Specified'}</span>
                  </div>
                </div>

                {/* Footer instructions inside ticket */}
                <div className="text-center max-w-xs">
                  <p className="text-[10px] font-bold leading-relaxed" style={{ color: '#9ca3af' }}>
                    {language === 'bn' 
                      ? 'অ্যাডমিন প্যানেল থেকে পেমেন্ট ভেরিফাই হওয়ার পর এই টিকিটটি সম্পূর্ণ কার্যকর হবে।' 
                      : 'This pass will become fully active once the administrator verifies your transaction.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Instant Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 py-4 bg-secondary text-white hover:bg-opacity-95 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-75"
              >
                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Download className="w-4.5 h-4.5 text-white" />}
                <span>{language === 'bn' ? 'ডাউনলোড ইমেজ' : 'Download Photo Card'}</span>
              </button>
              <button 
                onClick={() => setRegisteredData(null)}
                className="flex-1 py-4 bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{language === 'bn' ? 'আবার করুন' : 'Register Another'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default RegisterPage;
