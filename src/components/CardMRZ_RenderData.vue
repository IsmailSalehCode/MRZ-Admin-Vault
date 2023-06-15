<template>
  <div>{{ JSON.stringify(rData) }}</div>
  <v-card variant="outlined" rounded="xl">
    <v-card-title>{{ mData.surname }}, {{ mData.givenNames }}</v-card-title>
    <v-card-subtitle>Фамилия, дадени имена</v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="4">
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
        <v-col cols="4">
          <v-text-field
            style="max-width: 150px"
            class="mx-auto centered-input"
            label="Формат на документа"
            v-model.trim="mData.format"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            style="max-width: 150px"
            class="mx-auto centered-input"
            label="№ на документа"
            v-model.trim="mData.docNum"
            readonly
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Издаваща държава или организация"
            v-model="mData.issuingOrg"
            readonly
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Националност"
            v-model="mData.nationality"
            readonly
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            style="max-width: 90px"
            class="mx-auto centered-input"
            label="Пол"
            v-model="mData.sex"
            readonly
          />
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

      return {
        surname,
        givenNames,
        type,
        format,
        docNum,
        issuingOrg,
        nationality,
        sex,
      };
    },
  },
};
</script>
<style></style>
