<template>
  <div>{{ cards }}</div>
</template>
<script>
import { getAllEntries } from "@/dbController";
export default {
  data() {
    return {
      cards: [],
    };
  },
  mounted() {
    this.cards = getAllEntries();
    console.log(this.cards);
  },
};
</script>
<style></style>
