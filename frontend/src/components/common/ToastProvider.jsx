import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#427300',
          },
        },
        error: {
          style: {
            background: '#dc2626',
          },
        },
      }}
    />
  );
};

export default ToastProvider; 