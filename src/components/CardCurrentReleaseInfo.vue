<template>
  <v-card
    class="mx-auto"
    max-width="550"
    rounded="lg"
    :elevation="mainCardElevation"
  >
    <v-card-title class="toggleableTitle" @click="toggleInfo">
      <v-icon>mdi-information</v-icon>&nbsp;Относно Вашия <b>M.A.V.</b>
    </v-card-title>
    <v-expand-transition>
      <div v-show="expandInfo">
        <hr />
        <v-card-text>
          <ul v-for="el in appInfo" :key="el.label">
            <li>
              <b>{{ el.label }}</b
              >: {{ el.content }}
            </li>
          </ul>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>
import {
  version,
  description,
  repository,
  organization,
} from "../../package.json";

export default {
  data() {
    return {
      appVersion: version,
      appDescription: description,
      appRepo: repository,
      appOrg: organization,
      expandInfo: false,
    };
  },
  methods: {
    toggleInfo() {
      this.expandInfo = !this.expandInfo;
    },
  },
  computed: {
    appInfo() {
      const res = [
        {
          label: "Версия",
          content: this.appVersion,
        },
        {
          label: "Организация",
          content: this.appOrg,
        },
        {
          label: "Хранилище",
          content: this.appRepo,
        },
        {
          label: "Описание",
          content: this.appDescription,
        },
      ];
      return res;
    },
    mainCardElevation() {
      const isExpanded = this.expandInfo;
      if (isExpanded) {
        return 8;
      }
      return 2;
    },
  },
};
</script>
<style scoped>
.toggleableTitle {
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.4s;
}
.toggleableTitle:hover {
  background-color: rgb(218, 217, 217);
}
</style>
