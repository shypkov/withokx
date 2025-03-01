# withokx -> OKX multiwallet withdrawal
Allows to withdraw from OKX MAIN balance to multiple wallets.
Can be useful for participating in airdrops and other types of activities.
Send random amounts between min max with random delay.

*It Doesn't check for invalid adress input. The author is not responsible for any loss of funds.*

## For manual build and serve:
# Requirements:
1. Uses node.js 19.9.0: https://nodejs.org/en/
2. build on vue and quasar
# CLIENT USAGE:
1. Code deployed on github pages and accesible via https://shypkov.github.io/withokx 
2. Go to https://www.okx.com/ru/account/my-api and Create API key, secret and passcode.
3. Сheck the box next to the Enable Withdrawals and configure whitelist for addresses
4. Add the wallets you want to receive funds to the whitelisted