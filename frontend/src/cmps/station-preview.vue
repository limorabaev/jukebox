<template>
<router-link :to="'/station/'+station._id">
  <li v-if="station" class="station-preview ratio-square">
    <img v-if="station.imgUrl" :src="station.imgUrl" />
    <div class = "content flex direction-column space-between">
      <div class ="card-head">
        <h3 class = "station-name">{{station.name}}</h3>
        <p class = "station-creator">by {{station.createdBy.fullName}}</p>
      </div>
     
      
      <i class="far fa-play-circle play preview-details"></i>
      <div>
        <small><i class="fas fa-heart"></i> {{likesCount}}</small>
        <small><i class="far fa-clock"></i> {{songsCount}} tracks</small>
      </div>
    </div>
    <!-- <router-link :to="'/station/edit/'+station._id">Edit</router-link>
    <button @click="$emit('remove', station)">Delete</button> -->
  </li>
</router-link>
</template>

<script>
export default {
  props: {
    station: Object
  },
  computed:{
    likesCount(){
      return this.station.likedBy.length
    },
    songsCount(){
      return this.station.songs.length
    }
  }
};
</script>