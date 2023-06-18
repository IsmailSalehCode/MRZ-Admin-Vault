<template>
  <v-dialog theme="dark" :max-width="docWidth" v-model="dialog">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>{{ docData.title }}</v-card-title>
      <v-card-text>
        <div v-html="docData.message"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
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
    docWidth() {
      let result = null;
      switch (this.topic) {
        case "terms-and-conditions":
          result = "900px";
          break;
        case "contact-info":
          result = "400px";
          break;
      }
      return result;
    },
    docData() {
      let data = {};
      switch (this.topic) {
        case "terms-and-conditions":
          data = {
            title: "Общи Условия",
            message: "<p>Това е демо (todo)</p>",
          };
          break;
        case "contact-info":
          data = {
            title: "Поддръжка",
            message:
              "<p><strong>Тел, Вайбър</strong>: <a href='tel:0889907045'>088 990 7045</a></p> <p><strong>E-mail</strong>: <a href='mailto:isaleh@tu-sofia.bg'>isaleh@tu-sofia.bg</a></p> <p><strong>Фейсбук</strong>: <a href='https://www.facebook.com/ismail.saleh.921230' target='_blank'>ismail.saleh.921230</a></p>",
          };
      }
      return data;
    },
  },
};
</script>
<style scoped>
p {
  line-height: 25px;
}
</style>
