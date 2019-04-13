<template>
  <b-container fluid>
    <h1>Projects</h1>
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
      @row-clicked="projectInfoModal"
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
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          class="my-0"
        />
      </b-col>
      <b-col md="6" v-if="this.loggedInRole==='ADMINISTRATOR'">
        <b-button
          class="float-right"
          variant="success"
          @click="createProjectModalOpen"
          v-b-modal.createProjectModal>
            Create Project
        </b-button>
      </b-col>
    </b-row>

    <b-modal ref="createProjectModal" id="createProjectModal"
      title="Create Project" @hide="createProjectModalCancel" hide-footer hide-header-close>
      <b-form @submit="createProject">
        <b-form-input id="projectName" class="marg-bot" v-model="createProjectName"
          placeholder="Project Name" required />
        <b-form-input id="projectFte" class="marg-bot" type="number"
          v-model="createProjectFte" min="0" placeholder="Full Time Employee" required />
        <b-form-input id="projectStart" class="marg-bot" type="date"
          v-model="createProjectStart" placeholder="Project Start Date" required />
        <b-form-input id="projectEnd" class="marg-bot" type="date"
          v-model="createProjectEnd" placeholder="Project End Date" required />
        <b-form-select v-model="createProjectPmId"
         :options="pmOptions" class="marg-bot" required>
        </b-form-select>
        <b-row class="marg-top">
          <b-col>
            <b-button variant="success" class="float-right" type="submit">Create</b-button>
            <b-button @click="createProjectModalCancelBtn"
            class="float-right marg-right">Cancel</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>

  </b-container>
</template>

<script>
import axios from 'axios';

const restHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

const items = [];

export default {
  name: 'Projects',

  props: {
    loggedInRole: String,
  },

  beforeMount() {
    this.getProjects();
  },

  data() {
    return {
      // API
      ApiServer: process.env.VUE_APP_API_SERVER,
      ApiPort: process.env.VUE_APP_API_PORT,
      // Table data
      items,
      fields: [
        /*
        {
          key: 'id',
          label: 'ID',
          sortable: true,
        }, */
        {
          key: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          key: 'startDate',
          label: 'StartDate',
          sortable: true,
        },
        {
          key: 'endDate',
          label: 'EndDate',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'ftePercentage',
          label: 'FTE',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'projectManagerId',
          label: 'ProjectManagerID',
        },
        {
          key: 'projectManagerMail',
          label: 'Projectmanager E-Mail',
          sortable: true,
          sortDirection: 'desc',
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
      // Create Project data
      createProjectName: '',
      createProjectFte: null,
      createProjectStart: '',
      createProjectEnd: '',
      createProjectPmId: null,
      pmOptions: [
        { value: null, text: 'PM', disabled: true },
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
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    createProject(evt) {
      evt.preventDefault();

      const pmId = this.createProjectPmId.substr(0, this.createProjectPmId.indexOf('-'));
      const pmMail = this.createProjectPmId.substr(this.createProjectPmId.indexOf('-') + 1);

      console.log(pmId);
      console.log(pmMail);

      const data = {
        name: this.createProjectName,
        ftePercentage: this.createProjectFte,
        startDate: this.createProjectStart,
        endDate: this.createProjectEnd,
        projectManagerId: pmId,
      };

      console.log(data);

      axios.post(`${this.ApiServer}:${this.ApiPort}/api/project`, data, restHeader)
        .then((response) => {
          const newProject = {
            id: response.data.id,
            name: response.data.name,
            ftePercentage: response.data.ftePercentage,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            projectManagerId: response.data.projectManagerId,
            projectManagerMail: pmMail,
          };

          this.items.unshift(newProject);
          this.totalRows = this.items.length;

          this.createProjectModalCancelBtn();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    projectInfoModal(evt) {
      console.log(evt);
    },
    createProjectModalCancelBtn() {
      this.$refs.createProjectModal.hide();
    },
    createProjectModalCancel() {
      console.log('Close');
      this.createProjectName = '';
      this.createProjectFte = null;
      this.createProjectStart = '';
      this.createProjectStart = '';
      this.createProjectPmId = null;
    },
    createProjectModalOpen() {
      this.loadPMs();
    },
    loadPMs() {
      axios.get(`${this.ApiServer}:${this.ApiPort}/api/employee?role=PROJECTMANAGER`, restHeader)
        .then((response) => {
          console.log(response.data);
          const arr = [{ value: null, text: 'PM', disabled: true }];
          for (let i = 0; i < response.data.length; i += 1) {
            arr.push({ value: `${response.data[i].id}-${response.data[i].emailAddress}`, text: response.data[i].emailAddress });
          }

          console.log(arr);
          this.pmOptions = arr;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjects() {
      let PMs = [];
      let projects = [];

      axios.get(`${this.ApiServer}:${this.ApiPort}/api/project`, restHeader)
        .then((response) => {
          console.log(response.data);
          projects = response.data;
        })
        .then(() => {
          axios.get(`${this.ApiServer}:${this.ApiPort}/api/employee?role=PROJECTMANAGER`, restHeader)
            .then((response) => {
              console.log(response.data);
              PMs = response.data;
            })
            .then(() => {
              for (let i = 0; i < projects.length; i += 1) {
                projects[i].projectManagerMail = 'n.a.';
                for (let j = 0; j < PMs.length; j += 1) {
                  if (projects[i].projectManagerId === PMs[j].id) {
                    projects[i].projectManagerMail = PMs[j].emailAddress;
                    break;
                  }
                }
              }

              console.log(projects);
              this.items = projects;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
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
