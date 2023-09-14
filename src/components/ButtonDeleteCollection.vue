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
        >
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <!-- <v-form ref="form" @submit="addCollection" @submit.prevent>
        <v-card-text>
          <v-text-field
            prepend-icon="mdi-folder"
            label="Име"
            v-model.trim="name"
            :rules="collectionRules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loadingSubmit" type="submit" color="success"
            >ОК</v-btn
          >
        </v-card-actions>
      </v-form> -->
    </v-card>
  </v-dialog>
</template>
<script>
import { getAllCollectionsWithEntryCount } from "../dbController.js";

export default {
  emits: ["refresh-collections"],
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
    };
  },
  methods: {
    open() {
      this.dialog = true;
      this.getAllCollections();
    },
    close() {
      this.dialog = false;
      this.resetAlert();
    },
    async getAllCollections() {
      this.loadingCollections = true;
      const result = await getAllCollectionsWithEntryCount();
      if (!(result instanceof Error)) {
        this.collections = result;
      } else {
        this.showAlert("error", result.message);
      }
      this.loadingCollections = false;
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
};
</script>
