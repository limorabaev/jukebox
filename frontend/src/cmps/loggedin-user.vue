<template>
  <section v-if="loggedinUser" class="loggedin-user">
    <img :src="loggedinUser.imgUrl" />
    <div class="user-options">
      <p>Hello {{loggedinUser.fullName}}</p>
      <template v-if="isGuestUser">
        <router-link class="link-to-in-options" to="/login">
          <p>Login</p>
        </router-link>
        <router-link class="link-to-in-options" to="/signup">
          <p>Sign up</p>
        </router-link>
      </template>
      <template v-else>
        <router-link class="link-to-in-options" :to="'/user/' + loggedinUser._id">
          <p>Profile Page</p>
        </router-link>
        <button class="buttons" @click="logout">Logout</button>
      </template>
    </div>
  </section>
</template>

<script>
export default {
  name: "loggedinUser",
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isGuestUser() {
      return this.$store.getters.isGuestUser;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch({ type: "logout" });
    }
  }
};
</script>