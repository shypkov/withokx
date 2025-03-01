# withokx -> OKX multiwallet withdrawal
Allows to withdraw from OKX MAIN balance to multiple wallets.
Can be useful for participating in airdrops and other types of activities.
Send random amounts between min max with random delay.

*It Doesn't check for invalid adress input. The author is not responsible for any loss of funds.*
*Please Notice that this is just an command interface for OKX API*
*there is no interface security risks of losing cex funds, as all the transfers are encypted*
*all possible securities issues might appear only with client's insecure actions on OKX cex*

## For manual build and serve:
# Requirements:
1. Uses node.js 19.9.0: https://nodejs.org/en/
2. build on vue and quasar
3. download the project open terminal and execute sequencely: yarn install, yarn serve (to open the local version)
4. or create own build by executing: yarn build
# CLIENT USAGE:
1. Code deployed on github pages and accesible via https://shypkov.github.io/withokx latest version is 1.3.0
2. Go to https://www.okx.com/ru/account/my-api and Create API key, secret and passcode.
3. Сheck the box next to the Enable Withdrawals and configure whitelist of withdrawal addresses
4. Add the wallets you want to receive funds to the whitelisted