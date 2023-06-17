<template>
  <v-container>
    <v-data-table
      no-data-text="Няма въведени данни."
      :headers="headers"
      :items="cards"
      class="elevation-5"
      item-value="docNum"
      v-model:expanded="expanded"
      show-expand
    >
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-textarea
              v-model="item.raw.notes"
              density="compact"
              variant="solo"
              readonly
              label="Бележки"
            ></v-textarea>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { getAllEntries } from "@/dbController";
export default {
  data() {
    return {
      expanded: [],
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
        {
          title: "Опц. поле 1",
          key: "optional1",
        },
        {
          title: "Опц. поле 2",
          key: "optional2",
        },
      ],
    };
  },
  methods: {
    // modifyNotes(notes) {
    //   const result =
    //     notes === null || notes === "" ? "Не е въведено нищо." : notes;
    //   return result;
    // },
  },
  async mounted() {
    this.cards = await getAllEntries();
    console.log(this.cards);
  },
};
</script>
<style></style>
