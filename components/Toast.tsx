'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: {
    bg: 'bg-green-900/90',
    border: 'border-green-500',
    text: 'text-green-400',
    icon: 'text-green-400',
  },
  error: {
    bg: 'bg-red-900/90',
    border: 'border-red-500',
    text: 'text-red-400',
    icon: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-900/90',
    border: 'border-blue-500',
    text: 'text-blue-400',
    icon: 'text-blue-400',
  },
  warning: {
    bg: 'bg-yellow-900/90',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    icon: 'text-yellow-400',
  },
};

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];
  const colorScheme = colors[type];

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-20 right-6 z-50
        ${colorScheme.bg} ${colorScheme.border}
        border-2 rounded-lg shadow-2xl backdrop-blur-sm
        p-4 min-w-[300px] max-w-md
        flex items-center gap-3
        transition-all duration-300 ease-out
        ${
          isVisible
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-[120%] opacity-0 scale-95'
        }
      `}
    >
      <Icon className={`w-5 h-5 ${colorScheme.icon} flex-shrink-0`} />
      <p className={`${colorScheme.text} font-medium flex-1`}>{message}</p>
    </div>
  );
}

// Toast container component
interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${80 + index * 80}px`,
            right: '24px',
            zIndex: 50,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
