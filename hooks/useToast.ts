import { useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as ToastType });

  const showToast = (type: ToastType, message: string) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  return { toast, showToast, hideToast };
};
