<template>
<b-container v-if="this.loggedInRole !== 'DEVELOPER'" fluid>
  <h1>Allocations</h1>
  <!-- Allocation Interface controls -->
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
    id="allocationTable"
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
    @row-clicked="allocationInfoModal"
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
        aria-controls="allocationTable"
      />
    </b-col>
    <b-col md="6" v-if="this.loggedInRole==='ADMINISTRATOR'">
      <b-button
        class="float-right"
        variant="success"
        v-b-modal.createAllocationModal>
        Create Allocation
      </b-button>
    </b-col>
  </b-row>

  <!-- Info modal -->
  <b-modal ref="infoAllocationModal" id="infoAllocationModal" title="Info Allocation"
           size="lg" @hide="infoAllocationCancel"
           hide-footer hide-header-close>
    <b-form @submit="updateAllocation">
      <b-form-group v-if="this.loggedInRole === 'ADMINISTRATOR'"
                    label-cols="4" label-cols-lg="2" label="ID"
                    label-for="selectedId">
        <b-form-input id="selectedId"
                      v-model="selectedAllocationId"
                      disabled required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Start Date"
                    label-for="selectedStartDate">
        <b-form-input id="selectedStartDate"
                      v-model="selectedAllocationStartDate"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="End Date"
                    label-for="selectedEndDate">
        <b-form-input id="selectedEndDate"
                      v-model="selectedAllocationEndDate"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Contract Id"
                    label-for="selectedContractId">
        <b-form-input id="selectedContractId"
                      v-model="selectedAllocationContractId"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Project Id"
                    label-for="selectedAllocationRole">
        <b-form-input v-model="selectedAllocationProjectId"
                       class="marg-bot" required></b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Pensum %"
                    label-for="selectedAllocationPensumPercentage">
        <b-form-input v-model="selectedAllocationPensumPercentage"
                      class="marg-bot" required></b-form-input>
      </b-form-group>
      <b-row>
        <b-col>
          <b-button v-if="this.loggedInRole === 'ADMINISTRATOR'"
                    @click="infoAllocationDelete" variant="danger">Delete Allocation</b-button>
        </b-col>
        <b-col>
          <b-button v-if="this.loggedInRole === 'ADMINISTRATOR'"
                    variant="warning" class="float-right marg-left"
                    type="submit">Update</b-button>
          <b-button @click="infoAllocationCancel" class="float-right">Cancel</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>

  <!-- Create Allocation Modal -->
  <b-modal ref="createAllocation" id="createAllocationModal"
           title="Create Allocation" @hide="createAllocationModalCancel" hide-footer
           hide-header-close>
    <b-form @submit="createAllocation">
      <b-form-input v-model="createAllocationStartDate" id="startDate" class="marg-bot"
                    type="date" placeholder="Start Date" required/>
      <b-form-input v-model="createAllocationEndDate" id="endDate" class="marg-bot"
                    type="date" placeholder="End Date" required/>
      <b-form-input v-model="createAllocationContractId" id="contractId" class="marg-bot"
                    placeholder="Contract Id" required/>
      <b-form-input v-model="createAllocationProjectId" id="projectId" class="marg-bot"
                    placeholder="Project Id" required/>
      <b-form-input v-model="createAllocationPensumPercentage" id="pensum" class="marg-bot"
                    placeholder="Pensum %" required/>
      <b-row class="marg-top">
        <b-col>
          <b-button variant="success" class="float-right" type="submit">Create</b-button>
          <b-button @click="createAllocationModalCancel"
                    class="float-right marg-right">Cancel</b-button>
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
  name: 'Allocations',

  props: {
    loggedInRole: String,
  },

  beforeMount() {
    this.getAllocation();
  },

  data() {
    return {
      // API
      ApiServer: process.env.VUE_APP_API_SERVER,
      ApiPort: process.env.VUE_APP_API_PORT,
      // Table data
      items,
      fields: [
        {
          key: 'id',
          label: 'Allocation Id',
        },
        {
          key: 'contractId',
          label: 'Contract Id',
          sortable: true,
        },
        {
          key: 'projectId',
          label: 'Project Id',
          sortable: true,
        },
        {
          key: 'startDate',
          label: 'Start Date',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'endDate',
          label: 'End Date',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'pensumPercentage',
          label: 'Pensum %',
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
      // Create allocation data
      createAllocationStartDate: '',
      createAllocationEndDate: '',
      createAllocationContractId: null,
      createAllocationProjectId: null,
      createAllocationPensumPercentage: null,
      // Info allocation data
      selectedAllocationId: null,
      selectedAllocationStartDate: '',
      selectedAllocationEndDate: '',
      selectedAllocationContractId: null,
      selectedAllocationProjectId: null,
      selectedAllocationPensumPercentage: null,
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
    getAllocation() {
      if (this.loggedInRole === 'ADMINISTRATOR') {
        axios.get(`${this.ApiServer}:${this.ApiPort}/api/allocation`, restHeader)
          .then((response) => {
            this.items = response.data;
            this.totalRows = this.items.length;
          });
      } else if (this.loggedInRole === 'PROJECTMANAGER') {
        axios.get(`${this.ApiServer}:${this.ApiPort}/api/allocation?role=DEVELOPER`, restHeader)
          .then((response) => {
            this.items = response.data;
            this.totalRows = this.items.length;
          });
      }
    },
    createAllocation(evt) {
      evt.preventDefault();

      const data = {
        startDate: this.createAllocationStartDate,
        endDate: this.createAllocationEndDate,
        contractId: this.createAllocationContractId,
        projectId: this.createAllocationProjectId,
        pensumPercentage: this.createAllocationPensumPercentage,
      };

      axios.post(`${this.ApiServer}:${this.ApiPort}/api/allocation`, data, restHeader)
        .then((response) => {
          const newAllocation = {
            id: response.data.id,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            contractId: response.data.contractId,
            projectId: response.data.projectId,
            pensumPercentage: response.data.pensumPercentage,
          };

          this.items.push(newAllocation);
          this.totalRows = this.items.length;

          this.createAllocationModalCancel();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createAllocationModalCancel() {
      this.createAllocationStartDate = '';
      this.createAllocationEndDate = '';
      this.createAllocationContractId = null;
      this.createAllocationProjectId = null;
      this.createAllocationPensumPercentage = null;
      this.$refs.createAllocation.hide();
    },
    allocationInfoModal(evt) {
      this.selectedAllocationId = evt.id;
      this.selectedAllocationStartDate = evt.startDate;
      this.selectedAllocationEndDate = evt.endDate;
      this.selectedAllocationContractId = evt.contractId;
      this.selectedAllocationProjectId = evt.projectId;
      this.selectedAllocationPensumPercentage = evt.pensumPercentage;

      this.$refs.infoAllocationModal.show();
    },
    // todo
    updateAllocation(evt) {
      evt.preventDefault();

      const data = {
        active: this.selectedAllocationActive,
        startDate: this.selectedAllocationStartDate,
        endDate: this.selectedAllocationEndDate,
        emailAddress: this.selectedAllocationContractId,
      };

      axios.put(`${this.ApiServer}:${this.ApiPort}/api/allocation/${this.selectedAllocationId}`, data, restHeader)
      // eslint-disable-next-line
        .then((response) => {
          for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].id === this.selectedAllocationId) {
              this.items[i].startDate = this.selectedAllocationStartDate;
              this.items[i].endDate = this.selectedAllocationEndDate;
              this.items[i].emailAddress = this.selectedAllocationContractId;
              this.items[i].active = this.selectedAllocationActive;
              this.items[i].role = this.selectedAllocationRole;
            }
          }

          this.infoAllocationCancel();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    infoAllocationDelete() {
      axios.delete(`${this.ApiServer}:${this.ApiPort}/api/allocation/${this.selectedAllocationId}`, restHeader)
      // eslint-disable-next-line
        .then((response) => {
          for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].id === this.selectedAllocationId) {
              this.items.splice(i, 1);
            }
          }

          this.totalRows = this.items.length;
          this.infoAllocationCancel();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    infoAllocationCancel() {
      this.selectedAllocationId = null;
      this.selectedAllocationStartDate = '';
      this.selectedAllocationEndDate = '';
      this.selectedAllocationContractId = null;
      this.selectedAllocationRole = null;

      this.$refs.infoAllocationModal.hide();
    },
  },
};
</script>

<style scoped>
.marg-bot {
  margin-bottom: 5px;
}

.marg-right {
  margin-right: 5px;
}

.marg-left {
  margin-left: 5px;
}

.marg-top {
  margin-top: 5px;
}
</style>
