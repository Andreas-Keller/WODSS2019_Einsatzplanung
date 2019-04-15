<template>
  <div>
    <Navbar :employeeName="this.loggedInEmployeeName" />
    <Employees :loggedInRole="loggedInRole" />
    <Projects  :loggedInRole="loggedInRole" />
    <Contracts :loggedInRole="loggedInRole" />
    <Allocations :loggedInRole="loggedInRole" />
  </div>
</template>


<script>

import Navbar from '@/components/Navbar.vue';
import Employees from '@/components/Employees.vue';
import Projects from '@/components/Projects.vue';
import Contracts from '@/components/Contracts.vue';
import Allocations from '@/components/Allocations.vue';

const jwtDecode = require('jwt-decode');

export default {
  name: 'dashboard',
  data() {
    return {
      loggedInEmployee: '',
      loggedInEmployeeName: '',
      loggedInRole: '',
    };
  },
  components: {
    Navbar,
    Employees,
    Projects,
    Contracts,
    Allocations,
  },
  methods: {
    checkToken() {
      if (localStorage.getItem('token') === null) {
        this.$router.push({ name: 'login' });
      } else {
        try {
          const decoded = jwtDecode(localStorage.getItem('token'));
          this.loggedInEmployee = decoded;
          this.loggedInEmployeeName = `${this.loggedInEmployee.firstName} ${this.loggedInEmployee.lastName}`;
          this.loggedInRole = this.loggedInEmployee.role;
          console.log(`${this.loggedInRole}`);
        } catch (error) {
          // COMMENTED OUT FOR DEV PURPOSE
          console.log(error);
          localStorage.removeItem('token');
          this.$router.push({ name: 'login' });
        }
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
