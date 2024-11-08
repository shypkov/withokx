<script>
/* eslint-disable */ 
import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const wallet1 = useLocalStorage('kar1', '');
const wallet2 = useLocalStorage('kar2', '');
const wallet3 = useLocalStorage('kar3', '');
const wallet4 = useLocalStorage('kar4', '');
const wallet5 = useLocalStorage('kar5', '');
const wallet6 = useLocalStorage('kar6', '');
const wallet7 = useLocalStorage('kar7', '');
const wallet8 = useLocalStorage('kar8', '');
const wallet9 = useLocalStorage('kar9', '');
const wallet10 = useLocalStorage('kar10', '');
const wallet11 = useLocalStorage('kar11', '');
const wallet12 = useLocalStorage('kar12', '');
const wallet13 = useLocalStorage('kar13', '');
const wallet14 = useLocalStorage('kar14', '');
const wallet15 = useLocalStorage('kar15', '');
const wallet16 = useLocalStorage('kar16', '');
const wallet17 = useLocalStorage('kar17', '');
const wallet18 = useLocalStorage('kar18', '');
const wallet19 = useLocalStorage('kar19', '');
const wallet20 = useLocalStorage('kar20', '');
const wallet21 = useLocalStorage('kar21', '');
const wallet22 = useLocalStorage('kar22', '');
const wallet23 = useLocalStorage('kar23', '');
const wallet24 = useLocalStorage('kar24', '');
const resulttext = ref([]);
const resulttextsec = ref([]);
let result = ref();
const kinUrl = ref('https://lcscsi0shg.execute-api.ap-southeast-1.amazonaws.com/referral/summary2?address=');
const apiUrl = ref('https://restaking-backend.karak.network/getPortfolio?batch=1&input=%7B%220%22%3A%7B%22wallet%22%3A%22');
const wallets = [wallet1.value, wallet2.value, wallet3.value, wallet4.value, wallet5.value, wallet6.value, wallet7.value, wallet8.value, wallet9.value, wallet10.value, wallet11.value, wallet12.value, wallet13.value, wallet14.value, wallet15.value, wallet16.value, wallet17.value, wallet18.value, wallet19.value, wallet20.value, wallet21.value, wallet22.value, wallet23.value, wallet24.value];

async function GetKarak() {
  try {
    for (const wallet of wallets) {
      if (wallet) {
        const response = await axios.get(`${apiUrl.value}${wallet}%22%7D%7D`);
//        console.log(response.data);
        const pointsphase1 = response.data[0].result.data.xpByPhase.phase1;
        const pointsphase2 = response.data[0].result.data.xpByPhase.phase2;
        const pointsphase3 = response.data[0].result.data.xpByPhase.phase3;
        const parsedResponse = `'Karak points' ${new Date().toString()} - 'Wallet Address' ${wallet} 'Phase1:' ${pointsphase1} 'Phase2:' ${pointsphase2} 'Phase3:' ${pointsphase3}`;
        resulttext.value = [...resulttext.value, parsedResponse];
      }
    }
  } catch (error) {
    const parsedError = `${new Date().toString()}, ${error.message}`;
    resulttext.value = [...resulttext.value, parsedError];
  }
};

async function GetKinza() {
  try {
    for (const wallet of wallets) {
      if (wallet) {
        const response = await axios.get(`${kinUrl.value}${wallet}`);
//        console.log(response.data);
        const totalPoints = response.data.totalPoints;
        const totalRank = response.data.pointsRanking;
        const TVLrank = response.data.TVLRanking;
        const parsedResponse = `'Kinza points' ${new Date().toString()} - 'Wallet Address' ${wallet} 'TotalPoints:' ${totalPoints} 'TotalRank:' ${totalRank} 'TVLRank:' ${TVLrank}`;
        resulttextsec.value = [...resulttextsec.value, parsedResponse];
      }
    }
  } catch (error) {
    const parsedError = `${new Date().toString()}, ${error.message}`;
    resulttextsec.value = [...resulttextsec.value, parsedError];
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
      wallet16,
      wallet17,
      wallet18,
      wallet19,
      wallet20,
      wallet21,
      wallet22,
      wallet23,
      wallet24,
      wallets,
      resulttext,
      resulttextsec,
      result,
      apiUrl,
      GetKarak,
      GetKinza
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
      <q-input standout="bg-teal text-white" stack-label v-model="wallet6" label="Address6"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet7" label="Address7"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet8" label="Address8"/>
    </div>
  <!--    <q-btn fab icon="add" color="grey" />-->
      </div>
      <div class="col-sm" style="max-width: 400px;">
      <div class="q-gutter-md q-pa-md" style="width: 400px; font-size: 11px; padding: 15px;">
  <!--    <ul><b>Points checker by addresses</b></ul>-->
      <q-input standout="bg-teal text-white" stack-label v-model="wallet9" label="Address9"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet10" label="Address10"/>    
      <q-input standout="bg-teal text-white" stack-label v-model="wallet11" label="Address11"/> 
      <q-input standout="bg-teal text-white" stack-label v-model="wallet12" label="Address12"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet13" label="Address13"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet14" label="Address14"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet15" label="Address15"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet16" label="Address16"/>
      </div>
  <!--    <q-btn fab icon="add" color="grey" />-->
      </div>  
      <div class="col-sm" style="max-width: 400px;">
      <div class="q-gutter-md q-pa-md" style="max-width: 400px; font-size: 11px; padding: 15px;">
  <!--    <ul><b>Satlayer Points checker</b></ul>-->
      <q-input standout="bg-teal text-white" stack-label v-model="wallet17" label="Address17"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet18" label="Address18"/>    
      <q-input standout="bg-teal text-white" stack-label v-model="wallet19" label="Address19"/> 
      <q-input standout="bg-teal text-white" stack-label v-model="wallet20" label="Address20"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet21" label="Address21"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet22" label="Address22"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet23" label="Address23"/>
      <q-input standout="bg-teal text-white" stack-label v-model="wallet24" label="Address24"/>
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
    <q-btn color="secondary" label="Get Karak Points for adresses" @click="GetKarak()"/>
    </div>
    <div style="margin-left: 540px;">
      <q-btn color="info" label="Get Kinza Points for adresses" @click="GetKinza()"/>
    </div>
  </div>
  </q-card>
  </div>
  
  <div style="width: 1200px; margin-left: 20px; font-size: 10px; max-height: 0px;">
  <q-btn color="secondary" flat label="Press to empty console screen" @click="resulttext = []" />
    <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 30%, #194f88 100%);">
      <ul><b>Console output</b></ul>
      <q-separator dark inset />
      <div class="row">
    <div class="col-sm">
    <q-scroll-area style="height: 400px; max-width: 550px;">
     <q-card-section class="q-pt-none" v-for="item in resulttext" :key="item">
        <q-separator dark inset />
        {{ item }}
        <q-separator dark inset />
      </q-card-section>
    </q-scroll-area>
    </div>
    <div class="col-sm">
    <q-scroll-area style="height: 400px; max-width: 550px;">
      <q-card-section class="q-pt-none" v-for="item in resulttextsec" :key="item">
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
