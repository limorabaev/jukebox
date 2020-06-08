<template>
  <article class="user-profile">
    <h2>{{this.loggedinUser.fullName}}</h2>
    <section class="imgs-sec">
      <img class="ratio-square profile-img-record-cover" :src="loggedinUser.imgUrl" />
      <img
        v-bind:style="{ backgroundImage: 'url(' + loggedinUser.imgUrl + ')' }"
        class="record-img"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/vinyl.png"
      />
    </section>
    <!-- <p>Email: {{this.loggedinUser.email}}</p> -->
    <h3>My stations:</h3>
    <ul v-if="loggedinUser.stations" class="user-stations">
      <li
        class="user-station-in-list"
        v-for="station in this.loggedinUser.stations"
        :key="station._id"
      >
        <router-link :to="'/station/'+station._id">
          <p>{{station.name }}</p>
          <img class="ratio-square" :src="station.imgUrl" />
        </router-link>
      </li>
    </ul>
    <!-- <h3>{{this.loggedinUser}}</h3> -->
  </article>
</template>

<script>
export default {
  name: "userProfile",
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  }
};
</script>
