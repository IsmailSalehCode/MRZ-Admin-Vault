<template>
  <!-- v-if='topic' check is the shortest solution to: 'undefined.cardWidth' error which is breaking the app -->
  <v-dialog
    v-if="topic"
    theme="dark"
    :max-width="documentData.cardWidth"
    v-model="dialog"
  >
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>{{ documentData.title }}</v-card-title>
      <v-card-text>
        <div v-html="documentData.content"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Documents from "../info-docs.json";

export default {
  props: {
    topic: String,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
  },
  computed: {
    documentData() {
      const topic = this.topic;
      const result = Documents.find(function (obj) {
        return obj.id == topic;
      });
      return result;
    },
  },
};
</script>
<style scoped>
p {
  line-height: 25px;
}
</style>
