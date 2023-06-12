<template>
  <v-footer bottom absolute app theme="dark">
    <v-col cols="12" class="text-center">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="4" align="center" justify="center">
          <v-row align="center" justify="center">
            <v-btn
              outlined
              tile
              small
              text
              @click="openDoc('terms-and-conditions')"
              >Общи Условия</v-btn
            >
          </v-row>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          align="center"
          justify="center"
          class="text-center"
          style="font-size: 0.8rem"
        >
          &#169; {{ new Date().getFullYear() }} -
          <strong>Исмаил Салех @ ТУ-София</strong>
          Всички права запазени.
        </v-col>
        <v-col cols="12" sm="4" align="center" justify="center">
          <v-row align="center" justify="center">
            <v-btn outlined tile small text @click="openDoc('contact-info')"
              >Поддръжка</v-btn
            >
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-footer>
  <DialogDoc ref="doc" :topic="docTopicChoice" />
  <!-- TODO check the red words -->
</template>
<script>
import DialogDoc from "./DialogDoc.vue";

export default {
  components: { DialogDoc },
  data() {
    return {
      docTopicChoice: null,
    };
  },
  methods: {
    openDoc(topic) {
      this.docTopicChoice = topic;
      this.$refs.doc.open();
    },
  },
};
</script>
<style></style>
