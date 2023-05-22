<script>
/* eslint-disable */ 
//import { useQuasar } from 'quasar'
import { Axios } from 'axios'
import { CryptoJS } from 'crypto-js'
import { ref } from 'vue'

// configuration section
const apiKey = ref()
const passphrase = ref()
const secretKey = ref()
const minWithdrawal = ref()
const maxWithdrawal = ref()
//const fee = ref()
const adress1 = ref()
const adress2 = ref()
const adress3 = ref()

//create encrypted hash for OKXsign
const generateOKXSign = (timestamp, method, body) => {
  const withdrawalEndpoint = "/api/v5/asset/withdrawal";
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + method + withdrawalEndpoint + body, secretKey.value))
};


const axios = new Axios({
  headers: {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': apiKey.value,
    'OK-ACCESS-PASSPHRASE': passphrase.value
  }
});

//random number for withdrawal amount
function getRandomNumber(min, max, fixed) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, fixed);
  return (Math.floor(rand * power) / power).toFixed(fixed);
};


async function sendTokens({ destinationWallet }) {
//const ON_CHAIN = 4;

const withdrawalParams = {
    amt: getRandomNumber(0.0075, 0.02, 6),
    fee: 0.0001,
    dest: 4,
    ccy: 'ETH',
    chain: 'ETH-Arbitrum one',
    toAddr: destinationWallet
  };
  
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

//error proccessing
const parsedResponse = JSON.parse(response.data);
const responseError = parsedResponse.msg;
  if (responseError && responseError.length > 0) {
    throw new Error(`Error : ${responseError}`);
  }
// logresults
 console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!`);
 console.log(`Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain}`);
 const wdId = parsedResponse.data[0].wdId;
 console.log(`OKX transaction ID: ${wdId}`);

//  const delay = getRandomNumber(35, 150, 50) * 1000;
//  console.log('\x1b[33m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
//  await new Promise(resolve => setTimeout(resolve, delay));
  console.log("")
}

async function withdrawToAllAddresses() {
  try {
    const walletsarb = [adress1.value]
    for (const destinationWallet of walletsarb) {
      await sendTokens({ destinationWallet });
//      console.log(`apikey: ${apiKey.value}`);
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
      withdrawToAllAddresses
    } 
}
}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 500px">
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Adress1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Adress2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Adress3"/> 
    <li>
  <div class="q-pa-md q-gutter-sm">
  <q-btn color="primary" label="Transfer" @click="withdrawToAllAddresses()" />
  </div>
<!--  <div class="q-pa-md q-gutter-sm">
      <q-badge color="green" rounded class="q-mr-sm" /> 
      {{ result }}
  </div>-->
 <h3>   Configuration params</h3>
    <p>
      API URL OKX <a href="https://www.okx.com/api/v5/asset/withdrawal" target="apiUrl" rel="noopener">https://www.okx.com/api/v5/asset/withdrawal</a>
    <ul> ONLY arbETH can be withdrawed </ul>
    </p>
</li>
</div>
<div class="q-gutter-md" style="max-width: 300px">
<q-input outlined v-model="apiKey" label="Apikey" />
<q-input outlined v-model="secretKey" label="Secretkey" />
<q-input outlined v-model="passphrase" label="Passphrase" />
<q-input outlined v-model="minWithdrawal" placeholder="0.0075" label="minWithdrawal" />
<q-input outlined v-model="maxWithdrawal" placeholder="0.02" label="maxWithdrawal" />
<!--<q-input outlined v-model="fee" placeholder="0.0001" label="fee" />-->
</div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-size: 32px;
  margin: 20px 0 0;
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
