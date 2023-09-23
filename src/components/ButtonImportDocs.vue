<template>
  <v-btn icon="mdi-import" @click="open"></v-btn>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="red"> ╳ </v-btn>
      </v-toolbar>
      <v-card-title>Импортиране</v-card-title>
      <div v-show="hasAlerts">
        <TransitionGroup name="alert" tag="div">
          <div v-for="alert in alerts" :key="alert.message">
            <v-alert rounded="0" :type="alert.type">
              <div v-html="alert.message"></div>
            </v-alert>
          </div>
        </TransitionGroup>
      </div>
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
  emits: ["displayUpdatedData"],
  computed: {
    hasAlerts() {
      return this.alerts.length > 0;
    },
  },
  data() {
    return this.initialState();
  },
  methods: {
    emitUpdateParent() {
      this.$emit("displayUpdatedData");
    },
    drawImportResults(importResults) {
      const successes = importResults.successes;
      const errors = importResults.errors;

      const successesLength = successes.length;
      const errorsLength = errors.length;

      const hasSuccess = Boolean(successesLength > 0);
      const hasError = Boolean(errorsLength > 0);

      const successesDetails = hasSuccess ? successes.join(", ") : "0";
      const strSuccessesSummary = `<p><b>Успешно импортирани документи</b>: ${successesDetails}</p>`;

      const errorsDetails = hasError ? errors.join(" Следваща грешка 🠞 ") : "0";
      const strErrorsSummary = `<p><b>Възникнали грешки</b>: ${errorsDetails}</p>`;

      const strImportSummary = `${strSuccessesSummary}<br/>${strErrorsSummary}`;
      this.pushAlert("info", strImportSummary);

      if (hasSuccess) {
        this.emitUpdateParent();
      }
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
<style scoped>
.alert-move, /* apply transition to moving elements */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.2s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(25px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.alert-leave-active {
  position: absolute;
}
</style>
