<template>
  <p>Projects</p>
</template>

<script>
export default {
  name: 'projects',
  methods: {
    checkToken() {
      if (localStorage.getItem('token') === null) {
        this.$router.push({ name: 'login' });
      }
    },
  },
  beforeMount() {
    this.checkToken();
  },
};
</script>

<style scoped>

</style>
