<template>
  <v-container>
    <CardContactDeveloper />
  </v-container>
  <v-container> <CardCurrentReleaseInfo /> </v-container>
</template>
<script>
import CardContactDeveloper from "../components/CardContactDeveloper.vue";
import CardCurrentReleaseInfo from "@/components/CardCurrentReleaseInfo.vue";

export default {
  components: {
    CardContactDeveloper,
    CardCurrentReleaseInfo,
  },
};
</script>

<style scoped></style>
