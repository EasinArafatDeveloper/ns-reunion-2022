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
  Phone
} from 'lucide-react';

const RegistrationsAdmin = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

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

                {selectedReg.comment && (
                  <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl">
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider mb-1">Comment / Note</p>
                    <p className="text-primary font-bold text-sm italic">"{selectedReg.comment}"</p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-4">
                <button 
                  onClick={() => setSelectedReg(null)}
                  className="px-6 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
                >
                  Close
                </button>

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
    </div>
  );
};

export default RegistrationsAdmin;
