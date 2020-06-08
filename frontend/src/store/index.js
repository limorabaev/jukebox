import Vue from 'vue'
import Vuex from 'vuex'
import stationStore from '@/store/station.store.js'
import userStore from '@/store/user.store.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    stationStore,
    userStore
  }
})
