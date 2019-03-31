<template>
  <div>
    <Navbar :employeeName="logedInEmployeeName" />
    <div>
      <p>Projects</p>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

const jwtDecode = require('jwt-decode');

export default {
  name: 'projects',
  components: {
    Navbar,
  },
  data() {
    return {
      loggedInEmployee: '',
      loggedInEmployeeName: '',
    };
  },
  methods: {
    checkToken() {
      if (localStorage.getItem('token') === null) {
        this.$router.push({ name: 'login' });
      } else {
        try {
          const decoded = jwtDecode(localStorage.getItem('token'));
          console.log();
          this.logedInEmployee = decoded.employee;
          this.logedInEmployeeName = `${this.loggedInEmployee.firstName} ${this.loggedInEmployee.lastName}`;
        } catch (error) {
          // COMMENTED OUT FOR DEV PURPOSE
          // localStorage.removeItem('token');
          // this.$router.push({ name: 'login' });
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
