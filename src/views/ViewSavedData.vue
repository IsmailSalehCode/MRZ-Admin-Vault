<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="cards"
      class="elevation-5"
      item-value="docNum"
    ></v-data-table>
  </v-container>
</template>
<script>
import { getAllEntries } from "@/dbController";
export default {
  data() {
    return {
      cards: [],
      headers: [
        {
          title: "Док. №",
          align: "start",
          key: "docNum",
        },
        {
          title: "Фамилно име",
          key: "surname",
        },
        {
          title: "Дадени имена",
          key: "givenNames",
        },
        {
          title: "Док. тип",
          key: "type",
        },
        {
          title: "Док. формат",
          key: "format",
        },
        {
          title: "Издател",
          key: "issuingOrg",
        },
        {
          title: "Националност",
          key: "nationality",
        },
        {
          title: "Пол",
          key: "sex",
        },
        {
          title: "Рожд. дата",
          key: "birthDate",
        },
        {
          title: "Валидност",
          key: "expDate",
        },
        {
          title: "Личен №",
          key: "personalNum",
        },
      ],
    };
  },
  async mounted() {
    this.cards = await getAllEntries();
    console.log(this.cards);
  },
};
</script>
<style></style>
