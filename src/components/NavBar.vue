<template>
  <div id="navBar">
    <div id="logo-container">
      <img src="../assets/logo.png" class="logo">
    </div>
    <div id="link-container" class="mt-10">
      <RouterLink to="/" class="nav-link">
        <v-icon icon="mdi-home"/>
        Home
      </RouterLink>
      <RouterLink to="/orders" class="nav-link">
        <v-icon icon="mdi-timetable"/>
        Orders
      </RouterLink>
      <RouterLink to="/customers" class="nav-link">
        <v-icon icon="mdi-face-agent"/>
        Customers
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
#logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
}

.logo {
  width: 250px;
  height: 250px;
}

#navBar {
  background: #252525;
  padding: 0 20px;
}

#link-container {
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}

.nav-link {
  color: #FFFFFF;
  text-decoration: none;
  height: auto;
  font-size: 1.4rem;
}

.nav-link:hover {
  color: #bcbcbc;
  transition: 0.2s;
}
</style>
<script>
export default {
  name: 'NavBar',
  components: {
  }
}
</script>