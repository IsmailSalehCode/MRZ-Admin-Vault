<template>
  <v-card class="mx-auto" max-width="550" rounded="lg">
    <v-card-title
      :class="expandInfo ? 'cardTitle toggled' : 'cardTitle untoggled'"
      @click="toggleInfo"
    >
      <v-icon>mdi-information</v-icon>&nbsp;Относно текущия <b>M.A.V.</b>
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
  },
};
</script>
<style scoped>
ul {
  list-style-type: square;
}
.cardTitle {
  text-wrap: wrap;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.4s;
  --focused-title-color: rgb(231, 231, 231);
}
.toggled {
  background-color: var(--focused-title-color);
}
.untoggled {
  background-color: unset;
}
.untoggled:hover {
  background-color: var(--focused-title-color);
}
</style>
