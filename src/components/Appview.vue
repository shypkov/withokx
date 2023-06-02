<script>
/* eslint-disable */ 
//import { useQuasar } from 'quasar'
import { Axios } from 'axios'
import CryptoJS from 'crypto-js'
// import { enc, HmacSHA256 } from 'crypto-js'
import { ref } from 'vue'

const apiKey = ref();
const passphrase = ref();
const secretKey = ref();
const fee = ref();
const adress1 = ref();
const adress2 = ref();
const adress3 = ref()
const minWithdrawal = ref();
const maxWithdrawal = ref();
const mintimedelay = ref();
const maxtimedelay = ref();
const networks = ref('ETH-Arbitrum one');
const ccy = ref('ETH');
const resulttext = ref([]);
let result = ref();
let howto = ref(false);
const complete = ref(false);
const usedelay = ref(false);

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

const apiUrl = 'https://www.okx.cab/api/v5/asset/withdrawal'
const TIMESTAMP = new Date().toISOString().split('.')[0] + "Z"
const body = JSON.stringify(withdrawalParams)
// API query const
const response = await axios.post(apiUrl, body, {
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
result = ('\x1b[32m%s\x1b[0m', `Withdrawal successful!, Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain} OKX transaction ID: ${wdId}`);
resulttext.value = [...resulttext.value, result];
const delay = getRandomNumber(Number(mintimedelay.value), Number(maxtimedelay.value), 50) * 1000;
console.log('\x1b[33m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
result = ('\x1b[33m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
resulttext.value = [...resulttext.value, result];
await new Promise(resolve => setTimeout(resolve, delay));
console.log("")
}

async function withdrawToArbAddresses() {
let result = '';
complete.value=true;
  try {
    const wallets = [adress1.value,adress2.value,adress3.value]
    for (const destinationWallet of wallets) {
      await sendTokens({ destinationWallet });
    }
  }
  catch (error)
  {
console.log('\x1b[31m%s\x1b[0m', `Withdrawal failed:`, error.message);
result = ('No more adresses can be proceeded', error.message);
resulttext.value = [...resulttext.value, result];
  }
complete.value=false;
};

export default {
  setup () {
//  const $q = useQuasar()
  return {
      adress1,
      adress2,
      adress3,
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
      complete,
      withdrawToArbAddresses
    } 
}
}
</script>

<template>
<div class="container">
  <div class="row"> 
  <div class="col-sm" style="max-width: 450px; margin-left: auto;">
    <div class="q-gutter-md q-pa-md" style="font-size: 11px;">
    <ul>Fill the adress carefully and successively. This form is not validating inputs and stops on empty adress value in field</ul>
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Adress1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Adress2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Adress3"/> 
    </div>
    <q-btn fab icon="add" direction="down" color="grey" />
  </div>
  <div class="col-sm" style="max-width: 350px; margin-left: 0px; align-items: left; ">
    <li>
    <ul>You can set a range of values between min and max to randomize withdraw value</ul>
  </li>
    <div class="q-gutter-md" style="width: 250px; margin-left: 60px;">
      <q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="minWithdrawal value" />
      <q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="maxWithdrawal value" />
      <q-input outlined v-model="fee" placeholder="0.0001" label="fee" />
    </div>
    <ul>Press Transfer Button to complete transfer</ul>
      <q-btn v-model="complete" color="primary" label="Transfer" @click="withdrawToArbAddresses()" /> 
      <div v-if="complete === true">
        <q-spinner-box color="primary" size="2em" /> 
        <q-tooltip :offset="[0, 8]">Running</q-tooltip>
      </div>
      <div class="q-pa-md q-gutter-sm">
      <q-btn label="How to use" color="red" @click="howto = true" />
      <q-dialog v-model="howto">
      <q-card>
        <q-card-section>
          <div class="text-h6">HOW TO USE</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>Here goes the mini-instruction to use this page:</p>
          <p>- Install the browser extension to avoid CORS blocking <a href='https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf'>CORS EXT</a> and enable it.</p>
          <p>- Go to <a href='https://www.okx.com/ru/account/my-api'>OKX API management and Create API key</a>. Check the box next to the Enable Withdrawals. You shoud receive in result SecretKey and API key + passphrase for this keys and you need to fill the proper fields in form </p>
          <p>- WHITELIST on exchange management page all the adresses on which you want to accept withdrawals. Notice that you need to whitelist adresses depending on networks</p>
          <p>- Fill the fields above with values, optionally you can enable random time delay between transfers on adresses and click TRANSFER button... watch result in right window</p>
          <p>- Optionally you can observe browser console for a result: press F12 and select console</p>
          <p>- Please! Be Aware selecting ETH with AVAXChain will cause an error, Eth is not a proper asset for AVAX network</p>
          <p>- Please! Notice that Form inputs are not validated. Be sure you enter a proper adress and values before withdraw</p>
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
    <q-tooltip anchor="top middle" self="bottom middle">
      <b>You can put a range of values between min&max ​​in seconds for the output of each subsequent transaction</b>
    </q-tooltip>
      <q-toggle v-model="usedelay" color="blue" label="Use Time Delay Between Transfers"/>
    </div>
       <div class="row" style="max-width: 300px; margin-left: 75px;" v-if="usedelay === true">
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="mintimedelay" label="min time in seconds"/>
       <div class="col-sm" style="max-width: 150px;">
        <q-input standout="bg-teal text-white" stack-label v-model="maxtimedelay" label="max time in seconds"/>
      </div>
      </div>
      </div>
    </div>
  </div>  
  <div class="col-sm" style="align-items: center;">
    <div class="q-gutter-md q-pa-md" style="max-width: 350px; font-size: 12px;">
      <li></li>
    <ul>fullfill Configuration Params from API OKX</ul>
      <q-input outlined v-model="apiKey" label="apiKey" />
      <q-input outlined v-model="secretKey" label="secretKey" />
      <q-input outlined v-model="passphrase" label="Passphrase" />
    </div>
    <div style="width: 300px; margin-left: 10px; font-size: 11px; max-height: 275px;">
    <ul><b>Here is an operation output</b></ul>
    <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); max-height: 260px;">
      <q-card-section v-for="item in resulttext" :key="item">
        {{ resulttext }}
      </q-card-section>
    </q-card>
  </div>
  </div>
</div>
<div class="row">
  <div class="col-sm" style="max-width: 450px; margin-left: 390px;">
<span class="q-gutter-sm"><b>Select Network and asset to withdraw</b></span>
<div class="q-gutter-md">
    <q-btn-toggle
      v-model="networks"
      push
      glossy
      toggle-color="blue"
      :options="[
        {label: 'Arbitrum', value: 'ETH-Arbitrum one'},
        {label: 'Ethereum', value: 'ETH-ERC20'},
        {label: 'Bitcoin', value: 'BTC-Bitcoin'},
        {label: 'Avax C-Chain', value: 'Avalanche C-Chain'}
        ]"/>
</div>
<div class="q-gutter-md">
    <q-btn-toggle
      v-model="ccy"
      push
      glossy
      toggle-color="green"
      :options="[
        {label: 'ETH', value: 'ETH'},
        {label: 'USDT', value: 'USDT'},
        {label: 'USDC', value: 'USDC'},
        {label: 'BTC', value: 'BTC'}
        ]"/>
</div>
</div>
</div>
</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
 
</style>
