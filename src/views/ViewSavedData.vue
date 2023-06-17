<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container fluid>
    <v-data-table
      no-data-text="Няма въведени данни."
      :headers="headers"
      :items="cards"
      class="elevation-5"
      item-value="docNum"
      v-model:expanded="expanded"
      show-expand
      items-per-page-text="Документи на страница"
      :items-per-page-options="itemsPerPageOptions"
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
      alert: {
        show: false,
        type: "",
        message: null,
      },
      itemsPerPageOptions: [
        { title: "5", value: 5 },
        { title: "10", value: 10 },
        { title: "15", value: 15 },
        { title: "20", value: 20 },
        { title: "Всички", value: -1 },
      ],
    };
  },
  methods: {
    // modifyNotes(notes) {
    //   const result =
    //     notes === null || notes === "" ? "Не е въведено нищо." : notes;
    //   return result;
    // },
    resetAlert() {
      this.alert = {
        show: false,
        type: "",
        message: null,
      };
    },
    handleErr(err) {
      this.alert = {
        show: true,
        type: "error",
        message: err.message,
      };
    },
    async getAllEntries() {
      const result = await getAllEntries();
      if (!(result instanceof Error)) {
        this.cards = result;
      } else {
        this.handleErr(result);
      }
    },
  },
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getAllEntries();
  },
};
</script>
<style></style>
