<template>
  <ul v-if="stations" class="station-list">
    <station-preview v-for="station in stations" :key="station._id" 
      :station="station" @remove="$emit('remove', $event)" />
  </ul>
</template>

<script>
import stationPreview from "@/cmps/station-preview.vue";

export default {
  props: {
    stations: Array
  },
  components: {
    stationPreview
  }
};
</script>