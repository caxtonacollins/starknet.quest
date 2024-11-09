"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type WalletContextType = {
  newAddress: string | null;
  setNewAddress: (account: string | null) => void;
  newURLParams: string;
  setNewURLParams: (account: string) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [newAddress, setNewAddress] = useState<string | null>(null);
  const [newURLParams, setNewURLParams] = useState<string>("");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure this only runs on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && newURLParams) {
      const updateUrl = (newURLParams: string) => {
        // Replace everything after the base URL with the new address
        const newUrl = `/${newURLParams}`;
        router.replace(newUrl);
      };

      updateUrl(newURLParams);
    }
  }, [isMounted, newURLParams, newAddress]);

  return (
    <WalletContext.Provider
      value={{ newAddress, setNewAddress, newURLParams, setNewURLParams }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
