<template>
    <body>
        <div class="q-pa-md q-gutter-sm">
<!--      <q-btn label="FAQ: How to use" color="red" @click="howto = true" />
      <q-dialog v-model="howto">-->
      <q-card>
        <q-card-section>
          <div class="text-h8">FAQ: HOW TO USE OKX WITHDRAW</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>Disclaimer: This App doesn't store any secrets or other keys in cloud\external storages. Clearing the browser\page cache will drop all the stored secrets and other data from input fields</p>
          <p>- INFO: Withdraw funds conditions and tech usage are different through differen CEX's and you should get some knowledge about this difference before the start</p>
          <p>- INFO: This app layout is not adapted for mobile browsers, but still can be used on mobile browsers</p>
          <p>- INFO: Get "Min withdraw Fee" works only if ApiKey, SecretKey and Passphrase are set correctly</p>
          <p>- Action: Go to <a href='https://www.okx.com/ru/account/my-api'>OKX API management and Create API key</a>. Check the box next to the Enable Withdrawals. You shoud receive in result SecretKey and API key + passphrase for this keys and you need to fill the proper fields in app</p>
          <p>- Action: !WHITELIST all the adresses on exchange management page on which you wish to accept withdrawals. Notice that you need to whitelist adresses depending on networks</p>
          <p>- Action: Fill the fields above with values, optionally you can enable random time delay between transfers on addresses and just click Withdraw button... watch result in console log</p>
          <p>- WARNING: Please DO NOT RELOAD or CLOSE THIS Page when WITHDRAW is Running. If you do - the process will be terminated</p>
          <p>- WARNING: Notice that Form inputs are not validated. Be sure you enter a proper adress and values before withdraw</p>
          <p>- WARNING: Transer Section works only with FROM subaccount to Main, just remember your subacnt name</p>
          <p>- Debug: If you see CORS error in console then install browser extension to avoid CORS blocking <a href='https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf'>CORS EXT</a> and enable it.</p>
          <p>- Debug: if you see Network error message with "net::ERR_NAME_NOT_RESOLVED" then this means you couldnot reach the okx.com check your connection</p>
          <p>- ADVICE: if you still have issues with the app or need a neccessary function, contact the dev: <a href='https://t.me/cryptopitek'>cryptopitek</a></p>
        </q-card-section>
        <q-card-actions align="right">
<!--          <q-btn flat label="I got it" color="red" v-close-popup />-->
        </q-card-actions>
      </q-card>
<!--    </q-dialog>-->
  </div>
    </body>
</template>