<template>
  <v-row justify="center" align="center">
    <v-col v-for="item in mrzInfo" :key="item.index" class="px-0">
      <v-alert :type="item.type.toString()">{{ item.message }}</v-alert>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    mrzInfo: Array,
  },
};
</script>
<style></style>
