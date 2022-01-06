module.exports = {
  metadataCacheUri:
    process.env.METADATA_CACHE_URI || 'https://aquarius.delta-dao.com',
  chainId: process.env.CHAIN_ID || 2021000,
  portalUri: process.env.PORTAL_URI || 'https://portal.minimal-gaia-x.eu'
}
