<template>
  <section class="user-login">
    <h2>User Login</h2>
    <form class="login-form" @submit.prevent="login">
      <input
        class="input"
        type="email"
        placeholder="Email Address"
        v-model="credentials.email"
        required
      />
      <input
        class="input"
        type="password"
        placeholder="Password"
        v-model="credentials.password"
        required
      />
      <button class="buttons">Login</button>
    </form>
    <p>
      New around?
      <router-link to="/signup">Create an account</router-link>
    </p>
  </section>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      await this.$store.dispatch({ type: "login", userCred: this.credentials });
      this.$router.push("/");
    }
  }
};
</script>