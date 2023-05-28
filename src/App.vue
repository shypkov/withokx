<template>
<div style="font-size: 10px; text-align: center;">
<img alt="okx logo" width="80" height="80" src="./assets/okx.png">

<span>
<ul><b>This is the multi-transfer from OKX exchange to wallets helper</b></ul>
</span>
</div>
  <Appview/>
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
