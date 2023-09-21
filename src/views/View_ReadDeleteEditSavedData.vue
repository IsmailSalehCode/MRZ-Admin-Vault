<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <ContainerIterCollections v-model="selectedCollection" />
  <v-container style="max-width: 700px">
    <v-select
      hide-details
      :no-data-text="noDataText"
      :loading-text="loadingText"
      v-model="searchQueryField"
      placeholder="🔍 Избери поле"
      :items="headers"
      item-title="title"
      item-value="key"
      clearable
    ></v-select>
    <v-expand-transition>
      <v-select
        hide-details
        v-show="searchQueryFieldIsNotNull"
        :no-data-text="noDataText"
        :loading-text="loadingText"
        v-model="searchQueryValue"
        placeholder="Налични стойности"
        :items="itemsSearchQuery"
        ref="selectSearchQuery"
        clearable
      ></v-select>
    </v-expand-transition>
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
  <v-container fluid class="mx-3">
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
      <v-col>
        <v-btn
          icon="mdi-folder-swap"
          color="info"
          :disabled="!isAtLeastOneSelected"
          @click="changeSelectedDocsCollection"
        ></v-btn>
      </v-col>
      <v-col>
        <v-btn
          icon="mdi-export"
          :loading="loadingExport"
          @click="exportSelected"
          :disabled="!isAtLeastOneSelected"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
  <DialogEditSavedData
    @display-updated-data="getEntries"
    ref="edit_dialog"
    :card-doc-num="selected[0]"
  />
  <DialogChangeDocsCollection
    @display-updated-data="getEntries"
    ref="move_dialog"
    :docs="selected"
  />
</template>
<script>
import {
  getAllEntries,
  deleteEntries,
  getAllEntriesFromCollection,
  getEntriesByIds,
} from "../dbController";
import DialogEditSavedData from "../components/DialogEditSavedData.vue";
import DialogChangeDocsCollection from "../components/DialogChangeDocsCollection.vue";
import {
  expandDocType,
  expandCountryCode,
  expandSexCode,
  convertYYMMDD_toBG,
  convertTimestampToLocaleDatetime,
  indicateIfEmpty,
} from "../readabilityFuncs";
import ContainerIterCollections from "../components/ContainerIterCollections.vue";
import { exportToJSON } from "../exportToJSON";

export default {
  mounted() {
    if (this.alert.show == true) {
      this.resetAlert();
    }
    this.getEntries();
  },
  components: {
    DialogEditSavedData,
    ContainerIterCollections,
    DialogChangeDocsCollection,
  },
  data() {
    return {
      loadingExport: false,
      selectedCollection: null,
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
        type: "info",
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
    async exportSelected() {
      this.loadingExport = true;
      const selectedIdsArr = this.selected;
      const selected = await getEntriesByIds(selectedIdsArr);
      if (selected instanceof Error) {
        this.handleErr(selected);
        return;
      }
      //worked
      const exportPath = "C:\\Users\\gamer\\Desktop\\astro test\\test.json";
      const exportOperation = exportToJSON(selected, exportPath);
      if (exportOperation instanceof Error) {
        this.handleErr(exportOperation);
        return;
      }
      this.loadingExport = false;
    },
    changeSelectedDocsCollection() {
      this.$refs.move_dialog.open();
    },
    resetAlert() {
      this.alert = {
        show: false,
        type: "info",
        message: null,
      };
    },
    cancelLoadingAnimations() {
      this.loadingExport == true ? (this.loadingExport = false) : "";
      this.loadingCards == true ? (this.loadingCards = false) : "";
    },
    handleErr(err) {
      this.cancelLoadingAnimations();
      this.alert = {
        show: true,
        type: "error",
        message: err.message,
      };
    },
    resetArrSelected() {
      this.selected = [];
    },
    async getEntries() {
      this.loadingCards = true;
      let result;
      const collectionId = this.selectedCollection;
      if (!collectionId) {
        result = await getAllEntries();
      } else {
        result = await getAllEntriesFromCollection(collectionId);
      }
      if (!(result instanceof Error)) {
        this.cards = this.improveReadability(result);
        this.resetArrSelected();
      } else {
        this.handleErr(result);
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
        this.getEntries();
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
      if (query != null) {
        this.cards = this.cards.filter((c) => c[filteredField] == query);
      } else {
        this.getEntries();
      }
    },
    resetSearch() {
      this.searchQueryValue = null;
      this.searchQueryField = null;
    },
  },
  computed: {
    searchQueryFieldIsNotNull() {
      return this.searchQueryField != null;
    },
    itemsSearchQuery() {
      const searchQueryField = this.searchQueryField;
      return this.getAllUniqueValuesFromArr(searchQueryField);
    },
  },
  watch: {
    selectedCollection() {
      // console.log(this.selectedCollection);
      // reset search interactions
      this.resetSearch();

      this.getEntries();
    },
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
