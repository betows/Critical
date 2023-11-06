<template>
  <v-app dark>
    <!-- App Bar (Header) -->
    <v-app-bar
      clipped-left
      fixed
      app
      class="transparent-app-bar-header"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <img
        alt="CRITICAL"
        src="@/assets/images/logo.png"
        width="65px"
        @click="$router.push('/')"
        style="cursor: pointer; margin-left 12px;"
      >
      <v-spacer />
    </v-app-bar>
    <!-- Left Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      app
      style="height: 100% !important;"
      class="transparent-app-bar"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          @click="drawer = !drawer"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main class="main-wrap">
      <v-container style="margin-bottom: 24px;">
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      :absolute="!fixed"
      app
      class="transparent-app-bar"
    >
      <span>&copy; {{ new Date().getFullYear() }} - CRITICAL</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-sword",
          title: "Itens",
          to: "/items"
        },
        {
          icon: "mdi-book-open-page-variant",
          title: "Magias",
          to: "/spells"
        },
        {
          icon: "mdi-emoticon-devil-outline",
          title: "Monstros",
          to: "/monsters"
        },
        {
          icon: "mdi-account-group-outline",
          title: "Classes",
          to: "/classes"
        },
        {
          icon: "mdi-account-outline",
          title: "Criar Personagem",
          to: "/create-character"
        }
        // Add more categories as needed
      ],
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: "CRITICAL"
    };
  }
};
</script>

<style scoped>
.transparent-app-bar {
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
  .main-wrap {
    padding: 20px 0 !important;
  }

  .transparent-app-bar-header {
    background-color: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    position: relative !important;
    max-height: 64px !important;
    }
</style>
