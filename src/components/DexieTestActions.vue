<template>
  <div>
    <v-btn @click="clearAllEntries()">Clear all</v-btn>
  </div>
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
