<template>
  <!-- todo -->
  <v-btn color="error" variant="tonal" icon @click="open">
    <v-icon>mdi-folder-minus</v-icon>
  </v-btn>
  <v-dialog v-model="dialog" persistent max-width="450">
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
      <v-card-title>Изтрийте колекция</v-card-title>
      <v-card-text>
        <v-data-table
          :loading="loadingCollections"
          loading-text="Зареждат се ..."
          no-data-text="Няма създадени колекции."
          :headers="headers"
          :items="collections"
          item-value="id"
          v-model="selected"
          show-select
        >
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!isAtLeastOneSelected"
          @click="deleteSelected"
          color="error"
          >Изтрий</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  getAllCollectionsWithEntryCount,
  deleteCollections,
} from "../dbController.js";

export default {
  emits: ["refresh-collections", "go-home"],
  data() {
    return {
      collections: [],
      dialog: false,
      loadingCollections: false,
      alert: {
        show: false,
        type: "info",
        message: null,
      },
      headers: [
        {
          title: "Име",
          key: "name",
        },
        {
          title: "Брой документи",
          key: "itemCount",
        },
      ],
      selected: [],
      isAtLeastOneSelected: false,
    };
  },
  methods: {
    resetArrSelected() {
      this.selected = [];
    },
    async deleteSelected() {
      const collectionsToDelete = this.selected;
      const result = await deleteCollections(collectionsToDelete);
      if (!(result instanceof Error)) {
        this.emitParentGoHome();
        this.emitUpdateParent();
      } else {
        this.handleErr(result);
      }
    },
    handleErr(err) {
      this.alert = {
        show: true,
        type: "error",
        message: err.message,
      };
    },
    open() {
      this.dialog = true;
      this.getAllCollectionsWithEntryCount();
    },
    close() {
      this.dialog = false;
      this.resetArrSelected();
      this.resetAlert();
    },
    async getAllCollectionsWithEntryCount() {
      this.loadingCollections = true;
      const result = await getAllCollectionsWithEntryCount();
      if (!(result instanceof Error)) {
        this.collections = result;
      } else {
        this.showAlert("error", result.message);
      }
      this.loadingCollections = false;
    },
    emitParentGoHome() {
      this.$emit("go-home");
    },
    emitUpdateParent() {
      this.close();
      this.$emit("refresh-collections");
    },
    showAlert(type, message) {
      this.alert = {
        show: true,
        type: type,
        message: message,
      };
    },
    resetAlert() {
      this.alert = {
        show: false,
        type: "info",
        message: null,
      };
    },
  },
  watch: {
    selected() {
      const len = this.selected.length;
      // reset value
      this.isAtLeastOneSelected = false;

      if (len >= 1) {
        this.isAtLeastOneSelected = true;
      }
    },
  },
};
</script>
