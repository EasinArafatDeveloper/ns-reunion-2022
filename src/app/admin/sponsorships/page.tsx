'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Download,
  Loader2,
  DollarSign,
  Globe,
  Award
} from 'lucide-react';

const SponsorshipsAdmin = () => {
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch sponsorships
  const fetchSponsorships = async () => {
    try {
      const res = await fetch('/api/admin/sponsorships');
      const data = await res.json();
      setSponsorships(data);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
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
          await fetch(`/api/admin/sponsorships?id=${id}`, { method: 'DELETE' });
          setSponsorships(sponsorships.filter(s => s._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'The sponsorship record has been deleted.',
            icon: 'success',
            confirmButtonColor: '#1a1a54',
            customClass: { popup: 'rounded-[2rem]' }
          });
        } catch (error) {
          Swal.fire('Error', 'Failed to delete record', 'error');
        }
      }
    });
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/sponsorships', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setSponsorships(sponsorships.map(s => s._id === id ? { ...s, status } : s));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Sponsorship status updated to ${status}`,
          showConfirmButton: false,
          timer: 3000,
          background: '#1a1a54',
          color: '#ffffff'
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Update status failed', 'error');
    }
  };

  const totalAmount = sponsorships.reduce((sum, sp) => sum + (sp.amount || 0), 0);
  const approvedAmount = sponsorships
    .filter(s => s.status === 'approved')
    .reduce((sum, sp) => sum + (sp.amount || 0), 0);

  const filteredSponsorships = sponsorships.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.phone.includes(searchTerm) || 
    s.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.currentCountry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5">
          <h1 className="text-3xl font-black text-primary mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-secondary" /> Sponsorships
          </h1>
          <p className="text-gray-500 font-bold">Manage, track, and approve event sponsorships.</p>
        </div>
        
        <div className="lg:col-span-7 flex flex-wrap gap-4 justify-start lg:justify-end">
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sponsors</span>
            <span className="text-xl font-black text-primary">{sponsorships.length}</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Approved Funds</span>
            <span className="text-xl font-black text-primary">৳ {approvedAmount.toLocaleString()}</span>
          </div>
          <div className="bg-primary px-6 py-4 rounded-3xl shadow-xl shadow-primary/20 flex flex-col text-white">
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Total Pledged</span>
            <span className="text-xl font-black">৳ {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, phone, country, or occupation..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sponsorships Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sponsor</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Info</th>
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
                      <span>Loading sponsorships...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSponsorships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-400 font-bold italic">No sponsorships found.</td>
                </tr>
              ) : filteredSponsorships.map((sp) => (
                <motion.tr 
                  key={sp._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary uppercase">
                        {sp.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-primary">{sp.name}</p>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-tight">
                          {sp.occupation} | {sp.currentCountry}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-600">{sp.phone}</p>
                    <p className="text-xs font-bold text-gray-400">{sp.email}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-primary">৳ {sp.amount?.toLocaleString()}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-primary uppercase text-xs">{sp.paymentSystem}</p>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Trx: {sp.transactionId}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        sp.status === 'approved' ? 'bg-green-500' : 
                        sp.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500 animate-pulse'
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        sp.status === 'approved' ? 'text-green-600' : 
                        sp.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {sp.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateStatus(sp._id, 'approved')}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => updateStatus(sp._id, 'rejected')}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                      <button 
                        onClick={() => handleDelete(sp._id)}
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
    </div>
  );
};

export default SponsorshipsAdmin;
