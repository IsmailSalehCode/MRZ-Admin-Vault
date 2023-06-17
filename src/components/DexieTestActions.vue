<template>
  <v-container>
    <v-btn @click="clearAll">Изпразни всички записи</v-btn>
  </v-container>
</template>
<script>
import { clearAllEntries } from "../dbController.js";
export default {
  methods: {
    async clearAll() {
      await clearAllEntries();
    },
  },
};
</script>
<style lang=""></style>
