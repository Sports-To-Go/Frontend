import { createContext, useContext, useState } from 'react';

interface EmailVerificationContextType {
  showVerifyPage: boolean;
  setShowVerifyPage: (value: boolean) => void;
}

const EmailVerificationContext = createContext<EmailVerificationContextType | undefined>(undefined);

export const EmailVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showVerifyPage, setShowVerifyPage] = useState(false);

  return (
    <EmailVerificationContext.Provider value={{ showVerifyPage, setShowVerifyPage }}>
      {children}
    </EmailVerificationContext.Provider>
  );
};

export const useEmailVerification = () => {
  const context = useContext(EmailVerificationContext);
  if (!context) throw new Error('useEmailVerification must be used within a EmailVerificationProvider');
  return context;
};
