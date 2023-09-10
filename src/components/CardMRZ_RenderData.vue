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
            hide-details
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
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            style="max-width: 150px"
            class="mx-auto centered-input"
            label="№ на документа"
            v-model.trim="uiData.docNum"
            readonly
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Издаваща държава или организация"
            v-model="uiData.issuingOrg"
            readonly
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            class="mx-auto centered-input"
            label="Националност"
            v-model="uiData.nationality"
            readonly
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            style="max-width: 130px"
            class="mx-auto centered-input"
            label="Пол"
            v-model="uiData.sex"
            readonly
            hide-details
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
            hide-details
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
            hide-details
          />
        </v-col>
        <v-col v-if="uiData.personalNum" cols="12" md="4">
          <v-text-field
            readonly
            class="mx-auto centered-input"
            style="max-width: 170px"
            label="ЕГН/Личен номер"
            v-model="uiData.personalNum"
            hide-details
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
            hide-details
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
            prepend-icon="mdi-note"
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
import ButtonCreateEntry from "./ButtonCreateEntry.vue";
import {
  expandDocType,
  expandCountryCode,
  expandSexCode,
  convertYYMMDD_toBG,
} from "@/readabilityFuncs";

export default {
  props: {
    mrzData: Object,
  },
  components: { ButtonCreateEntry },
  data() {
    return {
      notes: null,
    };
  },
  computed: {
    uiData() {
      // uiData = user interface data (to be displayed)
      /**
       * Защо uiData е отделето от mrzData, при положение че има прилики?
       * Защото в бъдеще се очаква да има още повече промени по начина, по който се интерпретират данните, извлечени от MRZ (mrzData в случая)
       */
      const surname = this.mrzData.surname;
      const givenNames = this.mrzData.givenNames;
      const type = expandDocType(this.mrzData.type);
      const format = this.mrzData.format;
      const docNum = this.mrzData.docNum;
      const issuingOrg = expandCountryCode(this.mrzData.issuingOrg);
      const nationality = expandCountryCode(this.mrzData.nationality);
      const sex = expandSexCode(this.mrzData.sex);
      const birthDate = convertYYMMDD_toBG(this.mrzData.birthDate);
      const expDate = convertYYMMDD_toBG(this.mrzData.expDate);
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
