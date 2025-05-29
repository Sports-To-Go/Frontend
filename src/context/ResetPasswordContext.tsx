import React, { createContext, useContext, useState } from 'react';

const ResetPasswordContext = createContext({
	canAccessReset: false,
	allowAccess: () => {},
	resetAccess: () => {}
});

export const useResetPassword = () => useContext(ResetPasswordContext);

export const ResetPasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [canAccessReset, setCanAccessReset] = useState(false);

	const allowAccess = () => setCanAccessReset(true);
	const resetAccess = () => setCanAccessReset(false);

	return (
		<ResetPasswordContext.Provider value={{ canAccessReset, allowAccess, resetAccess }}>
			{children}
		</ResetPasswordContext.Provider>
	);
};
