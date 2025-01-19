<script>
/* eslint-disable */ 
//import { useQuasar } from 'quasar'
//import { enc, HmacSHA256 } from 'crypto-js'
import axios from 'axios'
//import crypto from 'cryptoJS'
import { Axios } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

const apiKey = useLocalStorage('apikey', '');
const passphrase = useLocalStorage('pass', '');
const secretKey = useLocalStorage('secret', '');
const fee = ref();
const adress1 = useLocalStorage('address1', '');
const adress2 = useLocalStorage('address2', '');
const adress3 = useLocalStorage('address3', '');
const adress4 = useLocalStorage('address4', '');
const adress5 = useLocalStorage('address5', '');
const minWithdrawal = ref();
const maxWithdrawal = ref();
const mintimedelay = ref();
const maxtimedelay = ref();
const networks = ref('ETH-ERC20');
const ccy = ref('ETH');
const resulttext = ref([]);
const resulttextget = ref([]);
let result = ref();
let howto = ref(false);
const progress = ref(false);
const usedelay = ref(false);
const apiUrl = ref('https://www.okx.cab/api/v5/asset/withdrawal');
const baseUrl = ref('https://www.okx.com');

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
//const responseError = FullResponse.msg;
//const FullResponse = ${JSON.stringify(response.data)};
const parsedResponse = `${new Date().toString()} - 'min withdraw fee = ' ${FullResponse.data[0].minFee} '& min withdraw value = ' ${FullResponse.data[0].minWd} 'for chain' ${FullResponse.data[0].chain} 'ccy' ${FullResponse.data[0].ccy}`;
resulttextget.value = [...resulttextget.value, parsedResponse];
//const minFee = FullResponse.data[0].minFee;
//const chain = FullResponse.data[0].chain;
//const ccy = FullResponse.data[0].ccy;
//resulttext.value = [...resulttext.value, FullResponse];
//if (responseError && responseError.length > 0) {throw new Error(`Error : ${responseError}`);}
console.log(response.data);
}
catch (error)
{
  console.error(`Error: ${error.message}`);
};
};

//create encrypted hash for OKXsign for withdraw
const generateOKXSign = (timestamp, method, body) => {
  const withdrawalEndpoint = '/api/v5/asset/withdrawal';
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + method + withdrawalEndpoint + body, secretKey.value))
};

//random number for withdrawal amount
function getRandomNumber(min, max, fixed) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, fixed);
  return (Math.floor(rand * power) / power).toFixed(fixed);
};

async function sendTokens({ destinationWallet }) {
//const ON_CHAIN = 4;
var ammount = getRandomNumber(Number(minWithdrawal.value), Number(maxWithdrawal.value), 4);

const withdrawalParams = {
    amt: ammount,
    fee: fee.value,
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
const response = await axios.post(apiUrl.value, body, {
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
//console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX transaction ID: ${wdId}`);
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
//let result = '';
//resulttext.value = [...resulttext.value, 'Started'];
progress.value=true;
try {
    const wallets = [adress1.value,adress2.value,adress3.value,adress4.value,adress5.value].filter(w => w && w.length > 0);
    for (const destinationWallet of wallets) {
      await sendTokens({ destinationWallet });
    }
  }
  catch (error)
  {
console.log('\x1b[31m%s\x1b[0m', `Failed:`, error.message);
result = ('Failed', error.message);
resulttext.value = [...resulttext.value, result];
  }
//resulttext.value = [...resulttext.value, 'Finished'];
progress.value=false;
};

export default {
  setup () {
  return {
      adress1,
      adress2,
      adress3,
      adress4,
      adress5,
      apiKey,
      secretKey,
      passphrase,
      minWithdrawal,
      maxWithdrawal,
      fee,
      mintimedelay,
      maxtimedelay,
      usedelay,
      networks,
      ccy,
      resulttext,
      resulttextget,
      result,
      howto,
      progress,
      apiUrl,
      OKXminfee,
      withdrawToAddresses
    } 
}
}
</script>

<template>
<div style="width: 1200px; margin-left: 20px; font-size: 10px; max-height: auto;">
<q-btn-dropdown color="blue" label="Connection">
  <q-list>
        <q-item clickable v-close-popup @click="apiUrl = 'https://www.okx.cab/api/v5/asset/withdrawal'">
          <q-item-section>
            <q-item-label>Primary API route</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="apiUrl = 'https://www.okx.com/api/v5/asset/withdrawal'">
          <q-item-section>
            <q-item-label>Secondary API route</q-item-label>
          </q-item-section>
        </q-item>
  </q-list>
</q-btn-dropdown>
<q-input :readonly="true" label="Selected api direction" v-model="apiUrl"/>
</div>

<div class="container">
  <div class="row" style="width: 1200px; margin-left: 20px;">
  <q-card>
    <div class="row" style="width: 1180px; margin-left: 20px;">
    <div class="col-sm" style="max-width: 400px; margin-left: auto;">
    <div class="q-gutter-md q-pa-md" style="font-size: 11px;">
    <ul><b>Fill the address carefully and successively. This form is not validating inputs</b></ul>
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Address1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Address2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Address3"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="adress4" label="Address4"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress5" label="Address5"/>
    </div>
<!--    <q-btn fab icon="add" color="grey" />-->
  </div>
  <div class="col-sm" style="max-width: 350px; margin-left: 20px; align-items: left; ">
    <li>
    <ul><b>You can set a range of values between min and max to randomize withdraw value</b></ul>
  </li>
    <div class="q-gutter-md" style="width: 240px; margin-left: 60px;">
      <q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="minWithdrawal value" />
      <q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="maxWithdrawal value" />
      <q-input outlined v-model="fee" placeholder="0.0001" label="fee" />
    </div>
    <ul>Press Withdraw Button to complete transfer</ul>
    <div style="max-width: 240px; margin-left: 70px; align-items: center; ">
      <q-btn v-model="progress" :disabled="progress" color="primary" label="Withdraw" @click="withdrawToAddresses()" /> 
      <div v-if="progress">
        <q-spinner-box color="primary" size="3em" /> 
        <q-tooltip :offset="[0, 8]">Running</q-tooltip>
      </div>
      <div class="q-pa-md q-gutter-sm">
      <q-btn label="FAQ: How to use" color="red" @click="howto = true" />
      <q-dialog v-model="howto">
      <q-card>
        <q-card-section>
          <div class="text-h8">FAQ: HOW TO USE</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>Disclaimer: This App doesn't store any secrets or other keys in cloud\external storages. Clearing the browser\page cache will drop all the stored secrets and other data from input fields</p>
          <p>- INFO: Withdraw funds conditions and tech usage are different through differen CEX's and you shoould get some knowledge about this difference</p>
          <p>- INFO: This app layout is not adapted for mobile browsers, but still can be used on mobile browsers</p>
          <p>- INFO: Get "Min withdraw Fee" works only if ApiKey, SecretKey and Passphrase are set correctly</p>
          <p>- Action: Go to <a href='https://www.okx.com/ru/account/my-api'>OKX API management and Create API key</a>. Check the box next to the Enable Withdrawals. You shoud receive in result SecretKey and API key + passphrase for this keys and you need to fill the proper fields in form</p>
          <p>- Action: !WHITELIST all the adresses on exchange management page on which you wish to accept withdrawals. Notice that you need to whitelist adresses depending on networks</p>
          <p>- Action: Fill the fields above with values, optionally you can enable random time delay between transfers on addresses and just click Withdraw button... watch result in console log</p>
          <p>- WARNING: Please DO NOT RELOAD or CLOSE THIS Page when WITHDRAW is Running. If you do - the process will be terminated</p>
          <p>- WARNING: Notice that Form inputs are not validated. Be sure you enter a proper adress and values before withdraw</p>
          <p>- Debug: If you see CORS error in console then install browser extension to avoid CORS blocking <a href='https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf'>CORS EXT</a> and enable it.</p>
          <p>- Debug: if you see Network error message with "net::ERR_NAME_NOT_RESOLVED" then select another CONNECTION url from the dropdown button CONNECTION</p>
          <p>- ADVICE: if you still have issues with the app or need a neccessary function, contact the dev: <a href='https://t.me/cryptopitek'>cryptopitek</a></p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="I got it" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  </div>
  </div>  

  <div class="col-sm" style="align-items: center; margin-left: 20px;">
    <div class="q-gutter-md q-pa-md" style="max-width: 350px; font-size: 12px;">
      <li></li>
    <ul><b>fullfill Configuration Params from API OKX</b></ul>
      <q-input outlined v-model="apiKey" label="apiKey" />
      <q-input outlined v-model="secretKey" label="secretKey" />
      <q-input outlined v-model="passphrase" label="Passphrase" />
    </div>

  <div class="col-sm">
<!--      <q-badge color="green" v-if="transfer === true" rounded class="q-mr-sm" />    -->
    <div class="q-gutter-md q-pa-md" style="max-width: 320px; font-size: 11px; margin-left: 0px;">
    <q-tooltip anchor="bottom middle" self="bottom middle">
      <b>You can put a range of values between min&max ​​in seconds for the output of each subsequent transaction</b>
    </q-tooltip>
      <q-toggle v-model="usedelay" color="blue" label="Use Time Delay Between Transfers"/>
       <div class="row" style="max-width: 300px; margin-left: 15px;" v-if="usedelay">
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="mintimedelay" label="min time in seconds"/>
       </div>
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="maxtimedelay" label="max time in seconds"/>
      </div>
      </div>
    </div>
    </div>
  </div>
</div>
</q-card>
</div>
<div style="height: 10px">
  <q-space />
</div>


<div class="row" style="width: 1200px; margin-left: 20px; font-size: 10px; max-height: auto;">  
<q-card>
  <span class="q-gutter-sm"><b>Select Chain & Asset to withdraw</b></span>
   <div class="row" >
   <div class="col-sm q-pa-sm" style="width: 1200px; display: flex; justify-content: center;">
    <q-btn-toggle
      size="md"
      v-model="ccy"
      push
      glossy
      toggle-color="green"
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
        {label: 'AVAX', value: 'AVAX'},
        {label: 'ATOM', value: 'ATOM'}
        ]"/>
    </div>
    </div>
<div class="row" >
<div class="col-sm q-pa-sm" style="width: 1200px; display: flex; justify-content: center;">
  <div style="display: flex; justify-content: center; width: 1200px;">
    <q-btn-toggle v-if="ccy === 'ETH'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'ERC20', value: 'ETH-ERC20'},
        {label: 'Arbi', value: 'ETH-Arbitrum One'},
        {label: 'Base', value: 'ETH-Base'},
        {label: 'Linea', value: 'ETH-Linea'},
        {label: 'Optimism', value: 'ETH-Optimism'},
        {label: 'Starknet', value: 'ETH-Starknet'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'USDT'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="cyan"
      :options="[
        {label: 'ERC20', value: 'USDT-ERC20'},
        {label: 'TRC20', value: 'USDT-TRC20'},
        {label: 'SOL', value: 'USDT-Solana'},
        {label: 'Polygon', value: 'USDT-Polygon'},
        {label: 'TON', value: 'USDT-TON'},
        {label: 'Optimism', value: 'USDT-Optimism'},
        {label: 'Arbi', value: 'USDT-Arbitrum One'}        
        ]"/>
    <q-btn-toggle v-if="ccy === 'USDC'"
      size="md"  
      v-model="networks"
      push
      glossy
      toggle-color="teal"
      :options="[
        {label: 'ERC20', value: 'USDC-ERC20'},
        {label: 'Solana', value: 'USDC-Solana'},
        {label: 'Polygon', value: 'USDC-Polygon'},
        {label: 'Base', value: 'USDC-Base'},
        {label: 'Optimism', value: 'USDC-Optimism'},
        {label: 'Arbi', value: 'USDC-Arbitrum One'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'BTC'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="dark"
      :options="[
        {label: 'BTC', value: 'BTC-Bitcoin'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'WBTC'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'ERC20', value: 'ETH-ERC20'},
        {label: 'XLayer', value: 'ETH-X Layer'}
        ]"/>        
    <q-btn-toggle v-if="ccy === 'BNB'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="brown"
      :options="[
        {label: 'BNB-BSC', value: 'BNB-BSC'}
        ]"/>  
    <q-btn-toggle v-if="ccy === 'APT'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="grey"
      :options="[
        {label: 'APTOS', value: 'APT-Aptos'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'POL'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="green"
      :options="[
        {label: 'POL', value: 'POL-Polygon'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'TON'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="purple"
      :options="[
        {label: 'TON', value: 'TON-TON'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'SOL'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'SOLANA', value: 'SOL-Solana'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'SUI'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'SUI', value: 'Sui'}
        ]"/>     
    <q-btn-toggle v-if="ccy === 'ATOM'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'Cosmos', value: 'Cosmos'}
        ]"/>             
    <q-btn-toggle v-if="ccy === 'AVAX'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="yellow"
      :options="[
        {label: 'AVAX C-Chain', value: 'AVAX-Avalanche C-Chain'}
        ]"/>        
    </div> 
  </div>
 </div>
</q-card>
</div>

<div style="width: 1200px; margin-left: 20px; font-size: 10px; height: 600px;">
<div class="row" style="padding-left: 360px; ">
    <q-btn color="secondary" flat label="Press to empty console screen" @click="resulttext = []" />
    <q-btn color="secondary" flat label="Get Min Withdraw Fee on selected chain" @click="OKXminfee()"/>
</div>    
    <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 30%, #194f88 100%);">
      <ul><b>Console output</b></ul>
      <q-separator dark inset />
  <div class="row">
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
</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
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
</style>
