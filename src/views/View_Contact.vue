<template>
  <v-container>
    <v-card class="mx-auto" max-width="600" rounded="lg" elevation="5">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-img
              max-width="150"
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
            <h2 class="pb-4">Исмаил Осама Салех</h2>
            <hr />
            <p class="pt-2">
              Каналите за кореспонденция с програмиста на MRZ Admin Vault са
              следните ...
            </p>
            <ul>
              <li v-for="contact in arrContact" :key="contact.title">
                <b>{{ contact.title }}</b
                >:
                <a :href="contact.href" target="_blank">{{
                  contact.content
                }}</a>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import contactAuthorChannels from "../../contact-author-channels.json";
import imgAuthor from "../assets/images/ismail.jpg";

export default {
  data() {
    return {
      imgAuthor: imgAuthor,
      arrContact: contactAuthorChannels,
    };
  },
};
</script>

<style scoped>
p {
  text-indent: 5px;
  line-height: 25px;
}
ul {
  list-style-position: inside;
  line-height: 24px;
}
</style>
