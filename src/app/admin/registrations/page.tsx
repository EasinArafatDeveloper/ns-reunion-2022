'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Download,
  Loader2,
  X,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Shirt,
  Navigation
} from 'lucide-react';

const RegistrationsAdmin = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [activePassReg, setActivePassReg] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [eventInfo, setEventInfo] = useState({
    location_bn: 'কুয়াকাটা সমুদ্রসৈকত',
    location_en: 'Kuakata Sea Beach',
    date_bn: '৩১শে ডিসেম্বর, ২০২৬',
    date_en: 'December 31, 2026',
  });

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const res = await fetch('/api/admin/content');
        const content = await res.json();
        const fe = content.find((c: any) => c.key === 'featured_event');
        if (fe) {
          const feValue = JSON.parse(fe.value);
          setEventInfo({
            location_bn: feValue.location_bn || 'কুয়াকাটা সমুদ্রসৈকত',
            location_en: feValue.location_en || 'Kuakata Sea Beach',
            date_bn: feValue.date_bn || '৩১শে ডিসেম্বর, ২০২৬',
            date_en: feValue.date_en || 'December 31, 2026',
          });
        }
      } catch (error) {
        console.error('Failed to fetch event content', error);
      }
    };
    fetchEventInfo();
  }, []);

  useEffect(() => {
    if (activePassReg) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const verifyUrl = `${origin}/verify/${activePassReg._id}`;
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(verifyUrl, {
          margin: 1,
          width: 200,
          color: {
            dark: '#1a1a54',
            light: '#ffffff'
          }
        })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR generation error:', err));
      });
    } else {
      setQrCodeUrl('');
    }
  }, [activePassReg]);

  const handleDownload = async () => {
    if (!activePassReg) return;
    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const ticketElement = document.getElementById('digital-ticket');
      if (ticketElement) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const dataUrl = await toPng(ticketElement, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });

        const fileName = `${activePassReg.name.replace(/\s+/g, '_')}_reunion_pass.png`;
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
                  title: 'Reunion 2026 Entry Pass',
                  text: 'My Reunion 2026 digital entry ticket!'
                });
                setIsDownloading(false);
                return;
              } catch (shareErr) {
                console.log('Sharing failed, falling back', shareErr);
              }
            }
          }
        }

        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloading(false);
      } else {
        throw new Error('Digital ticket element not found in DOM');
      }
    } catch (err: any) {
      console.error('Error downloading pass image:', err);
      setIsDownloading(false);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download the pass image. Please try taking a screenshot instead.',
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/registrations');
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a54',
      cancelButtonColor: '#ff8c00',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`/api/admin/registrations?id=${id}`, { method: 'DELETE' });
          setRegistrations(registrations.filter(r => r._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'The registration has been deleted.',
            icon: 'success',
            confirmButtonColor: '#1a1a54',
            customClass: { popup: 'rounded-[2rem]' }
          });
        } catch (error) {
          Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setRegistrations(registrations.map(r => r._id === id ? { ...r, status } : r));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Status updated to ${status}`,
          showConfirmButton: false,
          timer: 3000,
          background: '#1a1a54',
          color: '#ffffff'
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const totalAmount = registrations.reduce((sum, reg) => sum + (reg.amount || 0), 0);
  const approvedAmount = registrations
    .filter(r => r.status === 'approved')
    .reduce((sum, reg) => sum + (reg.amount || 0), 0);

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.phone.includes(searchTerm)
  );

  const tShirtCounts = registrations.reduce((acc: any, reg) => {
    const size = reg.tshirtSize?.toUpperCase() || 'UNKNOWN';
    acc[size] = (acc[size] || 0) + 1;
    acc['total'] = (acc['total'] || 0) + 1;
    return acc;
  }, { S: 0, M: 0, L: 0, XL: 0, XXL: 0, total: 0 });

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5">
          <h1 className="text-3xl font-black text-primary mb-2">Registrations</h1>
          <p className="text-gray-500 font-bold">Manage and approve participant registrations.</p>
        </div>
        
        <div className="lg:col-span-7 flex flex-wrap gap-4 justify-start lg:justify-end">
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Members</span>
            <span className="text-xl font-black text-primary">{registrations.length}</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Approved Revenue</span>
            <span className="text-xl font-black text-primary">৳ {approvedAmount.toLocaleString()}</span>
          </div>
          <div className="bg-primary px-6 py-4 rounded-3xl shadow-xl shadow-primary/20 flex flex-col text-white">
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Total Collected</span>
            <span className="text-xl font-black">৳ {totalAmount.toLocaleString()}</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 text-primary border border-gray-100 rounded-3xl font-black hover:bg-gray-100 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* T-Shirt Size Distribution */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          👕 T-Shirt Distribution Summary
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {['S', 'M', 'L', 'XL', 'XXL', 'total'].map((size) => {
            const label = size === 'total' ? 'Total T-Shirts' : `${size} Size`;
            const count = tShirtCounts[size.toUpperCase()] || tShirtCounts[size] || 0;
            const bgClass = size === 'total' ? 'bg-primary text-white' : 'bg-gray-50 text-primary';
            const textClass = size === 'total' ? 'text-secondary' : 'text-gray-400';
            return (
              <div key={size} className={`${bgClass} px-5 py-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100/50`}>
                <span className={`text-[10px] font-black uppercase tracking-wider ${textClass}`}>
                  {label}
                </span>
                <span className="text-2xl font-black mt-1">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or phone..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">TrxID</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400 font-bold">
                      <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                      <span>Loading registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-400 font-bold italic">No registrations found.</td>
                </tr>
              ) : filteredRegistrations.map((reg, index) => (
                <motion.tr 
                  key={reg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="p-6">
                    <div 
                      className="flex items-center gap-4 cursor-pointer hover:opacity-80 group/user transition-all"
                      onClick={() => setSelectedReg(reg)}
                    >
                      {reg.photo ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden group-hover/user:ring-2 group-hover/user:ring-secondary transition-all">
                          <img src={reg.photo} alt={reg.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary group-hover/user:bg-primary/10 transition-all">
                          {reg.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-black text-primary group-hover/user:text-secondary transition-colors">{reg.name}</p>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-tight">{reg.tshirtSize} Size | {reg.section}-{reg.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-600">{reg.phone}</p>
                    <p className="text-xs font-bold text-gray-400">{reg.email}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-primary">৳ {reg.amount?.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{reg.paymentOption}</p>
                  </td>
                  <td className="p-6">
                    <span className="font-black text-gray-500 text-xs uppercase">{reg.transactionId || 'N/A'}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        reg.status === 'approved' ? 'bg-green-500' : 
                        reg.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500 animate-pulse'
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        reg.status === 'approved' ? 'text-green-600' : 
                        reg.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {reg.status !== 'approved' && reg.status !== 'rejected' && (
                        <>
                          <button 
                            onClick={() => updateStatus(reg._id, 'approved')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateStatus(reg._id, 'rejected')}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                        </>
                      )}
                      <button 
                        onClick={() => setActivePassReg(reg)}
                        className="p-2 text-secondary hover:bg-orange-50 rounded-xl transition-all"
                        title="View & Download Digital Pass"
                      >
                        <CreditCard className="w-5 h-5 text-secondary" />
                      </button>
                      <button 
                        onClick={() => handleDelete(reg._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Modal */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReg(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-gray-100 max-h-[90vh] flex flex-col"
            >
              {/* Header with Photo Overlay/Placeholder */}
              <div className="bg-primary text-white p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-4 md:gap-6 flex-shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <button 
                  onClick={() => setSelectedReg(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {(() => {
                  const hasPhoto = selectedReg.photo && 
                                   typeof selectedReg.photo === 'string' && 
                                   selectedReg.photo.trim() !== '' && 
                                   selectedReg.photo !== 'undefined' && 
                                   selectedReg.photo !== 'null';
                  
                  return hasPhoto ? (
                    <div 
                      className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20 cursor-pointer hover:scale-105 transition-all shadow-lg shadow-black/25 flex-shrink-0"
                      onClick={() => window.open(selectedReg.photo, '_blank')}
                    >
                      <img src={selectedReg.photo} alt={selectedReg.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center font-black text-white text-3xl border-4 border-white/20 shadow-lg shadow-black/25 flex-shrink-0">
                      {selectedReg.name.substring(0, 2).toUpperCase()}
                    </div>
                  );
                })()}

                <div className="text-center md:text-left space-y-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selectedReg.status === 'approved' ? 'bg-green-500 text-white' : 
                    selectedReg.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white animate-pulse'
                  }`}>
                    {selectedReg.status}
                  </span>
                  <h3 className="text-2xl font-black mt-2 tracking-tight">{selectedReg.name}</h3>
                  <p className="text-xs text-white/60 font-black tracking-widest uppercase">ID: #{selectedReg._id.toString().slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Scrollable details container */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {/* Basic Details Grid */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                        <p className="font-bold text-primary text-sm break-all">{selectedReg.email}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                        <p className="font-bold text-primary text-sm">{selectedReg.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic/Reunion Details */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Education & Department</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Reunion Section</p>
                      <p className="font-bold text-primary text-sm">{selectedReg.section} (বিভাগ: {selectedReg.department})</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">SSC Code / Batch</p>
                      <p className="font-bold text-primary text-sm">{selectedReg.code || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Current Institute</p>
                      <p className="font-bold text-primary text-sm">{selectedReg.institute}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Current Sec & Dept</p>
                      <p className="font-bold text-primary text-sm">
                        {selectedReg.currentSection || 'N/A'} - {selectedReg.currentDepartment || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal & Financial Details */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">T-Shirt & Payment details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">T-Shirt Size</p>
                      <p className="font-black text-primary text-lg mt-1">{selectedReg.tshirtSize}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                      <p className="font-black text-primary text-lg mt-1">৳ {selectedReg.amount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Method / TrxID</p>
                      <p className="font-bold text-primary text-sm mt-1 uppercase">{selectedReg.paymentOption}</p>
                      <p className="text-[10px] font-bold text-secondary uppercase mt-0.5">{selectedReg.transactionId}</p>
                    </div>
                  </div>
                </div>

                {/* Occupation & Comment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Occupation</p>
                    <p className="font-bold text-primary text-sm">{selectedReg.occupation || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Registration Date</p>
                    <p className="font-bold text-primary text-sm">
                      {new Date(selectedReg.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Travel & Route Information */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Travel & Route Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup Location</p>
                      <p className="font-bold text-primary text-sm">{selectedReg.pickupLocation || 'Not Specified'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Dropping Location</p>
                      <p className="font-bold text-primary text-sm">{selectedReg.droppingLocation || 'Not Specified'}</p>
                    </div>
                  </div>
                </div>

                {selectedReg.comment && (
                  <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl">
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider mb-1">Comment / Note</p>
                    <p className="text-primary font-bold text-sm italic">"{selectedReg.comment}"</p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedReg(null)}
                    className="px-6 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setActivePassReg(selectedReg);
                      setSelectedReg(null);
                    }}
                    className="px-6 py-3 bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 rounded-xl font-bold transition-all text-sm flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    View & Download Pass
                  </button>
                </div>

                {selectedReg.status !== 'approved' && selectedReg.status !== 'rejected' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        updateStatus(selectedReg._id, 'approved');
                        setSelectedReg(null);
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 transition-all text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        updateStatus(selectedReg._id, 'rejected');
                        setSelectedReg(null);
                      }}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600 transition-all text-sm flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Digital Entry Pass Ticket Modal */}
      <AnimatePresence>
        {activePassReg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePassReg(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-md w-full my-8"
            >
              <button 
                onClick={() => setActivePassReg(null)}
                className="absolute -top-12 right-0 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 shadow-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Premium Digital Entry Ticket Pass Card Wrapper */}
              <div 
                id="digital-ticket"
                className="relative w-full max-w-[340px] md:max-w-md bg-white border rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden p-[1px]"
                style={{ borderColor: '#f3f4f6' }}
              >
                
                {/* Ticket Top Branding Accent Banner */}
                <div 
                  className="h-[125px] md:h-[180px] relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6"
                  style={{ backgroundColor: '#101130', color: '#ffffff' }}
                >
                  {/* Left side skewed golden gradient accent */}
                  <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-90 transform -skew-x-12 -translate-x-16 pointer-events-none" />
                  
                  {/* Right side diagonal lines and gradient accent */}
                  <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-amber-500/10 to-transparent opacity-50 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-32 h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[size:12px_12px] transform skew-x-12 pointer-events-none" />
                  
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-xl pointer-events-none" />
                  
                  {/* Custom Pass Badge Tag */}
                  <span 
                    className="px-4 py-1 md:px-5 md:py-1.5 text-white rounded-full text-[9px] md:text-[11px] font-black tracking-widest uppercase -mt-1.5 md:-mt-3 mb-1.5 md:mb-3 h-6 md:h-7 flex items-center justify-center shadow-[0_4px_12px_rgba(255,140,0,0.4)] z-10"
                    style={{ backgroundColor: '#ff8c00' }}
                  >
                    Official Entry Pass
                  </span>
                  
                  {/* NS Unity Forum 2022 */}
                  <h3 className="text-lg md:text-2xl font-black tracking-tight mb-0.5 md:mb-1 text-white z-10 text-center uppercase">NS Unity Forum 2022</h3>
                  
                  {/* Reunion 2.0 (2026) */}
                  <div className="flex items-center gap-1.5 md:gap-2 z-10 -mt-0.5 md:-mt-1">
                    <span className="w-3 md:w-4 h-[1px] bg-secondary" />
                    <p 
                      className="text-[10px] md:text-[12px] font-black uppercase tracking-widest"
                      style={{ color: '#ff8c00' }}
                    >
                      Reunion 2.0 (2026)
                    </p>
                    <span className="w-3 md:w-4 h-[1px] bg-secondary" />
                  </div>
                </div>

                {/* Scalloped side ticket cutouts */}
                <div 
                  className="absolute top-[113px] md:top-[168px] -left-3 w-6 h-6 border-r rounded-full z-10 shadow-inner" 
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#f3f4f6' }}
                />
                <div 
                  className="absolute top-[113px] md:top-[168px] -right-3 w-6 h-6 border-l rounded-full z-10 shadow-inner" 
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#f3f4f6' }}
                />
                
                {/* Tear-off Dashed Divider Line */}
                <div 
                  className="absolute top-[125px] md:top-[180px] left-6 right-6 border-t-2 border-dashed z-10" 
                  style={{ borderTopColor: '#e5e7eb' }}
                />

                {/* Ticket Detail Body */}
                <div className="p-4 pt-6 md:p-6 md:pt-9 flex flex-col items-center bg-white">
                  
                  {/* Circular Profile Image thumbnail with gold border ring */}
                  {activePassReg.photo ? (
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white ring-2 ring-secondary/50 shadow-xl relative -mt-16 md:-mt-20 z-20">
                      <img src={activePassReg.photo} alt={activePassReg.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white ring-2 ring-secondary/50 shadow-xl relative -mt-16 md:-mt-20 z-20 flex items-center justify-center font-black text-3xl md:text-5xl"
                      style={{ backgroundColor: '#f3f4f6', color: '#1a1a54' }}
                    >
                      {activePassReg.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Premium VIP / Member Badge */}
                  <div className="mt-2 md:mt-3 z-20">
                    {parseFloat(activePassReg.amount || '0') >= 1500 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[8.5px] md:text-[10px] font-black bg-[#101130] text-[#ff8c00] border border-[#ff8c00]/50 shadow-md uppercase tracking-widest">
                        ★ VIP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[8.5px] md:text-[10px] font-black bg-[#101130] text-[#38bdf8] border border-[#38bdf8]/50 shadow-md uppercase tracking-widest">
                        ● Member
                      </span>
                    )}
                  </div>

                  {/* User Information */}
                  <h2 className="text-lg md:text-2xl font-black mt-2 md:mt-3 tracking-tight text-center uppercase" style={{ color: '#1a1a54' }}>{activePassReg.name}</h2>
                  
                  {/* User Occupation or Subtitle */}
                  <p className="text-[8px] md:text-[9px] font-black tracking-[0.25em] md:tracking-[0.3em] uppercase mt-0.5 md:mt-1 text-secondary text-center">
                    {activePassReg.occupation || 'MEMBER'}
                  </p>

                  {/* Phone & Email with elegant badge circles */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-1.5 mt-2 md:mt-2.5 text-[10px] md:text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 flex-shrink-0">
                        <Phone className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-secondary" />
                      </span>
                      <span className="truncate">{activePassReg.phone}</span>
                    </span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 flex-shrink-0">
                        <Mail className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-secondary" />
                      </span>
                      <span className="truncate max-w-[150px] sm:max-w-none">{activePassReg.email}</span>
                    </span>
                  </div>

                  {/* Ticket Details Grid as Card Widgets */}
                  <div className="w-full grid grid-cols-2 gap-2 md:gap-2.5 py-2.5 md:py-4 my-2.5 md:my-3.5 border-t border-b border-gray-100">
                    {/* Location */}
                    <div className="bg-slate-50/70 border border-slate-100 p-2 md:p-2.5 rounded-xl flex items-center gap-1.5 md:gap-2 min-w-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                        <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1a1a54]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[6.5px] md:text-[7.5px] font-black uppercase tracking-wider text-gray-400 block leading-none">Location</span>
                        <span className="font-bold text-[9px] md:text-[10.5px] text-[#1a1a54] block truncate mt-0.5">
                          {eventInfo.location_en}
                        </span>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="bg-slate-50/70 border border-slate-100 p-2 md:p-2.5 rounded-xl flex items-center gap-1.5 md:gap-2 min-w-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1a1a54]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[6.5px] md:text-[7.5px] font-black uppercase tracking-wider text-gray-400 block leading-none">Date</span>
                        <span className="font-bold text-[9px] md:text-[10.5px] text-[#1a1a54] block truncate mt-0.5">
                          {eventInfo.date_en}
                        </span>
                      </div>
                    </div>

                    {/* T-Shirt */}
                    <div className="bg-slate-50/70 border border-slate-100 p-2 md:p-2.5 rounded-xl flex items-center gap-1.5 md:gap-2 min-w-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                        <Shirt className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1a1a54]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[6.5px] md:text-[7.5px] font-black uppercase tracking-wider text-gray-400 block leading-none">T-Shirt</span>
                        <span className="font-bold text-[9px] md:text-[10.5px] text-[#1a1a54] block truncate mt-0.5">{activePassReg.tshirtSize}</span>
                      </div>
                    </div>

                    {/* Pickup Location */}
                    <div className="bg-slate-50/70 border border-slate-100 p-2 md:p-2.5 rounded-xl flex items-center gap-1.5 md:gap-2 min-w-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                        <Navigation className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[6.5px] md:text-[7.5px] font-black uppercase tracking-wider text-gray-400 block leading-none">Pickup</span>
                        <span className="font-bold text-[9px] md:text-[10.5px] text-secondary block truncate mt-0.5">{activePassReg.pickupLocation || 'Not Specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* dynamic QR Code for Gate Verification */}
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center mt-2.5 md:mt-3">
                      <div className="p-2 md:p-2.5 bg-white border border-amber-500/20 rounded-[1rem] md:rounded-[1.25rem] shadow-md flex-shrink-0">
                        <img src={qrCodeUrl} alt="Verify Pass" className="w-14 h-14 md:w-20 md:h-20" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-3">
                        <span className="w-4 md:w-5 h-[1px] bg-amber-500/30" />
                        <span className="text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-[#1a1a54]">Scan to Verify Pass</span>
                        <span className="w-4 md:w-5 h-[1px] bg-amber-500/30" />
                      </div>
                    </div>
                  )}

                  {/* Unity in Diversity Slogan Footer Bar */}
                  <div 
                    className="w-full py-2.5 md:py-4 flex flex-col items-center justify-center relative overflow-hidden mt-2.5 md:mt-4 rounded-b-[2rem] md:rounded-b-[3rem]"
                    style={{ backgroundColor: '#101130' }}
                  >
                    {/* Diagonal Stripe Accents in Footer */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent)] bg-[size:10px_10px] pointer-events-none" />
                    
                    <p className="text-[8.5px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary relative z-10">
                      "Unity is Diversity"
                    </p>
                    <div className="w-10 md:w-12 h-[2px] bg-secondary mt-1 rounded-full relative z-10" />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 w-full">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 py-4 bg-secondary text-white hover:bg-opacity-95 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-75"
                >
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Download className="w-4.5 h-4.5 text-white" />}
                  <span>Download Pass Image</span>
                </button>
                <button 
                  onClick={() => setActivePassReg(null)}
                  className="px-6 py-4 bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-2xl font-black text-sm transition-all flex items-center justify-center shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationsAdmin;
