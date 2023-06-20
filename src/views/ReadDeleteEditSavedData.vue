<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container cols="12" v-if="alert.show">
    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
  </v-container>
  <v-container fluid>
    <v-data-table
      no-data-text="Няма данни."
      loading-text="Зареждат се данните."
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
      <template v-slot:item.birthDate="{ item }">
        {{ convertYYMMDD_toBG(item.columns.birthDate) }}
      </template>
      <template v-slot:item.expDate="{ item }">
        {{ convertYYMMDD_toBG(item.columns.expDate) }}
      </template>
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
  <DialogEditSavedData ref="edit_dialog" :card-doc-num="selected[0]" />
</template>
<script>
import { getAllEntries, deleteEntries } from "@/dbController";
import DialogEditSavedData from "@/components/DialogEditSavedData.vue";
export default {
  components: {
    DialogEditSavedData,
  },
  data() {
    return {
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
    };
  },
  methods: {
    convertYYMMDD_toBG(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year} г.`;
    },
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
      // end of reset values
      if (len == 1) {
        this.isOneSelected = true;
      }
      if (len >= 1) {
        this.isAtLeastOneSelected = true;
      }
    },
  },
};
</script>
<style></style>
