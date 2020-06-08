<template>
  <header class="main-header flex direction-column">
    <div class="nav-container flex space-between">
      <router-link to="/" exact>
        <h1 class="logo">JUKEBOX</h1>
      </router-link>
      <form class="search" @submit.prevent="submitSearch">
        <input type="text" class="searchTerm" placeholder="Search" v-model="searchStr" />
        <button type="submit" class="searchButton">
          <i class="fa fa-search"></i>
        </button>
      </form>
      <nav class="flex align-center" @click="closeMenu">
        <router-link to="/" exact>Home</router-link>
        <router-link to="/station">Stations</router-link>
        <router-link to="/about">About</router-link>
        <loggedin-user />
      </nav>
      <div class="screen" @click="toggleMenu"></div>
      <button class="menu-btn" @click="toggleMenu">☰</button>
    </div>
    <div class="hero flex direction-column align-center" :class="heroSize">
      <h2>Make and Discover Playlists</h2>
      <router-link class="buttons create-station-btn" to="/station/edit">Create A New Station</router-link>
    </div>
  </header>
</template>

<script>
import loggedinUser from "@/cmps/loggedin-user.vue";

export default {
  name: "mainHeader",
  data() {
    return {
      isHomePage: false,
      searchStr: ""
    };
  },
  created() {
    this.isHomePage = this.$route.name == "homePage" ? true : false;
  },
  computed: {
    heroSize() {
      return this.isHomePage ? "full" : "small";
    }
  },

  methods: {
    toggleMenu() {
      document.body.classList.toggle("menu-open");
    },

    closeMenu() {
      document.body.classList.remove("menu-open");
    },

    submitSearch() {
      this.$router.push({
        path: "/station",
        query: { searchTerm: this.searchStr }
      });
      this.searchStr = "";
    }
  },

  watch: {
    $route(to, from) {
      this.isHomePage = to.name === "homePage" ? true : false;
    }
  },
  components: {
    loggedinUser
  }
};
</script>