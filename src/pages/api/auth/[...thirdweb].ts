import { ThirdwebAuth } from '@thirdweb-dev/auth/next';

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.ADMIN_PRIVATE_KEY || '',
  domain: 'localhost:3002',
});

export default ThirdwebAuthHandler();
