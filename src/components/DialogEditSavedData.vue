<template>
  <v-dialog v-model="dialog" persistent max-width="900">
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
      <v-card-title>Бележките на документ № {{ cardDocNum }}:</v-card-title>
      <v-card-text>
        <v-textarea
          :loading="loadingCurrentNotes"
          :disabled="loadingUpdate"
          variant="outlined"
          prepend-icon="mdi-note-multiple"
          clearable
          v-model.trim="currentNotes"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn :loading="loadingUpdate" color="success" @click="submitEdit"
          >Редактирай</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  getEntryNotesById,
  updateEntryNotesById,
  isNotesUpdateRedundant,
} from "../dbController.js";

export default {
  emits: ["displayUpdatedData"],
  props: {
    cardDocNum: String,
  },
  data() {
    return this.initialState();
  },
  methods: {
    initialState() {
      return {
        loadingCurrentNotes: false,
        loadingUpdate: false,
        dialog: false,
        currentNotes: "",
        alert: {
          show: false,
          type: "info",
          message: null,
        },
      };
    },
    open() {
      if (this.cardDocNum) {
        this.dialog = true;
        this.getCurrentNotesById(this.cardDocNum);
      }
    },
    close() {
      Object.assign(this.$data, this.initialState());
    },
    async getCurrentNotesById(id) {
      this.loadingCurrentNotes = true;
      const result = await getEntryNotesById(id);
      if (result instanceof Error) {
        this.showAlert("error", result.message);
      } else {
        this.currentNotes = result;
      }
      this.loadingCurrentNotes = false;
    },
    async submitEdit() {
      const id = this.cardDocNum;
      this.loadingUpdate = true;
      const isUpdateRedundant = await isNotesUpdateRedundant(
        id,
        this.currentNotes
      );
      if (isUpdateRedundant) {
        this.showAlert("info", "Не сте направили промяна.");
        this.loadingUpdate = false;
        return;
      }
      const result = await updateEntryNotesById(id, this.currentNotes);
      if (result instanceof Error) {
        this.showAlert("error", result.message);
        this.loadingUpdate = false;
        return;
      }
      this.emitUpdateParent();
      this.loadingUpdate = false;
    },
    emitUpdateParent() {
      this.close();
      this.$emit("displayUpdatedData");
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
