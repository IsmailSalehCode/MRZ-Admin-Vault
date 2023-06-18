<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container fluid>
    <v-data-table
      no-data-text="Няма данни."
      :headers="headers"
      :items="cards"
      class="elevation-5"
      item-value="docNum"
      items-per-page-text="Документи на страница"
      :items-per-page-options="itemsPerPageOptions"
      page-text="{0}-{1} от {2}"
      v-model="selected"
      show-select
    >
      <template v-slot:item.personalNum="{ item }">
        {{ indicateIfEmpty(item.columns.personalNum) }}
      </template>
      <template v-slot:item.optional1="{ item }">
        {{ indicateIfEmpty(item.columns.optional1) }}
      </template>
      <template v-slot:item.optional2="{ item }">
        {{ indicateIfEmpty(item.columns.optional2) }}
      </template>
      <template v-slot:item.notes="{ item }">
        {{ indicateIfEmpty(item.columns.notes) }}
      </template>
      <template v-slot:item.updatedAt="{ item }">
        {{ convertTimestampToLocaleDatetime(item.columns.updatedAt) }}
      </template>
    </v-data-table>
  </v-container>
  <v-container fluid>
    <v-row style="text-align: center; max-width: fit-content">
      <v-col>
        <v-btn
          icon="mdi-delete-forever"
          color="error"
          :disabled="!isAtLeastOneSelected"
        ></v-btn>
      </v-col>
      <v-col>
        <v-btn
          icon="mdi-note-edit"
          color="warning"
          :disabled="!isOneSelected"
        ></v-btn>
      </v-col>
    </v-row>
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
          sortable: false,
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
        {
          title: "Бележки",
          key: "notes",
        },
        {
          title: "Последна промяна",
          key: "updatedAt",
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
      selected: [],
      isOneSelected: false,
      isAtLeastOneSelected: false,
      isMoreThanOneSelected: false,
    };
  },
  methods: {
    convertTimestampToLocaleDatetime(timestamp) {
      const date = new Date(timestamp);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      const localizedDatetime = date.toLocaleString("bg-BG", options);

      return localizedDatetime;
    },
    indicateIfEmpty(str) {
      const result = str == null || str == "" ? "╳" : str;
      return result;
    },
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
  watch: {
    selected() {
      const len = this.selected.length;
      // reset values
      this.isOneSelected = false;
      this.isAtLeastOneSelected = false;
      this.isMoreThanOneSelected = false;
      // end of reset values
      if (len == 1) {
        this.isOneSelected = true;
      }
      if (len >= 1) {
        this.isAtLeastOneSelected = true;
      }
      if (len > 1) {
        this.isMoreThanOneSelected = true;
      }
    },
  },
};
</script>
<style></style>
