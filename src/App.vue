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
            <q-badge color="blue">version1.2.2</q-badge>
          </div>
        </q-item-label>
        <q-item
         clickable
         v-ripple
         :active="link === 'OKXview'"
         @click="link = 'OKXview'"
         active-class="menu-link"
         to="/OKXview">
         <q-item-section avatar>
            <div style="font-size: 10px; text-align: center;"><img alt="okx" width="40" height="40" src="./assets/okx.png"></div>   
         </q-item-section>
          <span style="padding: 10px"><b>OKX Withdraw</b></span>
        </q-item>
        <q-separator spaced />
        <q-item
         clickable
         v-ripple
         :active="link === 'Bitgetview'"
         @click="link = 'Bitgetview'"
         active-class="menu-link"
         to="/Bitgetview">
         <q-item-section avatar>
           <div style="font-size: 10px; text-align: center;"><img alt="bybit" width="40" height="40" src="./assets/bitget.png"></div>
         </q-item-section>
          <span style="padding: 10px"><b>Bitget Withdraw</b></span>
        </q-item>
      </q-list>
   </q-drawer>

<q-page-container>
<span>
<ul>
<b>

</b>
</ul>
</span>
<OKXview/>
<template id="OKXview">
  <OKXview/>
</template>
<template id="Bybitview">
  <Bybitview/>
</template>
</q-page-container>
</q-layout>
</template>

<script>
import Header from './components/Header.vue';
import OKXview from './components/OKXview.vue';
import Bybitview from './components/Bitget.vue';
import { ref } from 'vue';
//import router from 'vue-router';
const leftMenu = ref(true);

//const okxview = {  name: "okxview ",  template: "#okxview"};
//const bybitview = {  name: "bybitview",  template: "#bybitview"};
//  const routes = [
//  { path: "/OKXview", component: okxview},
//{ path: "/Bybitview", component: bybitview}];
//const router = new VueRouter({  routes}); 

export default {
  name: 'App',
  components: {
    Header,
    OKXview,
    Bybitview,
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

.menu-link
{
  background: #F2C037;
}
</style>
