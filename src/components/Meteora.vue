<script>
/* eslint-disable */ 
import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const wallet1 = useLocalStorage('wallet1', '');
const wallet2 = useLocalStorage('wallet2', '');
const wallet3 = useLocalStorage('wallet3', '');
const wallet4 = useLocalStorage('wallet4', '');
const wallet5 = useLocalStorage('wallet5', '');
const wallet6 = useLocalStorage('wallet6', '');
const wallet7 = useLocalStorage('wallet7', '');
const wallet8 = useLocalStorage('wallet8', '');
const wallet9 = useLocalStorage('wallet9', '');
const wallet10 = useLocalStorage('wallet10', '');
const wallet11 = useLocalStorage('wallet11', '');
const wallet12 = useLocalStorage('wallet12', '');
const wallet13 = useLocalStorage('wallet13', '');
const wallet14 = useLocalStorage('wallet14', '');
const wallet15 = useLocalStorage('wallet15', '');
const resulttext = ref([]);
let result = ref();
const apiUrl = ref('https://point-api.meteora.ag/points/');
const wallets = [wallet1.value, wallet2.value, wallet3.value, wallet4.value, wallet5.value, wallet6.value, wallet7.value, wallet8.value, wallet9.value, wallet10.value, wallet11.value, wallet12.value, wallet13.value, wallet14.value, wallet15.value];

async function GetMeteora() {
  try {
    for (const wallet of wallets) {
      if (wallet) {
        const response = await axios.get(`${apiUrl.value}${wallet}`);
        console.log(response.data);
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
      wallet1,
      wallet2,
      wallet3,
      wallet4,
      wallet5,
      wallet6,
      wallet7,
      wallet8,
      wallet9,
      wallet10,
      wallet11,
      wallet12,
      wallet13,
      wallet14,
      wallet15,
      wallets,
      resulttext,
      result,
      apiUrl,
      GetMeteora
    } 
}
}
</script>

<template>
<div style="width: 1200px; margin-left: 20px; font-size: 11px; max-height: auto;">
</div>

<div class="container">
<div class="row" style="width: 1200px; margin-left: 20px;">
  <q-card>
  <div class="row" style="width: 1200px; padding: 15px">
    <div class="col-sm" style="width: 400px; ">
    <div class="q-gutter-md q-pa-md" style="font-size: 11px;">
<!--    <ul><b>Points checker</b></ul>-->
    <q-input standout="bg-teal text-white" stack-label v-model="wallet1" label="Address1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet2" label="Address2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="wallet3" label="Address3"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="wallet4" label="Address4"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet5" label="Address5"/>
    </div>
<!--    <q-btn fab icon="add" color="grey" />-->
    </div>
    <div class="col-sm" style="max-width: 400px;">
    <div class="q-gutter-md q-pa-md" style="width: 400px; font-size: 11px; padding: 15px;">
<!--    <ul><b>Points checker by addresses</b></ul>-->
    <q-input standout="bg-teal text-white" stack-label v-model="wallet6" label="Address6"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet7" label="Address7"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="wallet8" label="Address8"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="wallet9" label="Address9"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet10" label="Address10"/>
    </div>
<!--    <q-btn fab icon="add" color="grey" />-->
    </div>  
    <div class="col-sm" style="max-width: 400px;">
    <div class="q-gutter-md q-pa-md" style="max-width: 400px; font-size: 11px; padding: 15px;">
<!--    <ul><b>Satlayer Points checker</b></ul>-->
    <q-input standout="bg-teal text-white" stack-label v-model="wallet11" label="Address11"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet12" label="Address12"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="wallet13" label="Address13"/> 
    <q-input standout="bg-teal text-white" stack-label v-model="wallet14" label="Address14"/>
    <q-input standout="bg-teal text-white" stack-label v-model="wallet15" label="Address15"/>
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
