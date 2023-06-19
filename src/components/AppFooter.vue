<template>
  <v-footer bottom absolute app theme="dark">
    <v-col style="text-align: center">
      <v-row justify="space-evenly">
        <v-col>
          <v-btn
            variant="plain"
            size="small"
            @click="openDoc('terms-and-conditions')"
            >Общи Условия</v-btn
          >
        </v-col>
        <v-col
          cols="12"
          sm="4"
          justify="center"
          class="text-center"
          style="font-size: 0.8rem"
        >
          &#169; 2023 -
          <strong>Исмаил Салех @ ТУ-София</strong>
        </v-col>
        <v-col>
          <v-btn variant="plain" size="small" @click="openDoc('contact-info')"
            >Поддръжка</v-btn
          >
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
