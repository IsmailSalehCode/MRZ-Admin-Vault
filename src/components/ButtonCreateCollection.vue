<template>
  <v-btn color="success" variant="tonal" icon @click="open">
    <v-icon>mdi-folder-plus</v-icon>
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
      <v-card-title>Създайте нова колекция</v-card-title>
      <v-form ref="form" @submit="addCollection" @submit.prevent>
        <v-card-text>
          <v-text-field
            prepend-icon="mdi-folder"
            label="Име"
            v-model.trim="name"
            :rules="collectionRules"
            validate-on="blur"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loadingSubmit" type="submit" color="success"
            >ОК</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { addNewCollection } from "../dbController.js";

export default {
  emits: ["refresh-collections"],
  data() {
    return this.initialState();
  },
  methods: {
    initialState() {
      return {
        dialog: false,
        name: null,
        collectionRules: [
          (v) => !!v || "Не може да е празно!",
          (v) => (v && v.length > 2) || "Трябва да съдържа минимум 3 символа!",
        ],
        loadingSubmit: false,
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
    async addCollection() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        this.loadingSubmit = true;
        const result = await addNewCollection({
          name: this.name,
        });
        if (result instanceof Error) {
          this.showAlert("error", result.message);
          this.loadingSubmit = false;
          return;
        }
        this.emitUpdateParent();
      }
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
