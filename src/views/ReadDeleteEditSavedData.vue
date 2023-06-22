<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container>
    <!-- todo: styling -->
    <v-select
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchDocNum"
      label="Търси по док. №"
      :items="itemsSearchDocNum"
      clearable
    ></v-select>
    <v-select
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchSurname"
      label="Търси по фамилно име"
      :items="itemsSearchSurname"
      clearable
    ></v-select>
    <v-select
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchGivenNames"
      label="Търси по дадени имена"
      :items="itemsSearchGivenNames"
      clearable
    ></v-select>
    <v-select
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchDocType"
      label="Търси по док. тип"
      :items="itemsSearchDocTypes"
      clearable
    ></v-select>
  </v-container>
  <v-container fluid>
    <!-- not all -text props are extracted to a variable. Only the ones that are reused -->
    <v-data-table
      :no-data-text="noDataText"
      :loading-text="loadingText"
      :loading="loadingCards"
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
      <template v-slot:item.type="{ item }">
        {{ transcribeDocType(item.columns.type) }}
      </template>
      <template v-slot:item.issuingOrg="{ item }">
        {{ transcribeCountryCode(item.columns.issuingOrg) }}
      </template>
      <template v-slot:item.nationality="{ item }">
        {{ transcribeCountryCode(item.columns.nationality) }}
      </template>
      <template v-slot:item.sex="{ item }">
        {{ transcribeSexCode(item.columns.sex) }}
      </template>
      <template v-slot:item.birthDate="{ item }">
        {{ convertYYMMDD_toBG(item.columns.birthDate) }}
      </template>
      <template v-slot:item.expDate="{ item }">
        {{ convertYYMMDD_toBG(item.columns.expDate) }}
      </template>
      <template v-slot:item.personalNum="{ item }">
        {{ indicateIfStrEmpty(item.columns.personalNum) }}
      </template>
      <template v-slot:item.optional1="{ item }">
        {{ indicateIfStrEmpty(item.columns.optional1) }}
      </template>
      <template v-slot:item.optional2="{ item }">
        {{ indicateIfStrEmpty(item.columns.optional2) }}
      </template>
      <template v-slot:item.notes="{ item }">
        {{ indicateIfStrEmpty(item.columns.notes) }}
      </template>
      <template v-slot:item.updatedAt="{ item }">
        {{ convertTimestampToLocaleDatetime(item.columns.updatedAt) }}
      </template>
    </v-data-table>
  </v-container>
  <v-container>
    <v-row
      style="
        text-align: center;
        max-width: fit-content;
        border: black solid 2px;
        border-radius: 15px;
      "
    >
      <v-col>
        <v-btn
          icon="mdi-delete-forever"
          color="error"
          :disabled="!isAtLeastOneSelected"
          @click="deleteSelected"
        ></v-btn>
      </v-col>
      <v-col>
        <v-btn
          icon="mdi-note-edit"
          color="warning"
          :disabled="!isOneSelected"
          @click="startEdit"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
  <DialogEditSavedData
    @display-updated-data="getAllEntries"
    ref="edit_dialog"
    :card-doc-num="selected[0]"
  />
</template>
<script>
import { getAllEntries, deleteEntries } from "@/dbController";
import DialogEditSavedData from "@/components/DialogEditSavedData.vue";
import {
  transcribeDocType,
  transcribeCountryCode,
  transcribeSexCode,
  convertYYMMDD_toBG,
  convertTimestampToLocaleDatetime,
  indicateIfStrEmpty,
} from "@/uxFunctions";

export default {
  components: {
    DialogEditSavedData,
  },
  data() {
    return {
      noDataText: "Няма данни",
      loadingText: "Зареждат се ...",
      loadingCards: false,
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
      convertYYMMDD_toBG: convertYYMMDD_toBG,
      convertTimestampToLocaleDatetime: convertTimestampToLocaleDatetime,
      indicateIfStrEmpty: indicateIfStrEmpty,
      transcribeDocType: transcribeDocType,
      transcribeCountryCode: transcribeCountryCode,
      transcribeSexCode: transcribeSexCode,
      // BEGIN search vars
      searchDocNum: null,
      searchSurname: null,
      searchGivenNames: null,
      searchDocType: null,
      // END search vars
    };
  },
  methods: {
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
    resetArrSelected() {
      this.selected = [];
    },
    async getAllEntries() {
      this.loadingCards = true;
      const result = await getAllEntries();
      if (!(result instanceof Error)) {
        this.cards = result;
        this.resetArrSelected();
      } else {
        this.handleErr(result);
      }
      this.loadingCards = false;
    },
    async deleteSelected() {
      const entriesToDelete = this.selected;
      const result = await deleteEntries(entriesToDelete);
      if (!(result instanceof Error)) {
        this.getAllEntries();
      } else {
        this.handleErr(result);
      }
    },
    startEdit() {
      this.$refs.edit_dialog.open();
    },
    getAllUniqueValuesFromArr(fieldName) {
      return [...new Set(this.cards.map((c) => c[fieldName]))];
    },
    filterCards(query, filteredField) {
      // if we have a query
      if (query != null) {
        this.cards = this.cards.filter((c) => c[filteredField] == query);
      } else {
        this.getAllEntries();
      }
    },
  },
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getAllEntries();
  },
  computed: {
    itemsSearchDocNum() {
      return this.cards.map((c) => c.docNum);
    },
    itemsSearchSurname() {
      return [...new Set(this.cards.map((c) => c.surname))];
    },
    itemsSearchGivenNames() {
      return [...new Set(this.cards.map((c) => c.givenNames))];
    },
    itemsSearchDocTypes() {
      // todo test it
      return this.getAllUniqueValuesFromArr("type");
    },
  },
  watch: {
    selected() {
      const len = this.selected.length;
      // reset values
      this.isOneSelected = false;
      this.isAtLeastOneSelected = false;
      // end of reset values
      if (len == 1) {
        this.isOneSelected = true;
      }
      if (len >= 1) {
        this.isAtLeastOneSelected = true;
      }
    },
    searchDocType() {
      const desiredDocType = this.searchDocType;
      const filteredField = "type";
      this.filterCards(desiredDocType, filteredField);
    },
    searchDocNum() {
      // if we have a query
      const desiredDocNum = this.searchDocNum;
      if (desiredDocNum != null) {
        this.cards = this.cards.filter((c) => c.docNum == desiredDocNum);
      } else {
        this.getAllEntries();
      }
    },
    searchSurname() {
      const desiredSurname = this.searchSurname;
      if (desiredSurname != null) {
        this.cards = this.cards.filter((c) => c.surname == desiredSurname);
      } else {
        this.getAllEntries();
      }
    },
    searchGivenNames() {
      const desiredGivenNames = this.searchGivenNames;
      if (desiredGivenNames != null) {
        this.cards = this.cards.filter(
          (c) => c.givenNames == desiredGivenNames
        );
      } else {
        this.getAllEntries();
      }
    },
  },
};
</script>
<style></style>
