<template>
  <div>
    <Navbar />
    <Employees />
    <Projects />
    <Contracts />
    <Allocations />
  </div>
</template>


<script>

import Navbar from '@/components/Navbar.vue';
import Employees from '@/components/Employees.vue';
import Projects from '@/components/Projects.vue';
import Contracts from '@/components/Contracts.vue';
import Allocations from '@/components/Allocations.vue';

export default {
  name: 'dashboard',
  components: {
    Navbar,
    Employees,
    Projects,
    Contracts,
    Allocations,
  },
};
</script>

<style scoped>

</style>
