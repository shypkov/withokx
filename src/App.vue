<template>
<div style="font-size: 10px; text-align: center;">
<img alt="okx logo" width="80" height="80" src="./assets/okx.png">

<span>
<ul><b>This is the multi-transfer from OKX exchange to wallets helper</b></ul>
</span>
<div class="q-pa-sm q-gutter-sm">
    <q-badge color="blue">
      v1.0.3
    </q-badge>
</div>    
</div>
  <Appview/>
<div style="text-align: left; padding-top: 100px">
<span style="font-size: 9px; text-shadow: 1px 1px 1px black">© created by Cryptopitek</span>
</div>
</template>


<script>
import Appview from './components/Appview.vue'

export default {
  name: 'App',
  components: {
    Appview
  }
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
.okx{
  margin-left: 30px;
  text-align: center;
}
</style>
