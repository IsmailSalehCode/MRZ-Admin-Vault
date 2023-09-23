<template>
  <v-btn @click="open"> import </v-btn>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="red"> ╳ </v-btn>
      </v-toolbar>
      <v-card-title>Импортиране</v-card-title>
      <v-expand-transition>
        <div v-show="hasAlerts">
          <div v-for="alert in alerts" :key="alert.message">
            <v-alert rounded="0" :type="alert.type">
              <div v-html="alert.message"></div>
            </v-alert>
          </div>
        </div>
      </v-expand-transition>
      <v-form ref="form" @submit="readAndImportSelectedFile" @submit.prevent>
        <v-card-text>
          <v-file-input
            v-model="selectedFile"
            :rules="importFileRules"
            prepend-icon="mdi-file"
            label="Импорт файл"
            accept=".json"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loadingImport" type="submit" color="success"
            >ОК
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { importEntry } from "../dbController.js";
import { required } from "../field-validation-rules/commonFieldRules";
export default {
  computed: {
    hasAlerts() {
      return this.alerts.length > 0;
    },
  },
  data() {
    return this.initialState();
  },
  methods: {
    async readAndImportSelectedFile() {
      this.loadingImport = true;
      try {
        const toImportJSON = await this.readSelectedFile();
        await this.importSelectedFileContent(toImportJSON);
      } catch (err) {
        this.pushAlert("error", err);
      }
      this.loadingImport = false;
    },
    async readSelectedFile() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const selectedFile = this.selectedFile[0];
        // using the FileReader API requires a Promise-based approach due to the event-driven nature of file reading.
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const importFileContent = reader.result;
              const importFileJSON = JSON.parse(importFileContent);
              resolve(importFileJSON);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = (e) => {
            reject(
              new Error("Провален прочит на избрания файл: ", e.target.error)
            );
          };
          reader.readAsText(selectedFile);
        });
      }
    },
    async importSelectedFileContent(toImport) {
      const toImportArr = toImport;
      const importedDocs = [];
      const importErrors = [];
      for (let i = 0; i < toImportArr.length; i++) {
        const entry = toImportArr[i];
        const result = await importEntry(entry);

        if (result instanceof Error) {
          importErrors.push(result);
        } else {
          importedDocs.push(result);
        }
      }
      const importResults = {
        errors: importErrors,
        successes: importedDocs,
      };
      return importResults;
    },
    initialState() {
      return {
        importFileRules: [required],
        loadingImport: false,
        selectedFile: null,
        alerts: [],
        dialog: false,
      };
    },
    pushAlert(pType, pMsg) {
      const newAlert = {
        type: pType,
        message: pMsg,
      };
      this.alerts.push(newAlert);
    },
    open() {
      this.dialog = true;
    },
    close() {
      Object.assign(this.$data, this.initialState());
    },
    resetAlerts() {
      this.alerts = [];
    },
  },
  watch: {
    selectedFile() {
      this.resetAlerts();
    },
  },
};
</script>
<style lang=""></style>
