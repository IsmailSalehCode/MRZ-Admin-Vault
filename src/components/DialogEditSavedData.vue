<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-alert v-if="alert.show" :type="alert.type">{{
        alert.message
      }}</v-alert>
      <div v-if="!alert.show">
        <v-card-title>Бележките на документ № {{ cardDocNum }}:</v-card-title>
        <v-card-text>
          <v-textarea
            :loading="loadingCurrentNotes"
            :disabled="loadingUpdate"
            variant="outlined"
            prepend-icon="mdi-note"
            clearable
            v-model.trim="currentNotes"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loadingUpdate" color="success" @click="submitEdit"
            >Редактирай</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { getEntryNotesById, updateEntryNotesById } from "../dbController.js";

export default {
  emits: ["displayUpdatedData"],
  props: {
    cardDocNum: String,
  },
  data() {
    return {
      loadingCurrentNotes: false,
      loadingUpdate: false,
      dialog: false,
      currentNotes: "",
      alert: {
        show: false,
        type: "",
        message: null,
      },
    };
  },
  methods: {
    open() {
      if (this.cardDocNum) {
        this.dialog = true;
        this.getCurrentNotesById(this.cardDocNum);
      }
    },
    close() {
      this.dialog = false;
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
    async submitEdit() {
      const id = this.cardDocNum;
      this.loadingUpdate = true;
      const result = await updateEntryNotesById(id, this.currentNotes);
      if (result instanceof Error) {
        this.handleErr(result);
      }
      this.loadingUpdate = false;
      this.emitUpdateParent();
    },
    emitUpdateParent() {
      this.close();
      this.$emit("displayUpdatedData");
    },
    handleErr(err) {
      this.alert = {
        show: true,
        type: "error",
        message: err.message,
      };
    },
  },
};
</script>
<style scoped>
p {
  line-height: 25px;
}
</style>
