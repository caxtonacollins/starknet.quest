import React, { createContext, useContext, useEffect, useState } from 'react';

type WalletContextType = {
  currentAccount: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Handle account changes for StarkNet wallets
  const handleAccountChange = (accounts: string[] | undefined) => {
    if (accounts?.length) {
      const newAccount = accounts[0];
      setCurrentAccount(newAccount);
      localStorage.setItem('walletAddress22', newAccount);
    } else {
      setCurrentAccount(null);
    }
  };

//   Detect StarkNet wallet changes (Braavos, Argent X)
    const setupStarknetListeners = () => {
      if (window.starknet) {
        window.starknet.on('accountsChanged', handleAccountChange);

        // Set initial account and network for StarkNet
        const starknetAccounts = window.starknet.account;
        handleAccountChange(starknetAccounts);
      }
    };

//   const setupStarknetListeners = async () => {
//     if (window.starknet) {
//       // Set initial accounts
//       const starknetAccounts = await window.starknet.request({
//         method: 'starknet_accounts',
//       });
//       handleAccountChange(starknetAccounts);

//       // Subscribe to account changes
//       window.starknet.on('accountsChanged', handleAccountChange);
//     }
//   };

  useEffect(() => {
    setupStarknetListeners();

    // Cleanup subscriptions on unmount
    return () => {
      if (window.starknet) {
        window.starknet.off('accountsChanged', handleAccountChange);
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{currentAccount}}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use Wallet Context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
