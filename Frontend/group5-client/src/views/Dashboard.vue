<template>
  <div>
    <Navbar :employeeName="this.loggedInEmployeeName" class="marg-bot-nav" />
    <Employees :loggedInRole="loggedInRole" />
    <div class="marg-line">
      <b-tabs>
      </b-tabs>
    </div>
    <Projects  :loggedInRole="loggedInRole" :loggedInId="loggedInId" />
    <div class="marg-line">
      <b-tabs>
      </b-tabs>
    </div>
    <Contracts :loggedInRole="loggedInRole" />
    <div class="marg-line">
      <b-tabs>
      </b-tabs>
    </div>
    <Allocations :loggedInRole="loggedInRole"/>
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
      loggedInId: '',
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
          this.loggedInId = String(this.loggedInEmployee.id);
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
.marg-bot-nav {
  margin-bottom: 10px;
}

.marg-line {
  margin-bottom: 25px;
  margin-top: 25px;
}
</style>
