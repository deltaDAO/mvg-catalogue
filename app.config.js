module.exports = {
  metadataCacheUri:
    process.env.METADATA_CACHE_URI || 'https://aquarius.delta-dao.com',
  chainId: process.env.CHAIN_ID || 2021000,
  portalUri: process.env.PORTAL_URI || 'https://portal.minimal-gaia-x.eu',

  // Used for conversion display, can be whatever coingecko API supports
  // see: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currency: 'EUR'
}
