<template>
<b-container fluid>
  <b-alert v-model="showFailCreateAllocationAlertFTE" variant="danger" class="alert-center"
           fade dismissible>
    Project already fully occupied - Decrease pensum or reduce timerange
  </b-alert>
  <b-alert v-model="showFailCreateAllocationAlertDATE" variant="danger" class="alert-center"
           fade dismissible>
    New allocation not compatible with contract - decrease pensum or change timerange
  </b-alert>
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
                    label-for="selectedId2">
        <b-form-input id="selectedId2"
                      v-model="selectedAllocationId"
                      disabled required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Start Date"
                    label-for="selectedStartDate2">
        <b-form-input id="selectedStartDate2"
                      v-model="selectedAllocationStartDate"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="End Date"
                    label-for="selectedEndDate2">
        <b-form-input id="selectedEndDate2"
                      v-model="selectedAllocationEndDate"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Contract Id"
                    label-for="selectedContractId2">
        <b-form-input id="selectedContractId2"
                      v-model="selectedAllocationContractId"
                      v-bind:disabled="this.loggedInRole !== 'ADMINISTRATOR'" required>
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Project Id"
                    label-for="selectedAllocationRole">
        <b-form-input id="selectedAllocationRole" v-model="selectedAllocationProjectId"
                       class="marg-bot" required></b-form-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="2" label="Pensum %"
                    label-for="selectedAllocationPensumPercentage">
        <b-form-input id="selectedAllocationPensumPercentage"
                      v-model="selectedAllocationPensumPercentage"
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
      <b-form-input v-model="createAllocationStartDate" id="startDate2" class="marg-bot"
                    type="date" placeholder="Start Date" required/>
      <b-form-input v-model="createAllocationEndDate" id="endDate2" class="marg-bot"
                    type="date" placeholder="End Date" required/>
      <b-form-select v-model="createAllocationContractId" :options="contractIdOptions"
                     class="marg-bot" id="contractId12" required>
      </b-form-select>
      <b-form-select v-model="createAllocationProjectId" id="projectId2" class="marg-bot"
                     :options="projectIdOptions" placeholder="Project Id" required>
      </b-form-select>
      <b-form-input v-model="createAllocationPensumPercentage" id="pensum2" class="marg-bot"
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
          key: 'projectName',
          label: 'Project Name',
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
      contractIdOptions: this.getListIds('contract'),
      projectIdOptions: this.getListIds('project'),
      showFailCreateAllocationAlertFTE: false,
      showFailCreateAllocationAlertDATE: false,
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
      let allocations = [];
      let projects = [];
      if (this.loggedInRole === 'ADMINISTRATOR') {
        axios.get(`${this.ApiServer}:${this.ApiPort}/api/allocation`, restHeader)
          .then((response) => {
            allocations = response.data;
            // this.totalRows = this.items.length;
          })
          .then(() => {
            axios.get(`${this.ApiServer}:${this.ApiPort}/api/project`, restHeader)
              .then((response) => {
                projects = response.data;
              })
              .then(() => {
                for (let i = 0; i < allocations.length; i += 1) {
                  allocations[i].projectEmail = 'n.a.';
                  for (let j = 0; j < projects.length; j += 1) {
                    if (allocations[i].projectId === projects[j].id) {
                      allocations[i].projectName = projects[j].name;
                      break;
                    }
                  }
                }
                this.items = allocations;
                this.totalRows = this.items.length;
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      /* else if (this.loggedInRole === 'PROJECTMANAGER') {
        axios.get(`${this.ApiServer}:${this.ApiPort}/api/allocation?role=DEVELOPER`, restHeader)
          .then((response) => {
            this.items = response.data;
            this.totalRows = this.items.length;
          });
      } */
    },
    createAllocation(evt) {
      evt.preventDefault();
      this.showFailCreateAllocationAlertFTE = false;
      this.showFailCreateAllocationAlertDATE = false;
      Promise.resolve(this.calculateIfAllocationWithinContract())
      // eslint-disable-next-line
        .then(obj => this.showFailCreateAllocationAlertDATE = obj.allocationOk)
        .then(() => {
          Promise.resolve(this.calculateRemainingFTEofProject())
            .then((FTES) => {
              if (FTES.FTE <= FTES.occupiedFTE) {
                this.showFailCreateAllocationAlertFTE = true;
              }
            });
        })
        .then(() => {
          if (!this.showFailCreateAllocationAlertFTE && !this.showFailCreateAllocationAlertDATE) {
            const data = {
              startDate: this.createAllocationStartDate,
              endDate: this.createAllocationEndDate,
              contractId: this.createAllocationContractId,
              projectId: this.createAllocationProjectId,
              pensumPercentage: this.createAllocationPensumPercentage,
            };
            const newAllocation = {};

            Promise.resolve(this.getNameOfNewProject(this.createAllocationProjectId))
            // eslint-disable-next-line
              .then((obj) => newAllocation.projectName = obj.name)
            axios.post(`${this.ApiServer}:${this.ApiPort}/api/allocation`, data, restHeader)
              .then((response) => {
                newAllocation.id = response.data.id;
                newAllocation.startDate = response.data.startDate;
                newAllocation.endDate = response.data.endDate;
                newAllocation.contractId = response.data.contractId;
                newAllocation.projectId = response.data.projectId;
                newAllocation.pensumPercentage = response.data.pensumPercentage;
                return newAllocation;
              })
              .then((alloc) => {
                this.items.push(alloc);
                this.totalRows = this.items.length;

                this.createAllocationModalCancel();
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.createAllocationModalCancel();
          }
        });
    },
    createAllocationModalCancel() {
      this.createAllocationStartDate = '';
      this.createAllocationEndDate = '';
      this.createAllocationContractId = null;
      this.createAllocationProjectId = null;
      this.createAllocationPensumPercentage = null;
      // this.showFailCreateAllocationAlertDATE = false;
      // this.showFailCreateAllocationAlertFTE = false;
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
    updateAllocation(evt) {
      evt.preventDefault();

      const data = {
        startDate: this.selectedAllocationStartDate,
        endDate: this.selectedAllocationEndDate,
        contractId: this.selectedAllocationContractId,
        projectId: this.selectedAllocationProjectId,
        pensumPercentage: this.selectedAllocationPensumPercentage,
      };

      axios.put(`${this.ApiServer}:${this.ApiPort}/api/allocation/${this.selectedAllocationId}`, data, restHeader)
      // eslint-disable-next-line
        .then((response) => {
          for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].id === this.selectedAllocationId) {
              this.items[i].startDate = this.selectedAllocationStartDate;
              this.items[i].endDate = this.selectedAllocationEndDate;
              this.items[i].contractId = this.selectedAllocationContractId;
              this.items[i].projectId = this.selectedAllocationProjectId;
              this.items[i].pensumPercentage = this.selectedAllocationPensumPercentage;
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
      // this.selectedAllocationRole = null;

      this.$refs.infoAllocationModal.hide();
    },
    getListIds(url) {
      // eslint-disable-next-line
      let listIds = [{ value: null, text: `${url} Ids`, disabled: true }];
      axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/${url}`, restHeader)
        .then(response => response.data)
        .then((data) => {
          data.forEach((entry) => {
            listIds
              .push(
                {
                  disabled: false,
                  text: String(entry.id),
                  value: Number(entry.id),
                },
              );
          });
        })
        .catch((error) => {
          console.log(error);
        });
      return listIds;
    },
    calculateRemainingFTEofProject() {
      let FTE = 0;
      let alreadyOcuppiedFTE = 0;
      const oneDay = 1000 * 60 * 60 * 24;
      // get the project's FTE
      return axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/project/${this.createAllocationProjectId}`, restHeader)
        .then(response => response.data)
        .then((data) => {
          FTE = data.ftePercentage;
        })
        // collect already occupied FTE's in allocations
        .then(() => axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/allocation`, restHeader))
        .then(response => response.data)
        .then((data) => {
          data.forEach((entry) => {
            if (entry.projectId === this.createAllocationProjectId) {
              const pensum = entry.pensumPercentage;
              const duration = Math.round(
                (new Date(entry.endDate).getTime()
              - new Date(entry.startDate).getTime()) / oneDay,
              );
              alreadyOcuppiedFTE += pensum * duration;
            }
          });
        })
        // eslint-disable-next-line
        .then(() => { return { FTE: FTE, occupiedFTE: alreadyOcuppiedFTE }; })
        .catch((error) => {
          console.log(error);
        });
    },
    calculateIfAllocationWithinContract() {
      return axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/contract/${this.createAllocationContractId}`, restHeader)
        .then(response => response.data)
        .then((contract) => {
          let ok = false;
          if (contract.pensumPercentage < this.createAllocationPensumPercentage
          || contract.startDate > this.createAllocationStartDate
          || contract.endDate < this.createAllocationEndDate) {
            ok = true;
          }
          return { allocationOk: ok };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getNameOfNewProject(projectId) {
      return axios.get(`${this.ApiServer}:${this.ApiPort}/api/project/${projectId}`, restHeader)
        .then(response => response.data);
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
