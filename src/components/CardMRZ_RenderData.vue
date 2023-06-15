<template>
  <div>{{ JSON.stringify(rdata) }}</div>
  <v-card max-width="740px" variant="outlined" rounded="xl">
    <v-card-title>{{ mrzData.surname }}, {{ mrzData.givenNames }}</v-card-title>
    <v-card-subtitle>Фамилия, дадени имена</v-card-subtitle>
  </v-card>
</template>
<script>
export default {
  props: {
    rdata: Object,
  },

  computed: {
    mrzData() {
      const surname = this.rdata.surname;
      const givenNames = this.rdata.givenNames;
      return { surname, givenNames };
    },
  },
};
</script>
<style></style>
