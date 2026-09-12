import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Zap,
  CheckCircle,
  Sparkles,
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

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-500/10 border border-school-400/20 text-school-300 text-xs font-bold tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-school-400" />
            {t('submit.heroBadge')}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t('submit.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('submit.heroSubtitle', { labs: TOTAL_LABS_COUNT, devices: TOTAL_SCHOOL_DEVICES_COUNT })}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {t('submit.badgeNoAccount')}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {t('submit.badgeDirectDispatch')}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-school-400" />
              {t('submit.badgeTrackingId')}
            </span>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
