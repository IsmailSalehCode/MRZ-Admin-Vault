<template>
  <v-btn icon="mdi-import" @click="open"></v-btn>
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
    drawImportResults(importResults) {
      const successes = importResults.successes;
      const errors = importResults.errors;

      const successesLength = successes.length;
      const errorsLength = errors.length;

      const successesDetails = successesLength > 0 ? successes.join(", ") : "0";
      const strSuccessesSummary = `<p><b>Успешно импортирани документи</b>: ${successesDetails}</p>`;

      const errorsDetails =
        errorsLength > 0 ? errors.join(" Следваща грешка 🠞 ") : "0";
      const strErrorsSummary = `<p><b>Възникнали грешки</b>: ${errorsDetails}</p>`;

      const strImportSummary = `${strSuccessesSummary}<br/>${strErrorsSummary}`;
      this.pushAlert("info", strImportSummary);
    },
    async readAndImportSelectedFile() {
      this.loadingImport = true;
      try {
        const toImportJSON = await this.readSelectedFile();
        this.pushAlert("success", "Успешен прочит на файла.");
        const importResults = await this.importSelectedFileContent(
          toImportJSON
        );
        this.drawImportResults(importResults);
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
          importErrors.push(result.message);
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
