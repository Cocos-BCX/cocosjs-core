
export const Blockchains = {
    EOS:'eos',
    ETH:'eth',
    TRX:'trx',
    COCOSBCX:'cocosBcx',
};

export const BlockchainsArray =
    Object.keys(Blockchains).map(key => ({key, value:Blockchains[key]}));