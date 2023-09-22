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
      <div v-if="!loadingEntries">
        <v-form ref="form" @submit="submitExport" @submit.prevent>
          <v-card-text>
            <v-text-field
              class="pb-2"
              prepend-icon="mdi-file"
              label="Име на файла"
              v-model.trim="fileName"
              :rules="fileNameRules"
              validate-on="blur"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="loadingExport" type="submit" color="success"
              >ОК</v-btn
            >
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { getEntriesByIds } from "../dbController.js";
import { exportToJSON } from "../exportToJSON";
import { defTxtRules } from "../field-validation-rules/defaultTxtFieldRules";

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
        fileName: null,
        fileNameRules: defTxtRules,
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
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        this.loadingExport = true;
        const fileName = this.fileName;
        const exportPath = "C:\\Users\\gamer\\Desktop\\astro test\\test.json";
        const selectedEntries = this.entries;
        const exportOperation = exportToJSON(selectedEntries, exportPath);
        if (exportOperation instanceof Error) {
          this.showAlert("error", exportOperation.message);
          return;
        }
        const exportLength = selectedEntries.length;
        const docCountable = exportLength == 1 ? "документ" : "документа";
        this.showAlert(
          "success",
          `Успешно експортирахте ${exportLength} бр. ${docCountable} в ${fileName}.json!`
        );
        this.loadingExport = false;
      }
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
