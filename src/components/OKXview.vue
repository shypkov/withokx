<script>
/* eslint-disable */ 
//import { useQuasar } from 'quasar'
//import { enc, HmacSHA256 } from 'crypto-js'
//import axio from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { Axios } from 'axios'
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

const apiKey = useLocalStorage('apikey', '');
const passphrase = useLocalStorage('pass', '');
const secretKey = useLocalStorage('secret', '');
const fee = ref();
const adress1 = useLocalStorage('wallet1', '');
const adress2 = useLocalStorage('wallet2', '');
const adress3 = useLocalStorage('wallet3', '');
const adress4 = useLocalStorage('wallet4', '');
const adress5 = useLocalStorage('wallet5', '');
const minWithdrawal = ref();
const maxWithdrawal = ref();
const mintimedelay = ref();
const maxtimedelay = ref();
const networks = ref('ETH-ERC20');
const ccy = ref('ETH');
const resulttext = ref([]);
let result = ref();
let howto = ref(false);
const progress = ref(false);
const usedelay = ref(false);
const apiUrl = ref('https://www.okx.cab/api/v5/asset/withdrawal');

//async function testreq() {
//axio.get('http://5.75.160.158/api/v5/market/ticker')
//    .then(response => {console.log(response.data)})
//    .catch(err => {console.error(err)});
//};

//create encrypted hash for OKXsign
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

//const apiUrl = 'https://www.okx.cab/api/v5/asset/withdrawal'

const TIMESTAMP = new Date().toISOString().split('.')[0] + "Z"
const body = JSON.stringify(withdrawalParams)
// API query const
const response = await axios.post(apiUrl.value, body, {
    headers: {
      'OK-ACCESS-TIMESTAMP': TIMESTAMP,
      "OK-ACCESS-SIGN": generateOKXSign(TIMESTAMP, 'POST', body),
    }
  })
const parsedResponse = JSON.parse(response.data);
const responseError = parsedResponse.msg;
  if (responseError && responseError.length > 0) {
    throw new Error(`Error : ${responseError}`);
  }

const wdId = parsedResponse.data[0].wdId;
console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX transaction ID: ${wdId}`);
result = (`Successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX TXID: ${wdId}`);
resulttext.value = [...resulttext.value, result];
const delay = getRandomNumber(Number(mintimedelay.value), Number(maxtimedelay.value), 50) * 1000;
console.log('\x1b[36m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
result = (`Delaying next withdrawal for ${delay / 1000} seconds...`);
resulttext.value = [...resulttext.value, result];
await new Promise(resolve => setTimeout(resolve, delay));
console.log("")
}

async function withdrawToAddresses() {
//let result = '';
//resulttext.value = [...resulttext.value, 'Started'];
//console.log(apiUrl.value, 'current apiURL');
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
//  const $q = useQuasar()
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
      result,
      howto,
      progress,
      apiUrl,
//      testreq,
      withdrawToAddresses
    } 
}
}
</script>

<template>
<div>
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
<!--<q-btn color="primary" label="Testrequest" @click="testreq()"/>-->
<div class="container">
  <div class="row"> 
  <div class="col-sm" style="max-width: 425px; margin-left: auto;">
    <div class="q-gutter-md q-pa-md" style="font-size: 11px;">
    <ul>Fill the adress carefully and successively. This form is not validating inputs</ul>
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Adress1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Adress2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Adress3"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="adress4" label="Adress4"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress5" label="Adress5"/>
    </div>

<!--    <q-btn fab icon="add" color="grey" />-->
  </div>
  <div class="col-sm" style="max-width: 350px; margin-left: 20px; align-items: left; ">
    <li>
    <ul>You can set a range of values between min and max to randomize withdraw value</ul>
  </li>
    <div class="q-gutter-md" style="width: 250px; margin-left: 60px;">
      <q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="minWithdrawal value" />
      <q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="maxWithdrawal value" />
      <q-input outlined v-model="fee" placeholder="0.0001" label="fee" />
    </div>
    <ul>Press Transfer Button to complete transfer</ul>
      <q-btn v-model="progress" :disabled="progress" color="primary" label="Transfer" @click="withdrawToAddresses()" /> 
      <div v-if="progress">
        <q-spinner-box color="primary" size="3em" /> 
        <q-tooltip :offset="[0, 8]">Running</q-tooltip>
      </div>
      <div class="q-pa-md q-gutter-sm">
      <q-btn label="How to use" color="red" @click="howto = true" />
      <q-dialog v-model="howto">
      <q-card>
        <q-card-section>
          <div class="text-h8">HOW TO USE</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>Here goes the mini-instruction to use this page:</p>
          <p>- !!!Go to <a href='https://www.okx.com/ru/account/my-api'>OKX API management and Create API key</a>. Check the box next to the Enable Withdrawals. You shoud receive in result SecretKey and API key + passphrase for this keys and you need to fill the proper fields in form </p>
          <p>- !!!WHITELIST all the adresses on exchange management page on which you wish to accept withdrawals. Notice that you need to whitelist adresses depending on networks</p>          
          <p>- !PLEASE DO NOT RELOAD or CLOSE THIS Page when TRANSFER is Running. If you do - the process will be terminated</p>
          <p>- Fill the fields above with values, optionally you can enable random time delay between transfers on adresses and just click TRANSFER button... watch result in log miniscreen</p>
          <p>- If you see CORS error!!!Install the browser extension to avoid CORS blocking <a href='https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf'>CORS EXT</a> and enable it.</p>
          <p>- if you see Network error message press F12 in your browser and select console: if you see "net::ERR_NAME_NOT_RESOLVED" you need to select another CONNECTION from the dropdown button</p>
          <p>- Please! Notice that Form inputs are not validated. Be sure you enter a proper adress and values before withdraw</p>
          <p>- Check actual MinWithdrawal and Fee params for each network: open new tab <a href=http://91.107.163.79:3000>use fee agregator site to check actual lowest withdrawal fees</a> </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="I got it" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
    <div class="col-sm">
<!--      <q-badge color="green" v-if="transfer === true" rounded class="q-mr-sm" />-->
  <div class="q-gutter-md q-pa-md" style="max-width: 450px; font-size: 11px; margin-left: auto;">
    <q-tooltip anchor="bottom middle" self="bottom middle">
      <b>You can put a range of values between min&max ​​in seconds for the output of each subsequent transaction</b>
    </q-tooltip>
      <q-toggle v-model="usedelay" color="blue" label="Use Time Delay Between Transfers"/>
    </div>
       <div class="row" style="max-width: 300px; margin-left: 35px;" v-if="usedelay">
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="mintimedelay" label="min time in seconds"/>
       </div>
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="maxtimedelay" label="max time in seconds"/>
      </div>
      </div>
    </div>
  </div>  
  <div class="col-sm" style="align-items: center; margin-left: 20px;">
    <div class="q-gutter-md q-pa-md" style="max-width: 350px; font-size: 12px;">
      <li></li>
    <ul>fullfill Configuration Params from API OKX</ul>
      <q-input outlined v-model="apiKey" label="apiKey" />
      <q-input outlined v-model="secretKey" label="secretKey" />
      <q-input outlined v-model="passphrase" label="Passphrase" />
    </div>
    <div style="width: 300px; margin-left: 20px; font-size: 10px; max-height: 430px;">
    <ul><b>Here is an operation output</b></ul>
    <q-card class="my-card text-white" v-if="progress" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); max-height: 430px;">
      <q-scroll-area
      style="height: 250px; max-width: 300px;">
      <q-card-section class="q-pt-none" v-for="item in resulttext" :key="item">
        {{ item }}
      </q-card-section>
    </q-scroll-area>
    </q-card>
    <q-btn flat label="clear log screen" color="secondary" @click="resulttext = []" />
  </div>
  </div>
</div>
<div class="row">
  <div class="col-sm" style="max-width: 450px; margin-left: 390px;">
<span class="q-gutter-sm"><b>Select Chain to withdraw</b></span>
<div class="q-gutter-md sm-buttons" >
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
        {label: 'BNB', value: 'BNB'},
        {label: 'APT', value: 'APT'},
        {label: 'MATIC', value: 'MATIC'},
        {label: 'AVAX', value: 'AVAX'},
        {label: 'TON', value: 'TON'},
        {label: 'SOL', value: 'SOL'},
        {label: 'ZETA', value: 'ZETA'}
        ]"/>
</div>
<span class="q-gutter-sm"><b>Select asset to withdraw</b></span>
<div class="q-pa-sm q-gutter-sm" style="font-size: 10px">
    <q-btn-toggle v-if="ccy === 'ETH'"
      size="sm"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'ERC20', value: 'ETH-ERC20'},
        {label: 'Arbi', value: 'ETH-Arbitrum One'},
        {label: 'Base', value: 'ETH-Base'},
        {label: 'Linea', value: 'ETH-Linea'},
        {label: 'XLayer', value: 'ETH-X Layer'}
        ]"/>
    <q-btn-toggle v-if="ccy === 'USDT'"
      size="sm"
      v-model="networks"
      push
      glossy
      toggle-color="cyan"
      :options="[
        {label: 'ERC20', value: 'USDT-ERC20'},
        {label: 'TRC20', value: 'USDT-TRC20'},
        {label: 'SOL', value: 'USDT-Solana'},
        {label: 'Polygon', value: 'USDT-Polygon'},
        {label: 'XLayer', value: 'USDT-X Layer'},
        {label: 'Arbi', value: 'USDT-Arbitrum One'}        
        ]"/>
    <q-btn-toggle v-if="ccy === 'USDC'"
      size="sm"  
      v-model="networks"
      push
      glossy
      toggle-color="teal"
      :options="[
        {label: 'ERC20', value: 'USDC-ERC20'},
        {label: 'Solana', value: 'USDC-Solana'},
        {label: 'Polygon', value: 'USDC-Polygon'},
        {label: 'XLayer', value: 'USDC-X Layer'},
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
    <q-btn-toggle v-if="ccy === 'MATIC'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="green"
      :options="[
        {label: 'MATIC', value: 'MATIC-Polygon'}
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
    <q-btn-toggle v-if="ccy === 'ZETA'"
      size="md"
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'ZETA', value: 'ZETA-ZetaChain'}
        ]"/>      
</div>
</div>
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
    box-shadow: none;
    padding-left: 40px;
    width: 450px;
    display: flex;
    flex-wrap: wrap;  
  }

  .q-btn-toggle  
  {
    padding-left: 40px;
    width: 450px;
    display: flex;
    flex-wrap: wrap;    
  }
 
</style>
