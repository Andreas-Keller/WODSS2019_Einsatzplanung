<template>
  <div>
    <b-alert v-model="showFailLoginAlert" variant="danger" class="alert-center"
     fade dismissible>
      Login failed. Please try again.
    </b-alert>
    <b-form class="form-signin">
      <h1 class="h3 mb-3">Please sign in</h1>
      <b-form-input id="inputName" class="form-control marg-bot"
      placeholder="User name" required autofocus />
      <b-form-input type="password" id="inputPass" class="form-control marg-bot"
      placeholder="Password" required />
      <b-button @click="sendLogin" block variant="primary" size="lg"
       class="marg-bot">Sign in</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      showFailLoginAlert: false,
    };
  },
  methods: {
    sendLogin() {
      axios.get('http://127.0.0.1/test')
        .then((response) => {
          console.log(response.status);
        })
        .catch((error) => {
          console.log(error);
          this.showFailLoginAlert = true;
        });
    },
  },
};
</script>

<style scoped>
body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  text-align: center !important;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  padding-top: 20%
}

.form-signin .form-control {
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.marg-bot {
  margin-bottom: 10px;
}

.alert-center {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: 330px;
  margin-top: 20px;
}
</style>
