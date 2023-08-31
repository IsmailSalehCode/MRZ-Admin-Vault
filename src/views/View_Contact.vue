<template>
  <v-container>
    <v-card class="mx-auto" max-width="700" rounded="lg">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-img
              max-width="200"
              style="margin: auto; border-radius: 3%"
              cover
              :src="imgAuthor"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="blue"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-col>
          <v-col cols="12" sm="8">
            <h2 class="py-4">Връзка със софтуерния разработчик</h2>
            <p v-for="contact in arrContact" :key="contact.title">
              <b>{{ contact.title }}</b
              >: <a :href="contact.href">{{ contact.content }}</a>
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <div>{{ arrContact }}</div>
</template>
<script>
import contactAuthorChannels from "../../contact-author-channels.json";
import imgAuthor from "../assets/images/ismail.jpg";

export default {
  data() {
    return {
      imgAuthor: imgAuthor,
    };
  },
  computed: {
    arrContact() {
      return contactAuthorChannels;
    },
  },
};
</script>
