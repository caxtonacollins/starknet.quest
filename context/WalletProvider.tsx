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
    if (accounts?.length && process.env.WALLET_ADDRESS_KEY != undefined) {
      const newAccount = accounts[0];
      setCurrentAccount(newAccount);
      try {
        localStorage.setItem(process.env.WALLET_ADDRESS_KEY, newAccount);
      } catch (error) {
        console.error('Failed to save wallet address:', error);
      }
    } else if (process.env.WALLET_ADDRESS_KEY != undefined) {
      setCurrentAccount(null);
      try {
        localStorage.removeItem(process.env.WALLET_ADDRESS_KEY);
      } catch (error) {
        console.error('Failed to remove wallet address:', error);
      }
    }
  };

  //   Detect StarkNet wallet changes (Braavos, Argent X)
  //   const setupStarknetListeners = () => {
  //     if (window.starknet) {
  //       window.starknet.on('accountsChanged', handleAccountChange);

  //       // Set initial account and network for StarkNet
  //       const starknetAccounts = window.starknet.account;
  //       handleAccountChange(starknetAccounts);
  //     }
  //   };

  const setupStarknetListeners = async () => {
    if (window.starknet) {
      try {
        // Enable the StarkNet wallet and get the accounts
        const starknetAccounts = await window.starknet.enable();

        // Ensure starknetAccounts is an array
        if (Array.isArray(starknetAccounts)) {
          handleAccountChange(starknetAccounts);
        } else {
          console.error(
            'Unexpected response from starknet.enable:',
            starknetAccounts
          );
          setCurrentAccount(null);
        }

        // Subscribe to account changes
        window.starknet.on('accountsChanged', handleAccountChange);
      } catch (error) {
        console.error('Failed to setup StarkNet listeners:', error);
        setCurrentAccount(null);
      }
    }
  };

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
    <WalletContext.Provider value={{ currentAccount }}>
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
