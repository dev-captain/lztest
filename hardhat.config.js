require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

/**
 * @param accountsFromEnv Accounts private keys separated with comma
 * @returns Array of account to pass to network object
 */
const getAccounts = (accountsFromEnv) => accountsFromEnv.split(",");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_APIKEY}`,
      chainId: 4,
      accounts: getAccounts(process.env.RINKEBY_ACCOUNTS)
    },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      chainId: 43113,
      accounts: getAccounts(process.env.FUJI_ACCOUNTS),
    },
  }
};