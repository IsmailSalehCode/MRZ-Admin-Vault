<template>
  <v-container v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <div v-if="!alert.show">
    <v-select
      v-model="selectedCollection"
      no-data-text="Няма създадени колекции"
      :loading="loadingCollections"
      label="Колекция"
      :items="collections"
      item-value="id"
      item-title="name"
      clearable
      style="max-width: fit-content; min-width: 300px"
      :disabled="disabledSelector"
    >
      <template v-slot:prepend-inner>
        <ButtonCreateCollection @refresh-collections="getAllCollections" />
      </template>
    </v-select>
  </div>
</template>
<script>
import { getAllCollections } from "../dbController.js";
import ButtonCreateCollection from "./ButtonCreateCollection.vue";

export default {
  components: { ButtonCreateCollection },
  props: {
    modelValue: Number,
    disabledSelector: Boolean,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selectedCollection: null,
      collections: [],
      loadingCollections: true,
      alert: {
        show: false,
        type: "info",
        message: null,
      },
    };
  },
  watch: {
    selectedCollection() {
      this.$emit("update:modelValue", this.selectedCollection);
    },
  },
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getAllCollections();
  },
  methods: {
    resetAlert() {
      this.alert = {
        show: false,
        type: "info",
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
};
</script>
