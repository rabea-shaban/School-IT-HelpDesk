import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto isolate" aria-modal="true" role="dialog">
      {/* Dark Opaque Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={`relative z-20 w-full ${maxWidthClasses} max-h-[92vh] max-h-[92dvh] flex flex-col transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-left rtl:text-right align-middle shadow-2xl border border-slate-200 transition-all animate-slide-up ring-1 ring-black/10`}
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header (Sticky / Fixed at top of modal) */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between border-b border-slate-100 p-4 sm:p-6 bg-slate-50/70 flex-shrink-0 gap-3">
              <div className="min-w-0 flex-1 pe-2">
                {title && <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">{title}</div>}
                {subtitle && <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium truncate">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Body (Scrollable on small mobile screens) */}
          <div className="p-4 sm:p-6 text-slate-900 bg-white overflow-y-auto flex-1 overscroll-contain" style={{ backgroundColor: '#ffffff' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
