<template>
  <b-container v-if="this.loggedInRole === 'ADMINISTRATOR'" fluid>
    <h1>Contracts</h1>
  </b-container>
</template>

<script>
export default {
  name: 'Contracts',

  props: {
    loggedInRole: String,
  },
};
</script>

<style scoped>

</style>
