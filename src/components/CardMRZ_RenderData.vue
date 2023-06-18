<template>
  <v-card elevation="1" variant="outlined" rounded="lg">
    <v-card-title>{{ uiData.surname }}, {{ uiData.givenNames }}</v-card-title>
    <v-card-subtitle>Фамилия, дадени имена</v-card-subtitle>
    <v-card-text>
      <v-row justify="center">
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 800px"
            class="mx-auto"
            label="Тип на документа"
            v-model="uiData.type"
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 160px"
            class="mx-auto centered-input"
            label="Формат на документа"
            v-model.trim="uiData.format"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 150px"
            class="mx-auto centered-input"
            label="№ на документа"
            v-model.trim="uiData.docNum"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Издаваща държава или организация"
            v-model="uiData.issuingOrg"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Националност"
            v-model="uiData.nationality"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            style="max-width: 130px"
            class="mx-auto centered-input"
            label="Пол"
            v-model="uiData.sex"
            readonly
          />
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            prepend-inner-icon="mdi-cake-variant"
            readonly
            class="mx-auto centered-input"
            style="max-width: 170px"
            label="Дата на раждане"
            v-model="uiData.birthDate"
            :hint="dateFieldHint"
            persistent-hint
          />
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            prepend-inner-icon="mdi-calendar-remove"
            readonly
            class="mx-auto centered-input"
            style="max-width: 170px"
            label="Валидност"
            v-model="uiData.expDate"
            :hint="dateFieldHint"
            persistent-hint
          />
        </v-col>
        <v-col v-if="uiData.personalNum" cols="12" md="4">
          <v-text-field
            readonly
            class="mx-auto centered-input"
            style="max-width: 170px"
            label="ЕГН/Личен номер"
            v-model="uiData.personalNum"
          />
        </v-col>
        <v-col
          v-if="uiData.optional1"
          cols="12"
          md="6"
          style="max-width: fit-content"
        >
          <v-text-field
            class="mx-auto centered-input"
            label="Незадължителни данни 1ви ред"
            v-model.trim="uiData.optional1"
            readonly
          />
        </v-col>
        <v-col
          v-if="uiData.optional2"
          cols="12"
          md="6"
          style="max-width: fit-content"
        >
          <v-text-field
            class="mx-auto centered-input"
            label="Незадължителни данни 2ри ред"
            v-model.trim="uiData.optional2"
            persistent-hint
            hint="ЕГН за български TD1 документи"
            readonly
          />
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-textarea
            variant="outlined"
            prepend-icon="mdi-notebook"
            clearable
            class="mx-auto"
            label="Бележки"
            hint="За редакция на съществуващ запис отидете в 'Запаметени карти'"
            v-model.trim="notes"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <ButtonCreateEntry
        :entry="{
          mrzData: mrzData,
          notes: this.notes,
        }"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import CountryCodes from "../ICAO-constants/CountryCodes.json";
import DocumentTypes from "../ICAO-constants/DocumentTypes.json";
import SexCodes from "../ICAO-constants/SexCodes.json";
import ButtonCreateEntry from "./ButtonCreateEntry.vue";

export default {
  props: {
    mrzData: Object,
  },
  components: { ButtonCreateEntry },
  data() {
    return {
      dateFieldHint: "Година-Месец-Ден",
      notes: null,
    };
  },
  methods: {
    translateDocType(type) {
      let result = DocumentTypes[type.toString()];
      if (result == null) {
        //Reason: i.e. P indicates the document is a passport. One additional character may be used to further identify the document at the discretion of the issuing State [https://developers.mobbeel.com/docs/mobbscan-icao-document-types/]. That means that if i have a 'PA', I would still want to indicate that it is a passport. DocumentTypes would return null.
        const firstChar = type.charAt(0);
        const secondChar = type.charAt(1);
        result = DocumentTypes[firstChar];
        result = result.concat(", " + secondChar);
      }
      return result;
    },
    translateCountryCode(countryCode) {
      const result = CountryCodes[countryCode.toString()];
      return result;
    },
    translateSexCode(sexCode) {
      const result = SexCodes[sexCode.toString()];
      return result;
    },
  },
  computed: {
    uiData() {
      // uiData = user interface data (to be displayed)
      const surname = this.mrzData.surname;
      const givenNames = this.mrzData.givenNames;
      const type = this.translateDocType(this.mrzData.type);
      const format = this.mrzData.format;
      const docNum = this.mrzData.docNum;
      const issuingOrg = this.translateCountryCode(this.mrzData.issuingOrg);
      const nationality = this.translateCountryCode(this.mrzData.nationality);
      const sex = this.translateSexCode(this.mrzData.sex);
      const birthDate = this.mrzData.birthDate;
      const expDate = this.mrzData.expDate;
      const personalNum = this.mrzData.personalNum;
      const optional1 = this.mrzData.optional1;
      const optional2 = this.mrzData.optional2;

      return {
        surname,
        givenNames,
        type,
        format,
        docNum,
        issuingOrg,
        nationality,
        sex,
        birthDate,
        expDate,
        personalNum,
        optional1,
        optional2,
      };
    },
  },
};
</script>
<style></style>
