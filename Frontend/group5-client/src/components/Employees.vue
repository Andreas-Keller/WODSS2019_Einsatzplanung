<template>
  <b-container v-if="this.loggedInRole !== 'DEVELOPER'" fluid>
    <h1>Employees</h1>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- none --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option> <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort direction" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortDirection" slot="append">
              <option value="asc">Asc</option> <option value="desc">Desc</option>
              <option value="last">Last</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      id="employeeTable"
      show-empty
      bordered
      hover
      striped
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
      @row-clicked="userInfoModal"
    >
    <!--
      <template slot="name" slot-scope="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template slot="isActive" slot-scope="row">
        {{ row.value ? 'Yes' : 'No' }}
      </template>

      <template slot="actions" slot-scope="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template slot="row-details" slot-scope="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
      -->
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
          aria-controls="employeeTable"
        />
      </b-col>
      <b-col md="6" v-if="this.loggedInRole==='ADMINISTRATOR'">
        <b-button
          class="float-right"
          variant="success"
          v-b-modal.createUserModal>
            Create User
        </b-button>
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal ref="infoUserModal" id="infoUserModal" title="Info User" hide-footer hide-header-close>
      <label>User</label>
    </b-modal>

    <!-- Create User Modal -->
    <b-modal ref="createUser" id="createUserModal"
      title="Create User" @hide="createUserModalCancel" hide-footer hide-header-close>
      <b-form @submit="createUser">
        <b-form-input v-model="createUserFirstName" id="firstName" class="marg-bot"
          placeholder="First name" required/>
        <b-form-input v-model="createUserLastName" id="lastName" class="marg-bot"
          placeholder="Last name" required/>
        <b-form-input v-model="createUserEmail" id="eMail" class="marg-bot"
          type="email" placeholder="e@mail.com" required/>
        <b-form-input v-model="createUserPw" id="password" class="marg-bot"
          type="password" placeholder="Password" required/>
        <b-form-select v-model="createUserRole" :options="roleOptions"
          class="marg-bot" required></b-form-select>
        <b-row>
          <b-col>
            <b-button @click="createUserModalCancel" >Cancel</b-button>
          </b-col>
          <b-col>
            <b-button variant="primary" class="float-right" type="submit">Submit</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </b-container>
</template>


<script>
import axios from 'axios';

const items = [];

const restHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };


export default {
  name: 'Employees',

  props: {
    loggedInRole: String,
  },

  beforeMount() {
    this.getUser();
  },

  data() {
    return {
      // Table data
      items,
      fields: [
        /*
        {
          key: '_id',
          label: 'ID',
        }, */
        {
          key: 'firstName',
          label: 'First Name',
          sortable: true,
        },
        {
          key: 'lastName',
          label: 'Last Name',
          sortable: true,
        },
        {
          key: 'emailAddress',
          label: 'Email',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'active',
          label: 'Is Active',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'role',
          label: 'Role',
        },
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      // Create user data
      createUserFirstName: '',
      createUserLastName: '',
      createUserEmail: '',
      createUserPw: '',
      createUserRole: null,
      roleOptions: [
        { value: null, text: 'Role', disabled: true },
        { value: 'ADMINISTRATOR', text: 'Administrator' },
        { value: 'PROJECTMANAGER', text: 'Projectmanager' },
        { value: 'DEVELOPER', text: 'Developer' },
      ],
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }));
    },
  },
  methods: {
    info(item, index, button) {
      this.modalInfo.title = `Row index: ${index}`;
      this.modalInfo.content = JSON.stringify(item, null, 2);
      this.$root.$emit('bv::show::modal', 'modalInfo', button);
    },
    resetModal() {
      this.modalInfo.title = '';
      this.modalInfo.content = '';
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getUser() {
      if (this.loggedInRole === 'ADMINISTRATOR') {
        axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/employee`, restHeader)
          .then((response) => {
            console.log(response.data);
            this.items = response.data;
            this.totalRows = this.items.length;
          });
      } else if (this.loggedInRole === 'PROJECTMANAGER') {
        console.log('only dev');
        axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/employee?role=DEVELOPER`, restHeader)
          .then((response) => {
            console.log(response.data);
            this.items = response.data;
            this.totalRows = this.items.length;
          });
      }
    },
    createUser(evt) {
      evt.preventDefault();

      const data = {
        active: true,
        firstName: this.createUserFirstName,
        lastName: this.createUserLastName,
        emailAddress: this.createUserEmail,
      };

      axios.post(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/employee?password=${this.createUserPw}&role=${this.createUserRole}`, data, restHeader)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);

          const newUser = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            emailAddress: response.data.emailAddress,
            active: true,
            role: response.data.role,
          };

          this.items.push(newUser);

          this.createUserModalCancel();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createUserModalCancel() {
      this.createUserFirstName = '';
      this.createUserLastName = '';
      this.createUserEmail = '';
      this.createUserPw = '';
      this.createUserRole = null;
      this.$refs.createUser.hide();
    },
    // eslint-disable-next-line
    userInfoModal(evt) {
      this.$refs.infoUserModal.show();
    },
  },
};
</script>

<style scoped>
.marg-bot {
  margin-bottom: 5px;
}
</style>
