import { NextApiRequest, NextApiResponse } from 'next';
import { Services } from '../../lib/utils/servicesDI';

import { getUser as getUserThirdweb } from './auth/[...thirdweb]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const thirdwebUser = await getUserThirdweb(req);

  if (!thirdwebUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const wallet = await Services.wallet.getWallet(thirdwebUser.address);
        return res.status(200).json(wallet);
      } catch (error) {
        return res.status(500).json(error);
      }
  }
};

export default handler;
