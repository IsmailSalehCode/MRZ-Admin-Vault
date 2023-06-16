<template>
  <!-- <div>{{ JSON.stringify(rData) }}</div> -->
  <v-card elevation="1" variant="outlined" rounded="lg">
    <v-card-title>{{ mData.surname }}, {{ mData.givenNames }}</v-card-title>
    <v-card-subtitle>Фамилия, дадени имена</v-card-subtitle>
    <v-card-text>
      <v-row justify="center">
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 800px"
            class="mx-auto"
            label="Тип на документа"
            v-model="mData.type"
            readonly
          >
            <v-tooltip activator="parent" location="end">
              {{ rData.type }}
            </v-tooltip>
          </v-text-field>
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 160px"
            class="mx-auto centered-input"
            label="Формат на документа"
            v-model.trim="mData.format"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 150px"
            class="mx-auto centered-input"
            label="№ на документа"
            v-model.trim="mData.docNum"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Издаваща държава или организация"
            v-model="mData.issuingOrg"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Националност"
            v-model="mData.nationality"
            readonly
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            style="max-width: 130px"
            class="mx-auto centered-input"
            label="Пол"
            v-model="mData.sex"
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
            v-model="mData.birthDate"
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
            v-model="mData.expDate"
            :hint="dateFieldHint"
            persistent-hint
          />
        </v-col>
        <v-col v-if="mData.personalNum" cols="12" md="4">
          <v-text-field
            readonly
            class="mx-auto centered-input"
            style="max-width: 170px"
            label="ЕГН/Личен номер"
            v-model="mData.personalNum"
          />
        </v-col>
        <v-col
          v-if="mData.optional1"
          cols="12"
          md="6"
          style="max-width: fit-content"
        >
          <v-text-field
            class="mx-auto centered-input"
            label="Незадължителни данни 1ви ред"
            v-model.trim="mData.optional1"
            readonly
          />
        </v-col>
        <v-col
          v-if="mData.optional2"
          cols="12"
          md="6"
          style="max-width: fit-content"
        >
          <v-text-field
            class="mx-auto centered-input"
            label="Незадължителни данни 2ри ред"
            v-model.trim="mData.optional2"
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
            v-model.trim="notes"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import CountryCodes from "../ICAO-constants/CountryCodes.json";
import DocumentTypes from "../ICAO-constants/DocumentTypes.json";
import SexCodes from "../ICAO-constants/SexCodes.json";

export default {
  props: {
    // rData = render data
    rData: Object,
  },
  data() {
    return {
      dateFieldHint: "Година-Месец-Ден",
      notes: null,
    };
  },
  methods: {
    translateDocType(type) {
      const result = DocumentTypes[type.toString()];
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
    mData() {
      // mData = modified data (to be human-readable)
      const surname = this.rData.surname;
      const givenNames = this.rData.givenNames;
      const type = this.translateDocType(this.rData.type);
      const format = this.rData.format;
      const docNum = this.rData.docNum;
      const issuingOrg = this.translateCountryCode(this.rData.issuingOrg);
      const nationality = this.translateCountryCode(this.rData.nationality);
      const sex = this.translateSexCode(this.rData.sex);
      const birthDate = this.rData.birthDate;
      const expDate = this.rData.expDate;
      const personalNum = this.rData.personalNum;
      const optional1 = this.rData.optional1;
      const optional2 = this.rData.optional2;

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
