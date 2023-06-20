<template>
  <v-dialog v-model="dialogEdit" max-width="900">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>Бележките на документ № {{ cardDocNum }}:</v-card-title>
      <v-card-text>
        <v-textarea
          :loading="loadingCurrentNotes"
          variant="outlined"
          prepend-icon="mdi-note"
          clearable
          label="Бележки"
          v-model.trim="currentNotes"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submit">Редактирай</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getEntryNotesById } from "../dbController.js";
import { dialog } from "electron";

export default {
  props: {
    cardDocNum: String,
  },
  data() {
    return {
      loadingCurrentNotes: false,
      dialogEdit: false,
      currentNotes: "",
    };
  },
  methods: {
    open() {
      if (this.cardDocNum) {
        this.dialogEdit = true;
        this.getCurrentNotesById(this.cardDocNum);
      }
    },
    close() {
      this.dialogEdit = false;
    },
    async getCurrentNotesById(id) {
      this.loadingCurrentNotes = true;
      const result = await getEntryNotesById(id);
      if (result instanceof Error) {
        this.handleErr(result);
      } else {
        this.currentNotes = result;
      }
      this.loadingCurrentNotes = false;
    },
    submit() {
      console.log(this.currentNotes);
    },
    handleErr(err) {
      dialog.showMessageBox({
        type: "error",
        title: "Възникна проблем...",
        message: err.message,
        buttons: ["OK"],
      });
    },
  },
};
</script>
<style scoped>
p {
  line-height: 25px;
}
</style>
