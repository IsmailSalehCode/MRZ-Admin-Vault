<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title
        >Редакция на бележката на документ {{ cardDocNum }}</v-card-title
      >
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
        <v-btn @click="submit">Готово</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getEntryNotesById } from "../dbController.js";

export default {
  props: {
    cardDocNum: String,
  },
  data() {
    return {
      loadingCurrentNotes: false,
      dialog: false,
      currentNotes: "",
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
      this.currentNotes = result;
      this.loadingCurrentNotes = false;
    },
    submit() {
      console.log(this.newNotes);
    },
  },
  computed: {
    newNotes() {
      return this.currentNotes;
    },
  },
};
</script>
<style scoped>
p {
  line-height: 25px;
}
</style>
