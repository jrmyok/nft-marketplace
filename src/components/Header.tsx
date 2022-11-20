import Link from 'next/link';

import {
  useAddress,
  useDisconnect,
  useLogin,
  useLogout,
  useMetamask,
  useUser,
  useSDK,
} from '@thirdweb-dev/react';

import swr from 'swr';
import { fetcher, requests } from '../lib/utils/requests';
import { useEffect } from 'react';
import { useQueryUser } from '../lib/hooks/useQueryWallet';
import { useRouter } from 'next/router';

const Header = ({ className }: { className?: string }) => {
  const router = useRouter();
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectWithMetamask = useMetamask();
  const login = useLogin();
  const { user: thirdwebUser } = useUser();

  const logout = useLogout();

  useEffect(() => {
    if (thirdwebUser) {
      requests.post('/api/wallet', {
        address: thirdwebUser.address,
      });
    }
  }, [thirdwebUser]);

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.log(err);
    }

    await logout();
  };

  return (
    <div className={`${className}`}>
      <header className="flex items-center justify-between flex flex-col md:flex-row gap-y-2 md:gap-y-0">
        <Link href={'/'}>
          <h1 className="text-xl font-thin dark:text-white w-52 cursor-pointer sm:w-80">
            <span className="font-extrabold underline decoration-teal-300 dark:text-teal-50">
              Lyra
            </span>{' '}
            NFT Market Place
          </h1>
        </Link>
        <div className={'flex items-center'}>
          {address ? (
            <>
              <button
                className="bg-black hover:bg-teal-700 text-xs md:text-sm text-white font-bold py-2 px-4 rounded-full"
                onClick={disconnect}
              >
                <p className={'dark:text-white'}>
                  Disconnect
                  <span className={'dark:text-teal-200 ml-1'}>
                    : {address.substring(0, 3)}..
                    {address.substring(address.length - 3)}
                  </span>
                </p>
              </button>
            </>
          ) : (
            <button
              className="bg-black hover:bg-teal-700 text-white text-xs md:text-sm font-bold py-2 px-4 rounded-full"
              onClick={connectWithMetamask}
            >
              Connect Wallet
            </button>
          )}

          {address ? (
            <>
              {thirdwebUser ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-black hover:bg-teal-700 text-white font-bold text-xs md:text-sm py-2 px-4 rounded-full ml-2 mr-2"
                  >
                    Logout
                  </button>

                  {router.pathname === '/profile' && (
                    <Link
                      href={'/'}
                      className="bg-black hover:bg-teal-700 text-white text-xs md:text-sm font-bold py-2 px-4 rounded-full"
                    >
                      Home
                    </Link>
                  )}

                  {router.pathname !== '/profile' && (
                    <Link
                      href={'/profile'}
                      className="bg-black hover:bg-teal-700 text-white text-xs md:text-sm font-bold py-2 px-4 mr-2 rounded-full"
                    >
                      Profile
                    </Link>
                  )}
                </>
              ) : (
                <button
                  onClick={() => login()}
                  className="bg-black hover:bg-teal-700 text-white font-bold text-xs md:text-sm py-2 px-4 rounded-full"
                >
                  Login with Wallet
                </button>
              )}
            </>
          ) : (
            <>Connect your wallet to access authentication.</>
          )}
        </div>
      </header>

      <hr className="border-gray-300 dark:border-gray-700 w-full my-4" />
    </div>
  );
};

export default Header;
