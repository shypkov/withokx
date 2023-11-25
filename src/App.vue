<template>
<q-layout view="hhh LpR fff" class="bg-white">
  <!--  <q-header :class="!$q.dark.isActive ? 'bg-white text-dark' : null" class="main"></q-header></div>-->
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleleftMenu" />
          <q-avatar>
            <img src="./assets/monk.svg">
          </q-avatar>
          <span style="font-size: 10px; text-align: center; width: auto; color: khaki">© Cryptopitek</span>
      <Header/>
    </q-toolbar>
  </q-header>
  <q-drawer show-if-above v-model="leftMenu" side="left" bordered class="bg-grey-2">

      <!-- menu content -->
      <q-list>
        <q-item-label header>
          <div class="q-pa-md q-gutter-md" style="padding: 30px">
            <q-badge color="blue">version1.1.0</q-badge>
          </div>
        </q-item-label>
        <q-item clickable target="OKX" rel="noopener" href="/OKXview">
          <q-item-section avatar>
            <div style="font-size: 10px; text-align: center;"><img alt="okx logo" width="40" height="40" src="./assets/okx.png"></div>   
          </q-item-section>
          <span style="padding: 10px"><b>OKX Withdraw</b></span>
          </q-item>
          <q-item  :disabled="true" clickable target="MEXC" rel="noopener">
          <q-item-section avatar>
            <div style="font-size: 10px; text-align: center;"><img alt="mexc logo" width="40" height="40" src="./assets/mexc.png"></div>   
          </q-item-section>
          <span style="padding: 10px"><b>MEXC Withdraw</b></span>
          </q-item>
          <q-item  :disabled="true" clickable target="Binance" rel="noopener">
          <q-item-section avatar>
            <div style="font-size: 10px; text-align: center;"><img alt="mexc logo" width="40" height="40" src="./assets/bina.png"></div>   
          </q-item-section>
          <span style="padding: 10px"><b>Binance Withdraw</b></span>
          </q-item>
      </q-list>
   </q-drawer>

<q-page-container>
<span>
<ul><b>This is the multi-transfer from OKX exchange to wallets helper</b></ul>
</span>
  <router-view />
  <OKXview/>
</q-page-container>
</q-layout>
</template>

<script>
import Header from './components/Header.vue';
import OKXview from './components/OKXview.vue';
import { ref } from 'vue';
const leftMenu = ref(true);

export default {
  name: 'App',
  components: {
    OKXview,
    Header,
  },
  setup ()
  {
  return{
  leftMenu,
  toggleleftMenu () {leftMenu.value = !leftMenu.value}
  }
},
};
</script>

<style>
#app {
  font-family: Inter, ui-sans-serif,system-ui, Helvetica ,Arial, sans-serif,"Apple Color Emoji","Segoe UI Emoji", Symbol,"Noto Color Emoji";
  font-size: 13px;
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
