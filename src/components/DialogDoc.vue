<template>
  <v-dialog :max-width="docWidth" v-model="dialog">
    <v-card>
      <v-toolbar density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title>{{ data.title }}</v-card-title>
      <v-card-text>
        <div v-html="data.message"></div>
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
    data() {
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
              "<p><strong>Тел, Вайбър</strong>: 088 990 7045</p> <p><strong>Имейл</strong>: centriu78@gmail.com,&nbsp;isaleh@tu-sofia.bg</p> <p><strong>Фейсбук</strong>: ismail.saleh.921230</p>",
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
