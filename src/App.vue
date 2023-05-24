<template>
<div class="okx">
<img alt="okx logo" width="80" height="80" src="./assets/okx.png">
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
  margin-top: 60px;
}
.okx{
  margin-left: 20%;
  text-align: left;
}
</style>
