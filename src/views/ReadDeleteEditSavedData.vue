<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container>
    <!-- todo: styling -->
    Търси по
    <v-select
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchQueryField"
      placeholder="Избери поле"
      :items="headers"
      item-title="title"
      item-value="key"
      clearable
    ></v-select>
    <v-select
      :disabled="searchQueryField == null"
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchQueryValue"
      placeholder="Налични стойности"
      :items="itemsSearchQuery"
      ref="selectSearchQuery"
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
  expandDocType,
  expandCountryCode,
  expandSexCode,
  convertYYMMDD_toBG,
  convertTimestampToLocaleDatetime,
  indicateIfEmpty,
} from "@/uxFunctions";

export default {
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getAllEntries();
  },
  components: {
    DialogEditSavedData,
  },
  data() {
    return {
      searchQueryField: null,
      searchQueryValue: null,
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
          title: "Бележка",
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
      const entries = await getAllEntries();
      if (!(entries instanceof Error)) {
        this.cards = this.improveReadability(entries);
        this.resetArrSelected();
      } else {
        this.handleErr(entries);
      }
      this.loadingCards = false;
    },
    improveReadability(entries) {
      let readableEntries = [];
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        entry.type = expandDocType(entry.type);
        entry.issuingOrg = expandCountryCode(entry.issuingOrg);
        entry.nationality = expandCountryCode(entry.nationality);
        entry.sex = expandSexCode(entry.sex);
        entry.birthDate = convertYYMMDD_toBG(entry.birthDate);
        entry.expDate = convertYYMMDD_toBG(entry.expDate);
        entry.updatedAt = convertTimestampToLocaleDatetime(entry.updatedAt);
        entry.personalNum = indicateIfEmpty(entry.personalNum);
        entry.optional1 = indicateIfEmpty(entry.optional1);
        entry.optional2 = indicateIfEmpty(entry.optional2);
        entry.notes = indicateIfEmpty(entry.notes);
        readableEntries.push(entry);
      }
      return readableEntries;
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
      return [
        ...new Set(
          this.cards.map((c) => c[fieldName]).filter((value) => value !== null)
        ),
      ];
    },
    filterCards(query, filteredField) {
      // if we have a query
      if (query != null) {
        this.cards = this.cards.filter((c) => c[filteredField] == query);
      } else {
        this.getAllEntries();
        // todo: BUG: upon clear of v-select, other filters get ignored
      }
    },
  },
  computed: {
    itemsSearchQuery() {
      const searchQueryField = this.searchQueryField;
      return this.getAllUniqueValuesFromArr(searchQueryField);
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
    searchQueryField() {
      const filteredField = this.searchQueryField;
      if (filteredField == null) {
        this.$refs.selectSearchQuery.reset();
      }
    },
    searchQueryValue() {
      const desiredVal = this.searchQueryValue;
      const filteredField = this.searchQueryField;
      this.filterCards(desiredVal, filteredField);
    },
  },
};
</script>
<style></style>
