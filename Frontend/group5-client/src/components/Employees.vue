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
      show-empty
      bordered=true
      hover=true
      striped=true
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
    >
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
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          class="my-0"
        />
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
      <pre>{{ modalInfo.content }}</pre>
    </b-modal>
  </b-container>
</template>


<script>

import axios from 'axios';

const items = [{
  _id: 123,
  firstName: 'Dickerson',
  lastName: 'Macdonald',
  emailAddress: 'dm@foo.com',
  active: true,
  role: 'MANAGER',
}];
//
//
// [
//  {
//    isActive: true, role: 'MANAGER', first_name: 'Dickerson',
//    last_name: 'Macdonald', email: 'dm@foo.com',
//  },
//  {
//    isActive: false, role: 'DEVELOPER', first_name: 'Larsen',
//    last_name: 'Shaw', email: 'ls@foo.com',
//  },
//  {
//    isActive: false, role: 'MANAGER', first_name: 'Geneva',
//    last_name: 'Wilson', email: 'gw@foo.com',
//  },
//  {
//    isActive: true, role: 'DEVELOPER', first_name: 'Jami',
//    last_name: 'Carney', email: 'cj@foo.com',
//  },
// ];


export default {
  name: 'Employees',

  props: {
    loggedInRole: String,
  },

  beforeMount() {
    if (this.loggedInRole === 'ADMINISTRATOR') {
      axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/employee`)
        .then((response) => {
          this.items = response.data;
        });
    } else if (this.loggedInRole === 'PROJECTMANAGER') {
      axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/employee?role=DEVELOPER`)
        .then((response) => {
          this.items = response.data;
        });
    }
  },

  data() {
    return {
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
      totalRows: items.length,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: {
        title: '',
        content: '',
      },
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
  },
};
</script>

<style scoped>

</style>
