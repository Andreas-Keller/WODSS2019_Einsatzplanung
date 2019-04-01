<template>
  <b-container v-if="this.loggedInRole !== 'DEVELOPER'" fluid>
    <h1>Allocations</h1>
  </b-container>
</template>

<script>
export default {
  name: 'Allocations',

  props: {
    loggedInRole: String,
  },
};
</script>

<style scoped>

</style>
