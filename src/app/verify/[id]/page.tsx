import React from 'react';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { CheckCircle2, AlertTriangle, XCircle, User, Phone, BookOpen, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { id } = await params;
  let registration = null;
  let error = false;

  try {
    await connectToDatabase();
    // Validate object ID format to prevent crash
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id);
    }
  } catch (err) {
    console.error('Verification error:', err);
    error = true;
  }

  // Determine status color/themes
  const isApproved = registration && registration.status === 'approved';
  const isPending = registration && registration.status === 'pending';
  const isRejected = registration && registration.status === 'rejected';

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Header Branding */}
        <div className="text-center mb-8">
          <span className="text-sm font-black text-secondary tracking-[0.2em] uppercase">NS Unity Forum 2022</span>
          <h1 className="text-2xl font-black text-primary mt-1">Official Gate Verification</h1>
        </div>

        {/* main Verification Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
          
          {/* Status Header Block */}
          <div className={`p-8 flex flex-col items-center text-center text-white relative overflow-hidden ${
            isApproved ? 'bg-emerald-600' :
            isPending ? 'bg-amber-500' :
            isRejected ? 'bg-rose-600' : 'bg-slate-800'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
            
            {/* Big Status Icon */}
            <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg mb-4">
              {isApproved && <CheckCircle2 className="w-10 h-10 text-white" />}
              {isPending && <AlertTriangle className="w-10 h-10 text-white" />}
              {isRejected && <XCircle className="w-10 h-10 text-white" />}
              {!registration && <XCircle className="w-10 h-10 text-white" />}
            </div>

            <h2 className="text-2xl font-black tracking-tight uppercase">
              {isApproved ? 'Verified Pass' :
               isPending ? 'Unverified / Pending' :
               isRejected ? 'Pass Rejected' : 'Invalid Pass / Fake'}
            </h2>
            <p className="text-xs text-white/80 font-bold mt-1.5 uppercase tracking-widest">
              {isApproved ? 'Access Allowed' :
               isPending ? 'Approval Required' :
               isRejected ? 'Access Denied' : 'No Record Found'}
            </p>
          </div>

          {/* Details Body */}
          {registration ? (
            <div className="p-8 space-y-6">
              
              {/* Profile/Details Head */}
              <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                {registration.photo ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                    <img src={registration.photo} alt={registration.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-50 text-primary rounded-2xl flex items-center justify-center font-black text-xl border-2 border-gray-100 flex-shrink-0">
                    {registration.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-primary leading-tight">{registration.name}</h3>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-0.5">
                    ID: #{registration._id.toString().slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Grid of Verified Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/30">
                  <User className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Participant</span>
                    <span className="font-bold text-primary truncate block text-xs">{registration.occupation || 'Attendee'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/30">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Contact</span>
                    <span className="font-bold text-primary truncate block text-xs">{registration.phone}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/30">
                  <BookOpen className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Class Group</span>
                    <span className="font-bold text-primary truncate block text-xs">{registration.section}-{registration.department}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/30">
                  <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">T-Shirt Size</span>
                    <span className="font-bold text-primary truncate block text-xs">{registration.tshirtSize}</span>
                  </div>
                </div>
              </div>

              {/* Status Alert note */}
              <div className={`p-5 rounded-2xl border ${
                isApproved ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' :
                isPending ? 'bg-amber-50/50 border-amber-100 text-amber-800' :
                'bg-rose-50/50 border-rose-100 text-rose-800'
              }`}>
                <p className="text-xs font-bold leading-relaxed text-center">
                  {isApproved ? '✓ This participant is fully registered and approved. Access is officially granted for NS Unity Forum Reunion 2.0 (2026).' :
                   isPending ? '⚠ Payment verification is pending. Please check the transaction ID with the administration panel to approve.' :
                   '❌ This registration has been rejected. Access is denied. Please contact the main support desk.'}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl text-rose-800">
                <p className="text-sm font-bold">
                  ❌ No valid registration record was found matching this pass ID. This ticket may be forged or invalid.
                </p>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Please double-check the scanned URL or try registering again through our official form.
              </p>
            </div>
          )}
        </div>

        {/* Footer Brand Logo */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Unity is Diversity</p>
          <Link href="/" className="inline-block text-xs font-black text-primary hover:text-secondary transition-colors underline">
            Go to Main Website
          </Link>
        </div>

      </div>
    </main>
  );
}
