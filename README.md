# withokx -> OKX multiwallet withdrawal
Allows to withdraw from OKX MAIN balance to multiple wallets.
Can be useful for participating in retrodrops and other types of activities. Send random amounts between min max with random delay.

*It Doesn't check for invalid adress input. The author is not responsible for any loss of funds.*

## Pre requisites:
Install dependencies:
1. Install node.js: https://nodejs.org/en/
2. Start Cli
3. npm install
## Get OKX API key, secret Key and passphrase
1. go to https://www.okx.com/ru/account/my-api and Create API key.
2. Сheck the box next to the Enable Withdrawals.
3. Copy API key, secret Key and passphrase to the screen # config.js file.

## Start locally without web interface
*it's recommend to use Visual studio code to run the script, otherwise use OS CLI*
# 1. Download zip file from "script" folder and extract it to a folder.
# 2. Setup your settings in config.js
# 3. Paste your wallets to wallets.txt file, each wallet on a new line
# 4. Open folder with the bot in cmd
# 5. cd <path to folder with script>
# Start with cli
# 6. node okxWithdraw.js