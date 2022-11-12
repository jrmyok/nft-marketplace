import { useEffect, useState } from 'react';
import { Wallet } from '@prisma/client';
import { useUser } from '@thirdweb-dev/react';

const useQueryUser = () => {
  const { user: thirdwebUser } = useUser();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch('/api/wallet', {
          method: 'GET',
        });
        const user = await response.json();
        setWallet(user);
      } catch (error) {}
    };

    fetchWallet();
  }, [thirdwebUser]);

  return wallet;
};

export { useQueryUser };
