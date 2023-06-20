<template>
  <v-container>
    <v-btn @click="clearAll">Изпразни всички записи</v-btn>
    <v-btn @click="addAll">Добави примерни</v-btn>
  </v-container>
</template>
<script>
import { clearAllEntries, addAllEntries } from "../dbController.js";
export default {
  methods: {
    async clearAll() {
      await clearAllEntries();
    },
    async addAll() {
      await addAllEntries();
    },
  },
};
</script>
<style lang=""></style>
