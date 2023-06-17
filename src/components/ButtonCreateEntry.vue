<!-- <template>
  <v-btn @click="insertNewEntry">Запази</v-btn>
</template>
<script>
const { MRZ_Entry } = require("../../DB/config");
export default {
  props: {
    entry: Object,
  },
  methods: {
    async insertNewEntry() {
      try {
        const newEntry = await MRZ_Entry.create(this.entry);
        console.log("Created: ", newEntry.toJSON());
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style></style> -->
<!-- this doesnt work -->
<!-- "createEntry" is not exported by "controllers/MRZ_Entry-Controller.js", imported by "src/components/ButtonCreateEntry.vue". -->
<template>
  <v-btn @click="insertNewEntry">Запази</v-btn>
</template>
<script>
// import { createEntry } from "../../controllers/MRZ_Entry-Controller";

export default {
  props: {
    entry: Object,
  },
  methods: {
    async insertNewEntry() {
      // try {
      //   const entry = await createEntry(this.entry);
      //   console.log(entry);
      // } catch (err) {
      //   console.error(err);
      // }
      console.log(this.entry);
    },
  },
};
</script>
<style></style>
<!-- IDBGR6480598530<<<<<<<<<<<<<<<9910115M2902278BGR9910116445<4SALEH<<ISMAIL<OSAMA<<<<<<<<<<< -->
<!-- P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<L898902C<3UTO6908061F9406236ZE184226B<<<<<14 -->
