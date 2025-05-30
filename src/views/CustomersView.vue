<template>
  <div id="order-container">
    <h1>Customers</h1>
    <v-container id="form-controls">
      <v-btn @click="toggleForm()" color="#016FB9" variant="flat">
        <v-icon icon="mdi-plus"/>
        Create Customer
      </v-btn>
      <v-dialog max-width="500" persistent v-model="showForm">
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-layout>
              <v-app-bar color="#016FB9">
                <v-toolbar-title>{{ (this.isEditing) ? "Edit Customer" : "New Customer" }}</v-toolbar-title>
              </v-app-bar>
              <v-main>
                <v-card-text>
                  <v-form>
                    <v-text-field type="text" label="Name" v-model="createOrderForm.name"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="Cancel"
                      @click="() => {
                          this.toggleForm();
                          isActive.value = false;
                        }"
                      class="bg-red text-white"
                  ></v-btn>
                  <v-btn
                      @click="() => {
                          this.createCustomer();
                          isActive.value = false;
                        }"
                      class="bg-green text-white"
                  >
                    {{ (this.isEditing) ? "Update" : "Create" }}
                  </v-btn>
                </v-card-actions>
              </v-main>
            </v-layout>
          </v-card>
        </template>
      </v-dialog>
    </v-container>
    <v-data-table :headers="headers" :items="allCustomers" elevation="1">
      <template v-slot:item.actions="{ item }">
        <v-btn @click="showEditForm(item.customer.id)" class="mr-4">
          <v-icon icon="mdi-pencil"/>
          Edit
        </v-btn>
        <v-btn @click="deleteCustomer(item.customer.id)">
          <v-icon icon="mdi-trash-can"/>
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "CustomersView",
  data() {
    return {
      allCustomers: [],
      headers: [
        { title: 'ID', key: 'customer.id', sortable: true, align: 'center' },
        { title: 'Customer', key: 'customer.name', sortable: true, align: 'center'  },
        { title: 'Total Orders', key: 'totalOrders', sortable: true, align: 'center'  },
        { title: 'On Time', key: 'totalOnTime', sortable: true, align: 'center'  },
        { title: 'Late', key: 'totalLate', sortable: true, align: 'center'  },
        { title: 'Actions', key: 'actions', align: 'center' },
      ],
      showForm: false,
      isEditing: false,
      editCustomerId: null,
      createOrderForm: {
        name: '',
      },
    }
  },
  async mounted() {
    await this.fetchAllCustomers();
  },
  methods: {
    async fetchAllCustomers() {
      this.allCustomers = await this.$apiService.customers.fetchStats();
    },
    async createCustomer() {
      var form = new FormData();
      form.append('name', this.createOrderForm.name);

      if(this.isEditing) {
        await this.$apiService.customers.updateCustomer(this.editCustomerId, form);
      }
      else {
        await this.$apiService.customers.createCustomer(form);
      }

      await this.fetchAllCustomers();
    },
    async deleteCustomer(id) {
      await this.$apiService.customers.deleteCustomer(id);
      await this.fetchAllCustomers();
    },
    toggleForm() {
      this.showForm = !this.showForm;
      if(!this.isEditing) {
        this.createOrderForm.name = '';
      }
      if(!this.showForm) {
        this.isEditing = false;
      }
    },
    showEditForm(id) {
      this.isEditing = true;
      this.editCustomerId = id;

      let customerToEdit = this.allCustomers.find(c => c.customer.id === id).customer;
      console.log(customerToEdit);
      this.createOrderForm.name = customerToEdit.name;

      this.toggleForm();
    }
  }
}
</script>

<style scoped>
#form-controls {
  margin: 1rem 0;
  padding: 0 !important;
}

#arrival-time-controls {
  display: flex;
  flex-direction: row;
}
</style>