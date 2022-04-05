import { ConfigHelper, ConfigHelperConfig } from '@oceanprotocol/lib'
import { chains } from '../../chains.config'
import { ConfigHelperConfigOverwrite } from '../@types/Chains'

export function getOceanConfig(network: string | number): ConfigHelperConfig {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'gaiaxtestnet' || network === 2021000
      ? undefined
      : process.env.GATSBY_INFURA_PROJECT_ID
  ) as ConfigHelperConfig

  const configOverwrite = (chains as ConfigHelperConfigOverwrite[]).find(
    (c) => c.networkId === config.networkId
  )

  return configOverwrite
    ? {
        ...config,
        ...configOverwrite
      }
    : config
}
