<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 500px">
    <q-input standout="bg-teal text-white" stack-label v-model="adress1" label="Adress1"/>
    <q-input standout="bg-teal text-white" stack-label v-model="adress2" label="Adress2"/>    
    <q-input standout="bg-teal text-white" stack-label v-model="adress3" label="Adress3"/> 
    <li>
  <div class="q-pa-md q-gutter-sm">
  <q-btn color="primary" label="Transfer" @click="runtransfer" />
  </div>
  <div class="q-pa-md q-gutter-sm">
      <q-badge color="green" rounded class="q-mr-sm" />Withdraw successfull
  </div>
 <h3>   Configuration params</h3>
    <p>
      API URL OKX <a href="https://www.okx.com/api/v5/asset/withdrawal" target="apiUrl" rel="noopener">https://www.okx.com/api/v5/asset/withdrawal</a>
    <ul> ONLY arbETH can be withdrawed </ul>
    </p>
</li>
</div>
<div class="q-gutter-md" style="max-width: 300px">
<q-input outlined v-model="apikey" label="Apikey" />
<q-input outlined v-model="secretkey" label="Secretkey" />
<q-input outlined v-model="passphrase" label="Passphrase" />
<q-input outlined v-model="minWithdrawal" placeholder="0.001" label="minWithdrawal" />
<q-input outlined v-model="maxWithdrawal" placeholder="0.015" label="maxWithdrawal" />
<q-input outlined v-model="fee" placeholder="0.001" label="fee" />
</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup () {
  /* eslint-disable */ 
  const $q = useQuasar()
  return {
      adress1: ref(''),
      adress2: ref(''),
      adress3: ref(''),
      apikey: ref(''),
      secretkey: ref(''),
      passphrase: ref('')
    }
  }
}
</script>







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
