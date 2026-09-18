import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Zap,
  CheckCircle,
  Sparkles,
  Search,
  ArrowRight,
} from 'lucide-react';
import { TicketForm } from '../components/TicketForm/TicketForm';
import { TicketSuccessModal } from '../components/TicketForm/TicketSuccessModal';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ticket, TicketFormData } from '../types/ticket';
import { createTicket } from '../firebase/tickets';
import { useToast } from '../context/ToastContext';
import { TOTAL_LABS_COUNT, TOTAL_SCHOOL_DEVICES_COUNT } from '../utils/constants';

export const SubmitRequest: React.FC = () => {
  const { t } = useTranslation();
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleFormSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    try {
      const ticket = await createTicket(data);
      setCreatedTicket(ticket);
      setIsSuccessModalOpen(true);
      showSuccess(t('submit.successToast', { id: ticket.ticketNumber }), t('common.success'));
    } catch (err: any) {
      console.error('Failed to submit ticket:', err);
      showError(err.message || t('submit.errorToast'), t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccessModalOpen(false);
    setCreatedTicket(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-school-500 selection:text-white">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071526] via-[#0a223c] to-[#0f2d4e] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 shadow-2xl">
        {/* Ambient Glow Lights */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-school-500/20 via-orange-500/15 to-indigo-500/20 blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-school-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Official B.TECH School Banner Showcase */}
          <div className="flex items-center justify-center">
            <div className="relative group max-w-xl w-full">
              {/* Neon Glow behind the banner */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-school-500 via-orange-500/50 to-indigo-600 rounded-3xl blur-md opacity-35 group-hover:opacity-60 transition duration-500" />
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/25 bg-[#091f38] shadow-2xl p-1 sm:p-1.5 backdrop-blur-xl">
                <img
                  src="/btech-school-banner.jpg"
                  alt="مدرسة بي تك للتكنولوجيا التطبيقية - وزارة التربية والتعليم والتعليم الفني"
                  className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Badge & Headlines */}
          <div className="space-y-2.5 pt-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-school-200 text-xs font-black tracking-wide uppercase backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>{t('submit.heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t('submit.heroTitle')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              {t('submit.heroSubtitle', { labs: TOTAL_LABS_COUNT, devices: TOTAL_SCHOOL_DEVICES_COUNT })}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2 text-xs font-bold">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 backdrop-blur-sm shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('submit.badgeNoAccount')}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 backdrop-blur-sm shadow-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t('submit.badgeDirectDispatch')}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 backdrop-blur-sm shadow-xs">
              <ShieldCheck className="w-4 h-4 text-school-300" />
              <span>{t('submit.badgeTrackingId')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Quick Tracking Callout */}
        <div className="bg-gradient-to-r from-school-50 via-indigo-50/50 to-blue-50/60 border border-school-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left rtl:sm:text-right">
            <div className="w-10 h-10 rounded-xl bg-school-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                {t('track.heroTitle')}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {t('track.heroSubtitle')}
              </p>
            </div>
          </div>

          <Link to="/track" className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-school-50 text-school-700 font-extrabold text-xs border border-school-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>{t('track.searchButton')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 text-school-600" />
            </button>
          </Link>
        </div>

        <TicketForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
      </main>

      {/* Success Confirmation Modal */}
      <TicketSuccessModal
        ticket={createdTicket}
        isOpen={isSuccessModalOpen}
        onReset={handleReset}
      />

      <Footer />
    </div>
  );
};
