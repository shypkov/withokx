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
const adress1 = useLocalStorage('wallet1', '');
const adress2 = useLocalStorage('wallet2', '');
const adress3 = useLocalStorage('wallet3', '');
const adress4 = useLocalStorage('wallet4', '');
const adress5 = useLocalStorage('wallet5', '');
const minWithdrawal = ref();
const maxWithdrawal = ref();
const mintimedelay = ref();
const maxtimedelay = ref();
const chain = ref('ETH');
const coin = ref('ETH');
let result = ref();
let howto = ref(false);
const progress = ref(false);
const usedelay = ref(false);
const apiUrl = ref('https://api.bybit.com/v5/asset/withdraw/create');
const resulttext = ref([]);
//const recvWindow = 5000;

//async function testreq() {
//axio.get('http://5.75.160.158/api/v5/market/ticker')
//    .then(response => {console.log(response.data)})
//    .catch(err => {console.error(err)});
//};

//create encrypted hash for sign
const bybitsign = (timestamp, body) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + apiKey.value + 5000 + body))
};

//random number for withdrawal amount
function getRandomNumber(min, max, fixed) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, fixed);
  return (Math.floor(rand * power) / power).toFixed(fixed);
};

async function sendTokens({ destinationWallet }) {
var ammount = getRandomNumber(Number(minWithdrawal.value), Number(maxWithdrawal.value), 4);

const withdrawalParams = {
    amt: ammount,
    coin: coin.value,
    chain: chain.value,
    toAddr: destinationWallet
  };

const axios = new Axios({
  headers: {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': apiKey.value,
  }
});

//const apiUrl = 'https://www.okx.cab/api/v5/asset/withdrawal'
//const TIMESTAMP = new Date().toISOString().split('.')[0] + "Z"
var TIMESTAMP = Date.now().toString();
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
console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.coin} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX transaction ID: ${wdId}`);
result = (`Successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.coin} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX TXID: ${wdId}`);
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
      minWithdrawal,
      maxWithdrawal,
      mintimedelay,
      maxtimedelay,
      usedelay,
      chain,
      coin,
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
        <q-item clickable v-close-popup @click="apiUrl = 'https://api.bybit.com/v5/asset/withdraw/create'">
          <q-item-section>
            <q-item-label>Primary API route</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="apiUrl = 'https://api.bytick.com/v5/asset/withdraw/create'">
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
          <p>- 1. Create an API KEY visit here <a href='https://www.bybit.com/app/user/add-secret-key?type=auto'></a></p>
          <p>- 1.1 Use API generator <a href='https://github.com/bybit-exchange/api-rsa-generator/releases'></a> to create API key</p>
          <p>- 2. WHITELIST all the external adresses on exchange management page manually on which you wish to accept withdrawals here <a href='https://www.bybit.com/user/assets/money-address'></a></p>
          <p>- 3. Add next ip adress for withdrawals: 185.199.110.153 </p>
          <p>- Fill the fields above with values, optionally you can enable random time delay between transfers on adresses and just click TRANSFER button... watch result in log miniscreen</p>
          <p>- Bybit takes it withdrawal fee automatically</p>
          <p>- Notification! PLEASE DO NOT "RELOAD or CLOSE THIS Page" when TRANSFER is Running. If you do so - the process will be terminated</p>
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
    <ul>fullfill Configuration Params from API Bybit</ul>
      <q-input outlined v-model="apiKey" label="apiKey" />
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
<span class="q-gutter-sm"><b>Select chain and asset to withdraw</b></span>
<div class="q-gutter-md sm-buttons" >
    <q-btn-toggle
      size="md"
      v-model="coin"
      push
      glossy
      toggle-color="green"
      :options="[
        {label: 'ETH', value: 'ETH'},
        {label: 'USDT', value: 'USDT'},
        {label: 'USDC', value: 'USDC'},
        {label: 'BTC', value: 'BTC'},
        {label: 'MANTLE', value: 'MNT'},
        {label: 'MATIC', value: 'POL'},
        {label: 'TON', value: 'TON'},        
        {label: 'SOLANA', value: 'SOL'}
        ]"/>
</div>
<div class="q-pa-sm q-gutter-sm" style="font-size: 10px">
    <q-btn-toggle v-if="coin === 'ETH'"
      size="sm"
      v-model="chain"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'ETH-ERC20', value: 'ERC20'},
        {label: 'ETH-Linea', value: 'Linea'},
        {label: 'ETH-zkSync', value: 'zkSync Era'},
        {label: 'ETH-Base', value: 'Base Mainnet'},
        {label: 'ETH-BEP20', value: 'BSC (BEP20)'},
        {label: 'ETH-Arbi', value: 'Arbitrum One'}
        ]"/>
    <q-btn-toggle v-if="coin === 'USDT'"
      size="sm"
      v-model="chain"
      push
      glossy
      toggle-color="cyan"
      :options="[
        {label: 'USDT-ERC20', value: 'ERC20'},
        {label: 'USDT-TRC20', value: 'TRC20'},
        {label: 'USDT-Solana', value: 'SOL'},
        {label: 'USDT-Polygon', value: 'MATIC'},
        {label: 'USDT-TON', value: 'TON'},
        {label: 'USDT-Arbi', value: 'Arbitrum One'}        
        ]"/>
    <q-btn-toggle v-if="coin === 'USDC'"
      size="sm"  
      v-model="chain"
      push
      glossy
      toggle-color="teal"
      :options="[
        {label: 'USDC-ERC20', value: 'ERC20'},
        {label: 'USDC-Solana', value: 'Mantle Network'},
        {label: 'USDC-Polygon', value: 'Polygon PoS'},
        {label: 'USDC-SOL', value: 'SOL'},
        {label: 'USDC-Arbi', value: 'Arbitrum One'}
        ]"/>
    <q-btn-toggle v-if="coin === 'BTC'"
      size="md"
      v-model="chain"
      push
      glossy
      toggle-color="brown"
      :options="[
        {label: 'BTC', value: 'BTC'}
        ]"/>
    <q-btn-toggle v-if="coin === 'MNT'"
      size="md"
      v-model="chain"
      push
      glossy
      toggle-color="brown"
      :options="[
        {label: 'MNT-Mantle', value: 'Mantle Network'},
        {label: 'MNT-ERC20', value: 'ERC20'}
        ]"/>    
    <q-btn-toggle v-if="coin === 'MATIC'"
      size="md"
      v-model="chain"
      push
      glossy
      toggle-color="yellow"
      :options="[
        {label: 'MATIC-Pol', value: 'MATIC'},
        {label: 'MATIC-ERC20', value: 'ERC20'},
        ]"/>
    <q-btn-toggle v-if="coin === 'TON'"
      size="md"
      v-model="chain"
      push
      glossy
      toggle-color="purple"
      :options="[
        {label: 'TON', value: 'TON'}
        ]"/>
    <q-btn-toggle v-if="coin === 'SOL'"
      size="md"
      v-model="chain"
      push
      glossy
      toggle-color="gold"
      :options="[
        {label: 'SOLANA', value: 'SOL'}
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
