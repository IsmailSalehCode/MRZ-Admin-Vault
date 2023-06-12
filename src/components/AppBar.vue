<template>
  <v-app-bar density="compact" class="bg-black">
    <v-toolbar-title>
      <v-btn
        class="appTitleBadge"
        elevation="0"
        color="white"
        rounded
        variant="outlined"
      >
        MRZ Админ
        <v-icon right class="ml-2"> mdi-card-account-details-outline </v-icon>
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        color="white"
        text
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
      >
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
    <span class="hidden-md-and-up">
      <v-app-bar-nav-icon dark right @click="drawer = !drawer">
      </v-app-bar-nav-icon>
    </span>
  </v-app-bar>
  <v-navigation-drawer
    app
    v-model="drawer"
    class="bg-grey-darken-4 text-white"
    location="right"
    temporary
  >
    <v-list nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        link
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        { title: "Прочети карта", path: "/" },
        { title: "Запаметени карти", path: "/saved" },
      ],
    };
  },
};
</script>
<style>
.appTitleBadge {
  pointer-events: none;
}
</style>
