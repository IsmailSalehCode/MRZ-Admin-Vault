<template>
  <v-container v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container v-if="loadingCollections">
    <v-progress-circular color="green" indeterminate></v-progress-circular>
  </v-container>
  <v-container v-if="collections.length > 0">
    <v-sheet elevation="4" rounded="lg" class="pa-2">
      <!-- <v-row style="text-align: start; max-width: fit-content">
        <v-col v-for="collection in collections" :key="collection.id">
          <v-chip prepend-icon="mdi-folder" size="large">{{
            collection.name
          }}</v-chip>
        </v-col>
      </v-row> -->
      <v-chip-group
        v-model="selectedCollection"
        column
        selected-class="text-info"
      >
        <v-btn @click="deselectSelected" icon variant="outlined" class="mr-2">
          <v-icon size="large">mdi-home</v-icon>
        </v-btn>
        <v-chip
          prepend-icon="mdi-folder"
          size="large"
          v-for="collection in collections"
          :key="collection.id"
          >{{ collection.name }}</v-chip
        >
      </v-chip-group>
    </v-sheet>
  </v-container>
</template>
<script>
import { getAllCollections } from "../dbController.js";
export default {
  data() {
    return {
      collections: [],
      loadingCollections: true,
      alert: {
        show: false,
        type: "",
        message: null,
      },
      selectedCollection: null,
    };
  },
  methods: {
    deselectSelected() {
      this.selectedCollection = null;
    },
    resetAlert() {
      this.alert = {
        show: false,
        type: "",
        message: null,
      };
    },
    handleErr(err) {
      this.alert = {
        show: true,
        type: "error",
        message: err.message,
      };
    },
    async getAllCollections() {
      this.loadingCollections = true;
      const result = await getAllCollections();
      if (!(result instanceof Error)) {
        this.collections = result;
      } else {
        this.handleErr(result);
      }
      this.loadingCollections = false;
    },
  },
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getAllCollections();
  },
};
</script>
<style lang=""></style>
