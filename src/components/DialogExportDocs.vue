<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card :loading="loadingEntries">
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="red"> ╳ </v-btn>
      </v-toolbar>
      <v-expand-transition>
        <div v-show="alert.show">
          <v-alert rounded="0" :type="alert.type">{{ alert.message }}</v-alert>
        </div>
      </v-expand-transition>
      <v-card-title>Експортиране</v-card-title>
      <v-card-text v-if="entries">
        <!-- <v-textarea
          :loading="loadingCurrentNotes"
          :disabled="loadingUpdate"
          variant="outlined"
          prepend-icon="mdi-note-multiple"
          clearable
          v-model.trim="currentNotes"
        ></v-textarea> -->
        {{ entries }}
      </v-card-text>
      <v-card-actions>
        <!-- <v-btn :loading="loadingUpdate" color="success" @click="submitEdit"
          >Редактирай</v-btn
        > -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getEntriesByIds } from "../dbController.js";
import { exportToJSON } from "../exportToJSON";

export default {
  props: {
    selectedIds: Array,
  },
  data() {
    return this.initialState();
  },
  methods: {
    initialState() {
      return {
        loadingEntries: false,
        loadingExport: false,
        entries: null,
        dialog: false,
        alert: {
          show: false,
          type: "info",
          message: null,
        },
      };
    },
    open() {
      this.dialog = true;
      this.getEntriesByIds();
    },
    close() {
      Object.assign(this.$data, this.initialState());
    },
    async getEntriesByIds() {
      this.loadingEntries = true;
      const passedIds = this.selectedIds;
      const result = await getEntriesByIds(passedIds);
      if (result instanceof Error) {
        this.showAlert("error", result.message);
      } else {
        this.entries = result;
      }
      this.loadingEntries = false;
    },
    async submitExport() {
      this.loadingExport = true;
      const exportPath = "C:\\Users\\gamer\\Desktop\\astro test\\test.json";
      const selectedEntries = this.entries;
      const exportOperation = exportToJSON(selectedEntries, exportPath);
      if (exportOperation instanceof Error) {
        this.showAlert("error", exportOperation.message);
        return;
      }
      this.showAlert("success", "Готово.");
      this.loadingExport = false;
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
