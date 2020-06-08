import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/fonts/fontawesome/css/all.css';
import './styles/global.scss';
import VueYoutube from 'vue-youtube';

Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
