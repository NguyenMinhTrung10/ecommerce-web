import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let typeClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          typeClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          typeClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          typeClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-item ${typeClass}`}>
            <div className="toast-icon-wrap">
              <Icon size={20} />
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
