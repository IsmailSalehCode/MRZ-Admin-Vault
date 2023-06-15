<template>
  <div>{{ JSON.stringify(rdata) }}</div>
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
            <!-- <template v-slot:append>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                </template>
                {{ rdata.type }}
              </v-tooltip>
            </template> -->
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    rdata: Object,
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
      const surname = this.rdata.surname;
      const givenNames = this.rdata.givenNames;
      const type = this.translateDocType(this.rdata.type);
      return { surname, givenNames, type };
    },
  },
};
</script>
<style></style>
