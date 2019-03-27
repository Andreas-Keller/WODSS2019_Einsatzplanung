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
      logedInEmployee: '',
      logedInEmployeeName: '',
    };
  },
  methods: {
    checkToken() {
      if (localStorage.getItem('token') === null) {
        // this.$router.push({ name: 'login' });
      } else {
        const decoded = jwtDecode(localStorage.getItem('token'));
        this.logedInEmployee = decoded.employee;
        this.logedInEmployeeName = `${this.logedInEmployee.firstName} ${this.logedInEmployee.lastName}`;
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
