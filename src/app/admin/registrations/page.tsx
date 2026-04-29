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
  Loader2
} from 'lucide-react';

const RegistrationsAdmin = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Registrations</h1>
          <p className="text-gray-500 font-bold">Manage and approve participant registrations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-lg shadow-primary/10">
          <Download className="w-4 h-4" />
          <span>Export to Excel</span>
        </button>
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
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">T-Shirt</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">TrxID</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400 font-bold">
                      <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                      <span>Loading registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold italic">No registrations found.</td>
                </tr>
              ) : filteredRegistrations.map((reg, index) => (
                <motion.tr 
                  key={reg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary">
                        {reg.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-primary">{reg.name}</p>
                        <p className="text-xs font-bold text-gray-400">{reg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-600">{reg.phone}</p>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-tight">{reg.section} | {reg.department}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black">{reg.tshirtSize}</span>
                  </td>
                  <td className="p-6">
                    <span className="font-black text-secondary text-xs uppercase">{reg.transactionId || 'N/A'}</span>
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
                      <button 
                        onClick={() => updateStatus(reg._id, 'approved')}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => updateStatus(reg._id, 'rejected')}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                      <button 
                        onClick={() => handleDelete(reg._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
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

export default RegistrationsAdmin;
