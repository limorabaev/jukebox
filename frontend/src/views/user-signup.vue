<template>
  <section class="user-signup">
    <h2>User Sign Up</h2>
    <form class="signup-form" @submit.prevent="signup">
      <input type="text" placeholder="Username" v-model="credentials.fullName" required />
      <input type="email" placeholder="Email Address" v-model="credentials.email" required />
      <input type="password" placeholder="Password" v-model="credentials.password" required />
      <button class="buttons">Create Account</button>
    </form>
    <p>
      Already a member?
      <router-link to="/login">Go to login page</router-link>
    </p>
  </section>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        fullName: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async signup() {
      await this.$store.dispatch({
        type: "signup",
        userCred: this.credentials
      });
      this.$router.push("/");
    }
  }
};
</script>