<template>
  <v-container style="max-width: 1000px">
    <v-card>
      <v-form ref="mrzForm" @submit.prevent>
        <v-card-title>
          <v-text-field
            label="Машинен код"
            v-model.trim="machineCode"
            :rules="[mrzRules.validLength, mrzRules.validCharacters]"
            class="mx-auto centered-input"
            variant="outlined"
            append-icon="mdi-close"
            @click:append="resetForm"
            :loading="loadingMachineCodeRead"
          ></v-text-field>
          <!-- TODO: loading... -->
        </v-card-title>
      </v-form>
      <!-- output from mrz processing below -->
      <!-- <v-card-text v-if=""></v-card-text> -->
    </v-card>
  </v-container>
</template>
<script>
import _mrzRules from "../field-validation-rules/mrzRules";
import _NaNCharValues from "../ICAO-constants/NaNCharValues";

export default {
  data() {
    return {
      mrzRules: _mrzRules,
      NaNCharValues: _NaNCharValues,
      machineCode: null,
      loadingMachineCodeRead: false,
    };
  },
  methods: {
    resetForm() {
      this.$refs.mrzForm.reset();
    },
    resetMRZData() {
      this.mrzData = {
        info: [],
        mrz: null,
        format: null,
        type: null,
        issuingOrg: null,
        surname: null,
        givenNames: null,
        docNum: null,
        nationality: null,
        birthDate: null,
        sex: null,
        expDate: null,
        personalNum: null,
        optional1: null,
        optional2: null,
      };
    },
    indicate_MRZ_is_being_read() {
      this.loadingCodeRead = true;
    },
    indicate_MRZ_finished_read() {
      this.loadingCodeRead = false;
    },
    determine_MRZ_Type_and_Parse() {
      if (this.$refs.mrzForm.validate) {
        switch (this.machineCode.length) {
          case 90:
            this.parseType1();
            break;
          case 72:
            this.parseType2();
            break;
          case 88:
            this.parseType3();
            break;
        }
      }
    },
  },
  watch: {
    machineCode() {
      this.resetMRZData();
      if (this.machineCode != null) {
        this.indicate_MRZ_is_being_read();
        this.determine_MRZ_Type_and_Parse();
        this.indicate_MRZ_finished_read();
      }
    },
  },
};
</script>
<style></style>
