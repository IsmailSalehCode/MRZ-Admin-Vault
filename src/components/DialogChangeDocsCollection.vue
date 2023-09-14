<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="red"> ╳ </v-btn>
      </v-toolbar>
      <v-expand-transition>
        <div v-show="alert.show">
          <v-alert rounded="0" :type="alert.type">{{ alert.message }}</v-alert>
        </div>
      </v-expand-transition>
      <v-card-title style="white-space: normal"
        >Смяна на директория за ...</v-card-title
      >
      <v-card-text>{{ docLabels }}</v-card-text>
      <v-card-text>
        <SelectorCollection v-model="selectedCollection" />
      </v-card-text>
      <v-card-actions>
        <v-btn :loading="loadingUpdate" color="success" @click="submit"
          >Ок</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SelectorCollection from "./SelectorCollection.vue";

import { updateEntriesCollection } from "../dbController.js";

export default {
  components: { SelectorCollection },
  emits: ["displayUpdatedData"],
  props: {
    docs: Array,
  },
  computed: {
    docLabels() {
      const arr = this.docs;
      return arr.join(", ");
    },
  },
  data() {
    return this.initialState();
  },
  methods: {
    initialState() {
      return {
        selectedCollection: null,
        loadingUpdate: false,
        dialog: false,
        alert: {
          show: false,
          type: "info",
          message: null,
        },
      };
    },
    async submit() {
      this.loadingUpdate = true;
      const result = await updateEntriesCollection(
        this.docs,
        this.selectedCollection
      );
      if (result instanceof Error) {
        this.showAlert("error", result.message);
        this.loadingUpdate = false;
        return;
      }
      this.emitUpdateParent();
      this.loadingUpdate = false;
    },
    open() {
      if (this.docs) {
        this.dialog = true;
      }
    },
    close() {
      Object.assign(this.$data, this.initialState());
    },
    emitUpdateParent() {
      this.close();
      this.$emit("displayUpdatedData");
    },
    showAlert(type, message) {
      this.alert = {
        show: true,
        type: type,
        message: message,
      };
    },
  },
};
</script>
