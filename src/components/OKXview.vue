<script>
/* eslint-disable */ 
import axios from 'axios'
import { Axios } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

const apiKey = useLocalStorage('apikey', '');
const passphrase = useLocalStorage('pass', '');
const secretKey = useLocalStorage('secret', '');
const addresses = useLocalStorage('addresses', Array(13).fill(''));
const extaddresses = ref([]); 
const minWithdrawal = ref();
const maxWithdrawal = ref();
const mintimedelay = ref();
const maxtimedelay = ref();
const networks = ref('ETH-ERC20');
const ccy = ref('ETH');
const resulttext = ref([]);
const resulttextget = ref([]);
let result = ref();
const progress = ref(false);
const usedelay = ref(false);
const submanage = ref(false);
const subAcct = ref('');
const transferamount = ref('');
const direction = ref('6');
const baseUrl = ref('https://www.okx.com');

function addExtraAddress() {if (extaddresses.value.length < 7) {extaddresses.value.push('')}};

async function OKXminfee() {
   try {
const timestamp = new Date().toISOString().split('.')[0] + "Z";
const method = 'GET';
const getUrl = '/api/v5/asset/currencies?ccy='+ccy.value;
const body = '';
const getSig = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + method + getUrl + body, secretKey.value));
const response = await axios.get(baseUrl.value + getUrl, {
    method: method,
    url: getUrl,
    headers: {
        'Content-Type': 'application/json',
        'OK-ACCESS-SIGN': getSig,
        'OK-ACCESS-KEY': apiKey.value,
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-PASSPHRASE': passphrase.value
    }
});
const FullResponse = response.data;
const selectedNetworkData = FullResponse.data.find(
        (item) => item.chain === networks.value
      );
      if (selectedNetworkData) {
      const parsedResponse = `${new Date().toString()} withdraw fee = ${selectedNetworkData.minFee}, min withdraw value = ${selectedNetworkData.minWd} for chain ${selectedNetworkData.chain}, ccy ${selectedNetworkData.ccy}`;
      resulttextget.value = [...resulttextget.value, parsedResponse];
      console.log(`Selected Network: ${selectedNetworkData.chain}`);
      console.log(`Min Fee: ${selectedNetworkData.minFee}`);
      console.log(`Min Withdraw: ${selectedNetworkData.minWd}`);
      } else {
        console.warn(`No data found for ${networks.value}`);
      }
   } catch (error) {
      console.error(`Error: ${error.message}`);
   }
}

async function getbalances() {
  try {
const timestamp = new Date().toISOString().split('.')[0] + "Z";
const method = 'GET';
const body = '';
const subAcctName = subAcct.value.trim();

if (!subAcctName) {
      console.warn("Sub-account name is empty!");
      resulttext.value = [...resulttext.value, "no sub-account name"];
      return;
    }

const endpoints = {
      trading: `/api/v5/account/subaccount/balances?subAcct=${subAcctName}`,
      funding: `/api/v5/asset/subaccount/balances?subAcct=${subAcctName}`
    };

    const headers = (url) => ({
      'Content-Type': 'application/json',
      'OK-ACCESS-SIGN': CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(timestamp + method + url + body, secretKey.value)
      ),
      'OK-ACCESS-KEY': apiKey.value,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase.value
    });

    const tradingResponse = await axios.get(baseUrl.value + endpoints.trading, {
      headers: headers(endpoints.trading)
    });

    const fundingResponse = await axios.get(baseUrl.value + endpoints.funding, {
      headers: headers(endpoints.funding)
    });

    console.log('Trading Balance:', tradingResponse.data);
    console.log('Funding Balance:', fundingResponse.data);

    let parsedResponse = `\n🔹 SubAccount: ${subAcctName}\n`;
    
    const safeValue = (value, fallback) => (value !== undefined ? value : fallback);

    let tradingBalanceText = "\n Trading Balance:\n";
    let fundingBalanceText = "\n Funding Balance:\n";

    if (tradingResponse.data.code !== '0') {
      tradingBalanceText += `${tradingResponse.data.msg}\n`;
    } else if (tradingResponse.data.data.length) {
      tradingResponse.data.data.forEach(balance => {
        tradingBalanceText += `${safeValue(balance.availBal, "0")} ${safeValue(balance.ccy, "null")};\n`;
      });
    } else {
      tradingBalanceText += "0\n"; 
    }

    if (fundingResponse.data.code !== '0') {
      fundingBalanceText += `${fundingResponse.data.msg}\n`;
    } else if (fundingResponse.data.data.length) {
      fundingResponse.data.data.forEach(balance => {
        fundingBalanceText += `${safeValue(balance.availBal, "0")} ${safeValue(balance.ccy, "null")};\n`;
      });
    } else {
      fundingBalanceText += "0\n"; 
    }

    parsedResponse += tradingBalanceText + fundingBalanceText;
    resulttext.value = [...resulttext.value, parsedResponse];

  } catch (error) {
    console.error(`Error fetching balances: ${error.message}`);
    console.error("Full error response:", error.response?.data);
    resulttext.value = [...resulttext.value, `Failed to get balances: ${error.message}`];
  }
}

async function transferFunds() {
  try {
    const timestamp = new Date().toISOString().split('.')[0] + "Z";
    const method = 'POST';
    const url = '/api/v5/asset/transfer';

    const subAcctName = subAcct.value.trim();
    const currency = ccy.value.trim();
    const amount = transferamount.value.trim();

    if (!subAcctName || !currency || !amount) {
      console.warn("Missing parameters!");
      resulttext.value = [...resulttext.value, "Missing parameters!"];
      return;
    }

    const body = JSON.stringify({
      type: "2",
      subAcct: subAcctName,
      ccy: currency,
      amt: amount,
      from: "6",
      to: direction.value
    });

    const headers = {
      'Content-Type': 'application/json',
      'OK-ACCESS-SIGN': CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(timestamp + method + url + body, secretKey.value)
      ),
      'OK-ACCESS-KEY': apiKey.value,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase.value
    };

    const response = await axios.post(baseUrl.value + url, body, { headers });

    console.log("🔹 Transfer Response:", response.data);

    if (response.data?.code === "0") {
      resulttext.value = [...resulttext.value, `Transfer successful: ${amount} ${currency} from ${subAcctName}`];
    } else if (response.data?.code) {
      resulttext.value = [...resulttext.value, `Transfer failed: ${response.data.msg} (Code: ${response.data.code})`];
    } else {
      resulttext.value = [...resulttext.value, `Unexpected response: ${JSON.stringify(response.data)}`];
    }

  } catch (error) {
    console.error("Full error response:", error.response?.data);

    if (error.response?.data) {
      const errorMsg = `Transfer error: ${error.response.data.msg} (Code: ${error.response.data.code})`;
      resulttext.value = [...resulttext.value, errorMsg];
    } else {
      resulttext.value = [...resulttext.value, `Transfer error: ${error.message}`];
    }
  }
}

const generateOKXSign = (timestamp, method, body) => {
  const withdrawalEndpoint = '/api/v5/asset/withdrawal';
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + method + withdrawalEndpoint + body, secretKey.value))
};

function getRandomNumber(min, max, fixed) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, fixed);
  return (Math.floor(rand * power) / power).toFixed(fixed);
};

async function sendTokens({ destinationWallet }) {
var ammount = getRandomNumber(Number(minWithdrawal.value), Number(maxWithdrawal.value), 4);

const withdrawalParams = {
    amt: ammount,
    dest: 4,
    ccy: ccy.value,
    chain: networks.value,
    toAddr: destinationWallet
  };

const axios = new Axios({
  headers: {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': apiKey.value,
    'OK-ACCESS-PASSPHRASE': passphrase.value
  }
});

const TIMESTAMP = new Date().toISOString().split('.')[0] + "Z"
const body = JSON.stringify(withdrawalParams)
// API query const
const response = await axios.post('https://www.okx.cab/api/v5/asset/withdrawal', body, {
    headers: {
      'OK-ACCESS-TIMESTAMP': TIMESTAMP,
      'OK-ACCESS-SIGN': generateOKXSign(TIMESTAMP, 'POST', body),
    }
  })
const parsedResponse = JSON.parse(response.data);
const responseError = parsedResponse.msg;
  if (responseError && responseError.length > 0) {
    throw new Error(`Error : ${responseError}`);
  }

const wdId = parsedResponse.data[0].wdId;
result = (`${new Date().toString()} Successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX TXID: ${wdId}`);
resulttext.value = [...resulttext.value, result];
if (usedelay.value === true) {
const delay = getRandomNumber(Number(mintimedelay.value), Number(maxtimedelay.value), 50) * 1000;
result = (`Delaying next withdrawal for ${delay / 1000} seconds...`);
resulttext.value = [...resulttext.value, result];
await new Promise(resolve => setTimeout(resolve, delay));
} else {console.log('usedelay is false, skipping delay.');}
console.log("")
}

async function withdrawToAddresses() {
progress.value=true;
try {
      const wallets = [...addresses.value, ...extaddresses.value].filter(w => w && w.length > 0);
    for (const destinationWallet of wallets) {
      await sendTokens({ destinationWallet });
    }
  }
  catch (error)  {
console.log('\x1b[31m%s\x1b[0m', `Failed:`, error.message);
result = `Failed: ${error.message}`;
resulttext.value = [...resulttext.value, result];  }
progress.value=false;
};

export default {
  setup () {
  return {
      addresses,
      extaddresses,
      apiKey,
      secretKey,
      passphrase,
      minWithdrawal,
      maxWithdrawal,
      mintimedelay,
      maxtimedelay,
      usedelay,
      networks,
      ccy,
      resulttext,
      resulttextget,
      result,
      progress,
      submanage,
      subAcct,
      transferamount,
      direction,
      transferFunds,
      getbalances,
      addExtraAddress,
      OKXminfee,
      withdrawToAddresses
    } 
}
}
</script>

<template>
<div class="container">
  <div class="row" style="margin-left: 15px;">
   <!-- 1st card begin-->
    <div class="col-md-4">
    <q-card class="sticky-card">
    <div class="col-sm q-gutter-md q-pa-md" style="max-width: auto; margin-left: -25px; font-size: 10px;">
    <ul><b>Fill the address carefully and successively. This form is not validating inputs</b></ul>
    <q-input v-for="(address, index) in addresses" :key="index" standout="bg-teal text-white" stack-label v-model="addresses[index]" :label="'Address ' + (index + 1)"/>
    <q-input v-for="(address, index) in extaddresses" :key="'extra-' + index" standout="bg-orange text-white" stack-label v-model="extaddresses[index]" :label="'Extra Address ' + (index + 1)"/>
    <q-btn fab icon="add" color="grey" @click="addExtraAddress()">
    <q-tooltip>Additional addresses are not stored</q-tooltip>
    </q-btn>
    </div>
    </q-card>
   </div>
  <!-- 1st card end -->

<!-- second third cards begin -->
<div class="col-md-8" style="padding: 0px;  margin-left: -60px;">
  <div class="row" style="width: auto;">
    <div class="col-md-6">
      <q-card class="content card-size">
        <div class="q-gutter-md q-pa-md card-content">
          <ul><b>Set a range of withdraw values MIN and MAX</b></ul>
          <div class="row input-group">
            <q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="min Withdrawal" />
            <q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="max Withdrawal" />
          </div>
          <q-toggle v-model="usedelay" color="blue" label="Use Time Delay Between Transfers"/>
          <div class="row input-group">
            <q-input standout="bg-teal text-white" stack-label v-model="mintimedelay" label="min time in seconds"/>
            <q-input standout="bg-teal text-white" stack-label v-model="maxtimedelay" label="max time in seconds"/>
          </div>
        </div>
      </q-card>
    </div>

    <div class="col-md-6">
      <q-card class="content card-size">
        <div class="q-gutter-md q-pa-md card-content">
          <ul><b>Fill API OKX Configuration Parameters</b></ul>
          <q-input type="password" style="width: 300px" outlined v-model="apiKey" label="apiKey" />
          <q-input type="password" style="width: 300px" outlined v-model="secretKey" label="secretKey" />
          <q-input type="password" style="width: 300px" outlined v-model="passphrase" label="Passphrase" />
        </div>
      </q-card>
    </div>
  </div>
<!-- second third cards end -->
<div style="height: 30px"><q-space /></div>
<!-- q-toggle -->
<div class="row align-items-start" style="width: auto">
  <!-- Left col in row: q-toggle -->
  <div class="col-sm-1">
    <q-card class="smallcard" style="display: flex; flex-direction: column; margin-left: 20px; align-items: center;">
      <q-toggle color="red" v-model="submanage"/>
      <div class="text-caption">Manage Accounts</div>
    </q-card>
  </div>
<!-- Right col in row: card 4.1 -->
    <div class="col-md-10.5 content">
      <q-card v-if="submanage" style="height: 140px;">
        <div class="align-items-left" style="width: auto"><b>Configure Transfer Parameters to Main account</b></div>
        <div class="row q-gutter-sm" style="align-items: center; padding: 10px;">
        <q-input class="col-md-2" label="SubAcct name" v-model="subAcct" outlined />
        <q-input class="col-md-2" label="Amount" v-model="transferamount" outlined />
        <div class="row q-gutter-sm justify-end">
          <q-btn-toggle class="col-sm-auto" size="md" style="margin-bottom: 5px;" toggle-color="blue" v-model="ccy" push glossy
           :options="[
           {label: 'ETH', value: 'ETH'},
           {label: 'USDT', value: 'USDT'},
           {label: 'USDC', value: 'USDC'},
           {label: 'BTC', value: 'BTC'},
           {label: 'SOL', value: 'SOL'},
           {label: 'BERA', value: 'BERA'},
          {label: 'ATOM', value: 'ATOM'}]"/>
       </div>
        </div>
        <q-btn-toggle style="margin-left: 20px" class="col-sm-auto" toggle-color="green" v-model="direction" push glossy
        :options="[
        {label: 'Receive to Funding', value: '6'},
        {label: 'Receive to Trading', value: '18'}]"/>
       </q-card>
    <!-- #4.1 end   justify-end -->
<!-- 4 card begin -->
  <q-card v-else class="col-md-10.5 content" style="height: 140px; padding: 10px;">
    <div class="q-gutter-sm q-pa-sm" style="padding: 10px;">
      <b>Select Chain & Asset to withdraw</b>
    <q-btn-toggle size="sm" v-model="ccy" push glossy toggle-color="green"
      :options="[
        {label: 'ETH', value: 'ETH'},
        {label: 'USDT', value: 'USDT'},
        {label: 'USDC', value: 'USDC'},
        {label: 'BTC', value: 'BTC'},
        {label: 'WBTC', value: 'WBTC'},
        {label: 'BNB', value: 'BNB'},
        {label: 'APT', value: 'APT'},
        {label: 'Polygon', value: 'POL'},
        {label: 'SUI', value: 'SUI'},
        {label: 'TON', value: 'TON'},
        {label: 'SOL', value: 'SOL'},
        {label: 'BERA', value: 'BERA'},
        {label: 'ATOM', value: 'ATOM'}]"/>
    </div>
  
  <div style="display: flex; justify-content: center;">
    <q-btn-toggle v-if="ccy === 'ETH'" size="md" v-model="networks" push glossy toggle-color="blue"
      :options="[{label: 'ERC20', value: 'ETH-ERC20'},
        {label: 'Arbi', value: 'ETH-Arbitrum One'},
        {label: 'Base', value: 'ETH-Base'},
        {label: 'Linea', value: 'ETH-Linea'},
        {label: 'Optimism', value: 'ETH-Optimism'},
        {label: 'Starknet', value: 'ETH-Starknet'}]"/>
    <q-btn-toggle v-if="ccy === 'USDT'" size="md" v-model="networks" push glossy toggle-color="cyan"
      :options="[{label: 'ERC20', value: 'USDT-ERC20'},
        {label: 'TRC20', value: 'USDT-TRC20'},
        {label: 'SOL', value: 'USDT-Solana'},
        {label: 'Polygon', value: 'USDT-Polygon'},
        {label: 'TON', value: 'USDT-TON'},
        {label: 'Optimism', value: 'USDT-Optimism'},
        {label: 'Arbi', value: 'USDT-Arbitrum One'}]"/>
    <q-btn-toggle v-if="ccy === 'USDC'" size="md" v-model="networks" push glossy toggle-color="teal"
      :options="[{label: 'ERC20', value: 'USDC-ERC20'},
        {label: 'Solana', value: 'USDC-Solana'},
        {label: 'Polygon', value: 'USDC-Polygon'},
        {label: 'Base', value: 'USDC-Base'},
        {label: 'Optimism', value: 'USDC-Optimism'},
        {label: 'Arbi', value: 'USDC-Arbitrum One'}]"/>
    <q-btn-toggle v-if="ccy === 'BTC'" size="md" v-model="networks" push glossy toggle-color="dark"
      :options="[{label: 'BTC-bitcoin', value: 'BTC-Bitcoin'},
        {label: 'BTC-Lightning', value: 'BTC-Lightning'}]"/>
    <q-btn-toggle v-if="ccy === 'WBTC'" size="md" v-model="networks" push glossy toggle-color="blue"
      :options="[{label: 'ERC20', value: 'ETH-ERC20'}]"/>        
    <q-btn-toggle v-if="ccy === 'BNB'" size="md" v-model="networks" push glossy toggle-color="brown"
      :options="[{label: 'BNB-BSC', value: 'BNB-BSC'}]"/>  
    <q-btn-toggle v-if="ccy === 'APT'" size="md" v-model="networks" push glossy toggle-color="grey"
      :options="[{label: 'APTOS', value: 'APT-Aptos'}]"/>
    <q-btn-toggle v-if="ccy === 'POL'" size="md" v-model="networks" push glossy toggle-color="green"
      :options="[{label: 'POL-Polygon', value: 'POL-Polygon'}]"/>
    <q-btn-toggle v-if="ccy === 'TON'" size="md" v-model="networks" push glossy toggle-color="purple"
      :options="[{label: 'TON', value: 'TON-TON'}]"/>
    <q-btn-toggle v-if="ccy === 'SOL'" size="md" v-model="networks" push glossy toggle-color="blue"
      :options="[{label: 'SOLANA', value: 'SOL-Solana'}]"/>
    <q-btn-toggle v-if="ccy === 'SUI'" size="md" v-model="networks" push glossy toggle-color="blue"
      :options="[{label: 'SUI', value: 'Sui'}]"/>     
    <q-btn-toggle v-if="ccy === 'ATOM'" size="md" v-model="networks" push glossy toggle-color="blue"
      :options="[{label: 'Cosmos', value: 'ATOM-Cosmos'}]"/>             
    <q-btn-toggle v-if="ccy === 'BERA'" size="md" v-model="networks" push glossy toggle-color="yellow"
      :options="[{label: 'BERA', value: 'BERA-Berachain'}]"/>        
     </div> 
     </q-card>
    </div>
    </div>
    <!-- fourth card end -->
    <div style="height: 20px"><q-space /></div>
    <!-- fivth card begin -->
    <div class="row btn-row">
    <q-btn color="secondary" flat label="Press to empty console screen" @click="resulttext = [],resulttextget = []" />
    <q-btn v-if="!submanage" color="red" label="Withdraw" v-model="progress" :loading="progress" :disabled="progress"  @click="withdrawToAddresses()" /> 
    <q-btn v-if="submanage" color="red" label="Transfer" :loading="progress" :disabled="progress" @click="transferFunds()" /> 
    <q-btn v-if="!submanage" color="secondary" flat label="Get Min Withdraw Fee" @click="OKXminfee()"/>
    <q-btn v-if="submanage" color="secondary" flat label="Get SubAcct Balances" @click="getbalances()"/>
     </div>
    
<div style="padding-left: 20px;">
    <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 30%, #194f88 100%);">
      <ul><b>Console output</b></ul>
      <q-separator dark inset />
  <div class="row" >
    <div class="col-sm">
    <q-scroll-area style="height: 600px; max-width: 550px;">
     <q-card-section class="q-pt-none" v-for="item in resulttext" :key="item">
        <q-separator dark inset />
        {{ item }}
        <q-separator dark inset />
      </q-card-section>
    </q-scroll-area>
    </div>
    <div class="col-sm">
    <q-scroll-area style="height: 600px; max-width: 550px;">
      <q-card-section class="q-pt-none" v-for="item in resulttextget" :key="item">
        <q-separator dark inset />
        {{ item }}
        <q-separator dark inset />
      </q-card-section>
    </q-scroll-area>
    </div>
  </div>
  </q-card>
</div>
<!-- fivth card end-->
  </div>
 </div>
</div>
</template>

<!-- Some styles need to check them and sync with main styles -->
<style scoped>
.card-size {
  width: 400px;  
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-content {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.smallcard {
  height: 140px;
  width: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.main-container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
}

/* Sticky card */
.sticky-card {
  position: sticky;
  left: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  z-index: 100;
  padding: 10px;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
  min-height: auto;
}

.content {
  width: auto;
  margin-left: 20px;
}

.btn-row {
  display: flex;
  justify-content: space-between; 
  width: 100%; 
  padding: 0 20px; 
}

.sm-buttons
  
  .q-btn 
  { 
    width: 55px;
  }

  .q-btn-group 
  {
    box-shadow: 1px;
    width: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .q-btn-toggle  
  {
    box-shadow: 1px;
    padding-left: none;
    max-width: auto;
    display: flex;
    flex-wrap: wrap;    
  }

  body.body--dark {
  background: #040404
}
h3 {
  font-size: 22px;
  margin: 10px 0 0;
}

ul {
  list-style-type: none;
  padding: 30;
}
a {
  color: #42b983;
}
</style>
