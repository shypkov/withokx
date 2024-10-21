<template>
<q-layout view="hhh LpR fff" class="bg-white">
  <!--  <q-header :class="!$q.dark.isActive ? 'bg-white text-dark' : null" class="main"></q-header></div>-->
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleleftMenu" />
          <q-avatar>
            <img src='@/assets/monk.svg'>
          </q-avatar>
          <span style="font-size: 10.5px; text-align: center; width: auto; color: khaki">© Cryptopitek</span>
      <Header />
    </q-toolbar>
  </q-header>
  <q-drawer show-if-above v-model="leftMenu" side="left" bordered class="bg-grey-2">

      <!-- menu content -->
      <q-list>
        <q-item-label header>
          <div class="q-pa-md q-gutter-md" style="padding: 30px; width: 300px">
            <q-badge color="blue">v. {{ version }}</q-badge>
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
            <div style="font-size: 10px; text-align: center;"><img alt="okx" width="40" height="40" src="@/assets/okx.png"></div>   
         </q-item-section>
          <span style="padding: 10px"><b>OKX Withdraw Assets</b></span>
        </q-item>
        <q-separator spaced />
        <q-item
         clickable
         disable
         v-ripple
         :active="link === 'Bitget'"
         @click="link = 'Bitget'"
         active-class="menu-link"
         to="/Bitget">
         <q-item-section avatar>
           <div style="font-size: 10px; text-align: center;"><img alt="bitget" width="40" height="40" src="@/assets/bitget.png"></div>
         </q-item-section>
          <span style="padding: 10px"><b>Bitget Withdraw Assets</b></span>
        </q-item>
        <q-separator spaced />
        <q-item
         clickable
         v-ripple
         :active="link === 'PointsChecker'"
         @click="link = 'PointsChecker'"
         active-class="menu-link"
         to="/Meteora">
         <q-item-section avatar>
           <div style="font-size: 10px; text-align: center;"><img alt="bitget" width="40" height="40" src="@/assets/meteora.png"></div>
         </q-item-section>
          <span style="padding: 10px"><b>Meteora PointsChecker</b></span>
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
<router-view />
</q-page-container>
</q-layout>
</template>

<script>
import Header from './components/Header.vue';
import { ref } from 'vue';
import packageInfo from '../package.json';
const leftMenu = ref(true);
const version = packageInfo.version;


export default {
  name: 'App',
  components: {
    Header,
  },
  setup ()
  {
  return{
  leftMenu,
  version,
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
