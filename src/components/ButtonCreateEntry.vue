<template>
  <v-btn @click="insertNewEntry">Запази</v-btn>
</template>
<script>
import { createEntry } from "../../controllers/MRZ_Entry-Controller";

export default {
  props: {
    entry: Object,
  },
  methods: {
    async insertNewEntry() {
      try {
        await createEntry(this.entry);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style></style>
