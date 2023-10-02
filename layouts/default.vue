<template>
  <v-app dark>
    <!-- Left Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
      style="height: 100% !important;"
      color="deep-purple accent-4"
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

    <!-- App Bar (Header) -->
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="deep-purple accent-4"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      :absolute="!fixed"
      app
      color="deep-purple accent-4"
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
      right: true,
      rightDrawer: false,
      title: "CRITICAL"
    };
  }
};
</script>

<style scoped>
/* Add any additional styles or overrides here */
</style>
