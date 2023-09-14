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
import { getAllCollections } from "../dbController.js";

export default {
  emits: ["refresh-collections"],
  data() {
    return this.initialState();
  },
  methods: {
    initialState() {
      return {
        collections: [],
        dialog: false,
        loadingCollections: false,
        alert: {
          show: false,
          type: "info",
          message: null,
        },
      };
    },
    open() {
      this.dialog = true;
    },
    close() {
      Object.assign(this.$data, this.initialState());
    },
    async getAllCollections() {
      this.loadingCollections = true;
      const result = await getAllCollections();
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
  },
};
</script>
