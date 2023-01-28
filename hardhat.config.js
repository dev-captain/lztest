require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

/**
 * @param accountsFromEnv Accounts private keys separated with comma
 * @returns Array of account to pass to network object
 */
// const getAccounts = (accountsFromEnv) => accountsFromEnv.split(",");

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url:"http://192.168.113.50:1234",
      chainId:1337,
      accounts:["39cfe36c6dfd933d32c85b8557585eb408f1aca852ada021dbd7a1455818d0ed"]
    },
    fantom: {
      url: "http://127.0.0.1:7545",     // Localhost (default: none)
      chainId: 1337,
      accounts:['f94e376b991bf2ff9728792f956048214396f93dfe1bf4158fd8eebdb1eb602f']
          // Any network (default: none)
     },
  }
};