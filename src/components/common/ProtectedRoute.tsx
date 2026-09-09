import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, login } = useAuth();
  const { isPremium } = useStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShieldAlert className={`w-14 h-14 mb-4 ${isPremium ? 'text-[#D4AF37]' : 'text-blue-600'}`} />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-gray-500 max-w-sm mb-6">
          Please log in with your Style Zone customer or administrator account to proceed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => login('customer@stylezone.com', 'customer')}>
            Quick Login as Customer
          </Button>
          {requireAdmin && (
            <Button variant="outline" onClick={() => login('admin@stylezone.com', 'admin')}>
              Quick Login as Admin
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShieldAlert className="w-14 h-14 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Administrator Access Only</h2>
        <p className="text-gray-500 max-w-sm mb-6">
          Your current account does not have operational permissions to access this management console.
        </p>
        <Button variant="luxury" onClick={() => login('admin@stylezone.com', 'admin')}>
          Switch to Admin Role
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
