<template>
  <v-container v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container v-if="loadingCollections">
    <v-progress-circular color="green" indeterminate></v-progress-circular>
  </v-container>
  <v-container v-if="collections.length > 0">
    <v-sheet rounded="lg" class="pa-2" style="border-bottom: black solid 2px">
      <v-row style="text-align: start; max-width: fit-content">
        <v-col>
          <v-btn @click="deselectSelected" icon variant="outlined">
            <v-icon size="large">mdi-home</v-icon>
          </v-btn>
        </v-col>
        <v-col
          v-for="collection in collections"
          :key="collection.id"
          style="align-self: center"
        >
          <v-chip
            @click="selectCollection(collection.id)"
            :prepend-icon="determineIcon(collection.id)"
            size="large"
            >{{ collection.name }}</v-chip
          >
        </v-col>
        <v-col>
          <ButtonCreateCollection @refresh-collections="getAllCollections" />
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
<script>
import { getAllCollections } from "../dbController.js";
import ButtonCreateCollection from "./ButtonCreateCollection.vue";

export default {
  components: { ButtonCreateCollection },
  props: {
    modelValue: Number,
  },
  emits: ["update:modelValue"],
  watch: {
    selectedCollection() {
      this.$emit("update:modelValue", this.selectedCollection);
    },
  },
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
    determineIcon(id) {
      const iterId = id;
      const selectedId = this.selectedCollection;
      if (iterId == selectedId) {
        return "mdi-folder-open";
      }
      return "mdi-folder";
    },
    selectCollection(id) {
      this.selectedCollection = id;
    },
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
