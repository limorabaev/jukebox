<template>
  <article class="stations-page content-container">
    <station-list :stations="stations" v-if = "isStationLoaded"/>
  </article>
</template>

<script>
import stationList from "@/cmps/station-list.vue";
import stationService from "@/services/station.service.js";

export default {
  name: "stationPage",

  data(){
    return {
      isStationLoaded: false
    }
  },

  async created() {
    var query = this.$route.query;
    var filterBy = stationService.getEmptyFilter();
    for (var key in query){
      if (key === 'searchTerm') {
        filterBy.name = query[key]
        filterBy.createdBy = query[key]
      } else filterBy[key] = query[key]
    }
    await this.$store.dispatch({type: 'setFilterBy', filterBy});
    this.isStationLoaded = true;
  },

  destroyed() {
    var filterBy = stationService.getEmptyFilter();
    this.$store.dispatch({type: 'setFilterBy', filterBy})

  },

  computed: {
    stations() {
      return this.$store.getters.stations;
    }
  },
  components: {
    stationList
  }
};
</script>