<template>
  <div id="order-container">
    <h1>Orders</h1>
      <v-container id="form-controls">
        <v-btn @click="toggleForm()" color="#016FB9" variant="flat">
          <v-icon icon="mdi-plus"/>
          Create Order
        </v-btn>
        <v-dialog max-width="500" persistent v-model="showForm">
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-layout>
                <v-app-bar color="#016FB9">
                  <v-toolbar-title>{{ (this.isEditing) ? "Edit Order" : "New Order" }}</v-toolbar-title>
                </v-app-bar>
                <v-main>
                  <v-card-text>
                    <v-form>
                      <v-select
                          :items="customers"
                          item-title="name"
                          item-value="name"
                          label="Select Customer"
                          v-model="this.createOrderForm.customer"
                      />
                      <div id="arrival-time-controls">
                        <v-text-field label="Arrival Time" type="datetime-local" style="width: fit-content" v-model="createOrderForm.arrivalTime" class="mr-4"></v-text-field>
                        <v-text-field label="Departure Time" type="datetime-local" style="width: fit-content" v-model="createOrderForm.departureTime" :disabled="(this.createOrderForm.status !== 'Complete')"></v-text-field>
                      </div>
                      <v-select :items="choices" label="Safe to load?" v-model="createOrderForm.safeToLoad"></v-select>
                      <v-select :items="choices" label="Key held?" v-model="createOrderForm.hasKeys"></v-select>
                      <v-select :items="statusChoices" label="Status" v-model="createOrderForm.status"></v-select>
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
                          this.createOrder();
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
    <v-data-table :headers="headers" :items="allOrders" elevation="1">
      <template v-slot:item.arrivalTime="{ item }">
        {{ formatDate(item.arrivalTime) }}
      </template>
      <template v-slot:item.departureTime="{ item }">
        {{ formatDate(item.departureTime) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="showEditForm(item.id)" class="mr-4">
          <v-icon icon="mdi-pencil"/>
          Edit
        </v-btn>
        <v-btn @click="deleteOrder(item.id)">
          <v-icon icon="mdi-trash-can"/>
          Delete</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "OrdersView",
  data() {
    return {
      allOrders: [],
      customers: [],
      choices: [
        {
          title: 'Yes',
          value: true,
        },
        {
          title: 'No',
          value: false,
        },
      ],
      statusChoices: [
        'Not Arrived',
        'On Bay',
        'Complete'
      ],
      headers: [
        { title: 'ID', key: 'id', sortable: true, align: 'center' },
        { title: 'Customer', key: 'customer.name', sortable: true, align: 'center'  },
        { title: 'Arrival Time', key: 'arrivalTime', sortable: true, align: 'center'  },
        { title: 'Departure Time', key: 'departureTime', sortable: true, align: 'center'  },
        { title: 'Safe To Load', key: 'safeToLoad', sortable: true, align: 'center'  },
        { title: 'Keys Held', key: 'hasKeys', sortable: true, align: 'center'  },
        { title: 'Status', key: 'status', sortable: true, align: 'center'  },
        { title: 'On Time', key: 'onTime', sortable: true, align: 'center'  },
        { title: 'Actions', key: 'actions', align: 'center' },
      ],
      showForm: false,
      isEditing: false,
      editOrderId: null,
      createOrderForm: {
        customer: '',
        arrivalTime: '',
        departureTime: '',
        safeToLoad: false,
        hasKeys: false,
        status: '',
      },
    }
  },
  async mounted() {
    await this.fetchAllOrders();
    this.customers = await this.$apiService.customers.fetchAll();
  },
  methods: {
    async fetchAllOrders() {
      this.allOrders = await this.$apiService.orders.fetchAll();
    },
    async createOrder() {
      var form = new FormData();
      form.append('customer', this.createOrderForm.customer);
      form.append('arrivalTime', this.createOrderForm.arrivalTime);
      form.append('departureTime', this.createOrderForm.departureTime);
      form.append('safeToLoad', this.createOrderForm.hasKeys);
      form.append('status', this.createOrderForm.status);
      form.append('hasKeys', this.createOrderForm.hasKeys);

      if(this.isEditing) {
        await this.$apiService.orders.updateOrder(this.editOrderId, form);
      }
      else {
        await this.$apiService.orders.createOrder(form);
      }

      await this.fetchAllOrders();
    },
    async deleteOrder(id) {
      await this.$apiService.orders.deleteOrder(id);
      await this.fetchAllOrders();
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleString().replace(',', '');
    },
    toggleForm() {
      this.showForm = !this.showForm;
      if(!this.isEditing) {
        this.createOrderForm.customer = '';
        this.createOrderForm.arrivalTime = '';
        this.createOrderForm.departureTime = '';
        this.createOrderForm.safeToLoad = false
        this.createOrderForm.hasKeys = false;
        this.createOrderForm.status = '';
      }
      if(!this.showForm) {
        this.isEditing = false;
      }
    },
    showEditForm(id) {
      this.isEditing = true;
      this.editOrderId = id;

      let orderToEdit = this.allOrders.find(order => order.id === id);
      let customer = this.customers.find(customer => customer.id === orderToEdit.customer.id).name;
      this.createOrderForm.customer = customer;
      this.createOrderForm.arrivalTime = orderToEdit.arrivalTime;
      this.createOrderForm.departureTime = orderToEdit.departureTime;
      this.createOrderForm.safeToLoad = orderToEdit.safeToLoad;
      this.createOrderForm.hasKeys = orderToEdit.hasKeys;
      this.createOrderForm.status = orderToEdit.status;

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