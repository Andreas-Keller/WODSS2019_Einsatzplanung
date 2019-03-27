<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand tag="h1" class="mb-0">Job Scheduler</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text>{{employeeName}}</b-nav-text>
      <b-nav-item to="/login">Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    employeeName: String,
  },
};
</script>

<style scoped>
</style>
