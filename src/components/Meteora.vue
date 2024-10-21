<script>
/* eslint-disable */ 
import axios from 'axios'
//import { Axios } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const meteora1 = useLocalStorage('wallet1', '');
const meteora2 = useLocalStorage('wallet2', '');
const meteora3 = useLocalStorage('wallet3', '');
const meteora4 = useLocalStorage('wallet4', '');
const meteora5 = useLocalStorage('wallet5', '');
const resulttext = ref([]);
let result = ref();
const apiUrl = ref('https://point-api.meteora.ag/points/');

async function GetMeteora() {
  try {
    // Create an array of wallet addresses
    const wallets = [meteora1.value, meteora2.value, meteora3.value, meteora4.value, meteora5.value];

    // Iterate over wallets and fetch data for each
    for (const wallet of wallets) {
      if (wallet) { // Only fetch if the wallet is not empty
        const response = await axios.get(`${apiUrl.value}${wallet}`);
        console.log(response.data);

        // Format the result and append it to resulttext.value
        const parsedResponse = `'Meteora points' ${new Date().toString()} - 'wallet address' ${wallet} - ${JSON.stringify(response.data)}`;
        resulttext.value = [...resulttext.value, parsedResponse];
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default {
  setup () {
  return {
      meteora1,
      meteora2,
      meteora3,
      meteora4,
      meteora5,
      resulttext,
      result,
      apiUrl,
      GetMeteora
    } 
}
}
</script>

<template>
<div style="width: 1200px; margin-left: 20px; font-size: 10px; max-height: auto;">
</div>

<div class="container">
<div class="row" style="width: 1200px; margin-left: 20px;">
  <q-card>
  <div class="row" style="width: 1200px; margin-left: 0px;">
    <div class="col-sm" style="max-width: 380px; margin-left: auto;">
    <div class="q-gutter-md q-pa-md" style="font-size: 12px;">
    <ul><b>Meteora points checker</b></ul>
    <q-input standout="bg-teal text-white" stack-label v-model="meteora1" label="Address1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="meteora2" label="Address2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="meteora3" label="Address3"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="meteora4" label="Address4"/>
    <q-input standout="bg-teal text-white" stack-label v-model="meteora5" label="Address5"/>
    </div>
<!--    <q-btn fab icon="add" color="grey" />-->
    </div>
    <div class="col-sm" style="max-width: 400px; margin-left: auto;">
    <div class="q-gutter-md" style="width: 400px; margin-left: 0px;  padding: 12px;">
    <ul><b>Solayer Points checker</b></ul>
    <q-input disable standout="bg-teal text-white" stack-label v-model="solayer1" label="Address1"/>
    <q-input disable standout="bg-teal text-white" stack-label v-model="solayer2" label="Address2"/>    
    <q-input disable standout="bg-teal text-white" stack-label v-model="solayer3" label="Address3"/> 
    <q-input disable standout="bg-teal text-white" stack-label v-model="solayer4" label="Address4"/>
    <q-input disable standout="bg-teal text-white" stack-label v-model="solayer5" label="Address5"/>
    </div>
<!--    <q-btn fab icon="add" color="grey" />-->
    </div>  
    <div class="col-sm" style="align-items: center; margin-left: 20px;">
    <div class="q-gutter-md q-pa-md" style="max-width: 400px; padding: 12px;">
    <ul><b>Satlayer Points checker</b></ul>
    <q-input disable standout="bg-teal text-white" stack-label v-model="satlayer1" label="Address1"/>
    <q-input disable standout="bg-teal text-white" stack-label v-model="satlayer2" label="Address2"/>    
    <q-input disable standout="bg-teal text-white" stack-label v-model="satlayer3" label="Address3"/> 
    <q-input disable standout="bg-teal text-white" stack-label v-model="satlayer4" label="Address4"/>
    <q-input disable standout="bg-teal text-white" stack-label v-model="satlayer5" label="Address5"/>
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
    <div class="row" style="width: 1200px; margin-left: 0px;  height: 60px; padding: 10px">    
  <div style="margin-left: 45px;">
  <q-btn color="secondary" label="Get Meteora Points for adresses" @click="GetMeteora()"/>
  </div>
  <div style="margin-left: 130px;">
    <q-btn disable color="info" label="Get Solayer Points for adresses" @click="GetMeteora()"/>
  </div>
  <div style="margin-left: 130px;">
    <q-btn disable color="warning" label="Get Satlayer Points for adresses" @click="GetMeteora()"/>
  </div> 
</div>
</q-card>
</div>

<div style="width: 1200px; margin-left: 20px; font-size: 10px; max-height: 0px;">
  <q-btn color="secondary" flat label="Press to empty console screen" @click="resulttext = []" />
    <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 30%, #194f88 100%);">
      <ul><b>Console output</b></ul>
      <q-separator dark inset />
      <q-scroll-area style="height: 450px; max-width: 600px;">
      <q-card-section class="q-pt-none" v-for="item in resulttext" :key="item">
        <q-separator dark inset />
        {{ item }}
        <q-separator dark inset />
      </q-card-section>
    </q-scroll-area>
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
