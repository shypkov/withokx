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
//console.log(`ammount from random`, ammount);
const withdrawalParams = {
    amt: ammount,
    fee: fee.value,
    dest: 4,
    ccy: 'ETH',
    chain: 'ETH-Arbitrum one',
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
//console.log(`withdrawal.fee`, withdrawalParams.fee);
//console.log(`withdrawal.amt`, withdrawalParams.amt);

//error proccessing
const parsedResponse = JSON.parse(response.data);
const responseError = parsedResponse.msg;
  if (responseError && responseError.length > 0) {
    throw new Error(`Error : ${responseError}`);
  }

const success = console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!`);
console.log(`Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain}`);
const wdId = parsedResponse.data[0].wdId;
console.log(`OKX transaction ID: ${wdId}`);

const delay = getRandomNumber(Number(mintimedelay.value), Number(maxtimedelay.value), 50) * 1000;
console.log('\x1b[33m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
await new Promise(resolve => setTimeout(resolve, delay));
  console.log("")
}

async function withdrawToArbAddresses() {
  try {
    const walletsarb = [adress1.value,adress2.value,adress3.value]
    for (const destinationWallet of walletsarb) {
      await sendTokens({ destinationWallet });
    }
  }
  catch (error)
  {
    console.log('\x1b[31m%s\x1b[0m', `Withdrawal failed:`, error.message);
  }
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
      usedelay: ref(false),
      withdrawToArbAddresses
    } 
}
}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-lg">
      <q-toggle v-model="usedelay" color="blue" label="Use Time Delay between transfers"/>
    </div>
      <div class="q-gutter-md" style="max-width: 250px; padding: 10px;" v-if="usedelay === true">
      <q-input standout="bg-teal text-white" stack-label v-model="mintimedelay" label="min time in seconds"/>
      <q-input standout="bg-teal text-white" stack-label v-model="maxtimedelay" label="max time in seconds"/>
      </div>
  <div class="q-gutter-md" style="max-width: 450px">
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Adress1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Adress2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Adress3"/> 
    <li>
  <div class="q-pa-md q-gutter-sm">
  <q-btn color="primary" label="Transfer" @click="withdrawToArbAddresses()" />
  </div>
<div style="font-size: 8px">
API URL OKX <a href="https://www.okx.cab/api/v5/asset/withdrawal" target="apiUrl" rel="noopener">https://www.okx.cab/api/v5/asset/withdrawal</a>
</div>
<ul> ONLY arbETH can be withdrawed for now.</ul>
<!--  <div class="q-pa-md q-gutter-sm">
      <q-badge color="green" rounded class="q-mr-sm" /> 
      {{ result }}
  </div>-->
<p>Configuration params</p>
</li>
</div>
<div class="q-gutter-md" style="max-width: 300px">
<q-input outlined v-model="apiKey" label="apiKey" />
<q-input outlined v-model="secretKey" label="secretKey" />
<q-input outlined v-model="passphrase" label="Passphrase" />
<q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="minWithdrawal" />
<q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="maxWithdrawal" />
<q-input outlined v-model="fee" placeholder="0.0001" label="fee" />
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
