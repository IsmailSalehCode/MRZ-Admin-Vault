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
            >Контакт</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-footer>
  <DialogMiscInfo ref="dialog_misc_info" :topic="topicChoice" />
</template>
<script>
import DialogMiscInfo from "./DialogMiscInfo.vue";

export default {
  components: { DialogMiscInfo },
  data() {
    return {
      topicChoice: null,
    };
  },
  methods: {
    openDoc(topic) {
      this.topicChoice = topic;
      this.$refs.dialog_misc_info.open();
    },
  },
};
</script>
<style></style>
