<template>
  <div id="app" class="main-layout" >
    <main-header />
    <router-view />
    <main-footer />
  </div>
</template>

<script>
import mainHeader from "@/cmps/main-header.vue";
import mainFooter from "@/cmps/main-footer.vue";

export default {
  created() {
    this.$store.dispatch({ type: 'loadStations' });
    this.$store.dispatch({ type: 'loadTags' });
  },
  components: {
    mainHeader,
    mainFooter
  }
};
</script>

<style lang="scss"></style>
