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
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    // rData = render data
    rData: Object,
  },
  methods: {
    translateDocType(type) {
      let result;
      type = type.toString().trim();
      switch (type) {
        case "I":
          result = "Идентификационен документ";
          break;
        case "ID":
          result = "Лична карта";
          break;
        case "IP":
          result = "Паспортна карта";
          break;
        case "P":
          result = "Паспорт";
          break;
        case "V":
          result = "Виза";
          break;
        case "AC":
          result = "Сертификат за член на екипаж";
          break;
        default:
          result = "Неразпознат";
          break;
      }
      return result;
    },
  },
  computed: {
    mData() {
      // mData = modified data (to be human-readable)
      const surname = this.rData.surname;
      const givenNames = this.rData.givenNames;
      const type = this.translateDocType(this.rData.type);
      return { surname, givenNames, type };
    },
  },
};
</script>
<style></style>
