<template>
  <div>
    <Navbar />
    <div>
      <p>Projects</p>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'projects',
  components: {
    Navbar,
  },
  methods: {
    checkToken() {
      if (localStorage.getItem('token') === null) {
        // this.$router.push({ name: 'login' });
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
