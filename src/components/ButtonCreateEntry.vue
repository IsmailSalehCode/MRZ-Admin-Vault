<template>
  <v-row justify="center" align="center">
    <v-col cols="12" v-if="alert.show">
      <v-alert density="compact" :type="alert.type">{{
        alert.message
      }}</v-alert>
    </v-col>
    <v-col cols="12" v-if="!alert.show">
      <v-btn variant="outlined" @click="insertNewEntry">Запази</v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { addEntry } from "../dbController.js";

export default {
  props: {
    entry: Object,
  },
  watch: {
    entry(newValue, oldValue) {
      if (newValue.mrzData.docNum != oldValue.mrzData.docNum) {
        // Когато имаме прочит на нов документ, да се рестартира състоянието/state на компонента
        // Когато потребителят прави промени по един entry (в бележките примерно), да не му се променя съобщението/alert-а.
        this.resetAlert();
      }
    },
  },
  data() {
    return {
      alert: {
        show: false,
        type: "",
        message: null,
      },
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
    handleSuccess(id) {
      this.alert = {
        show: true,
        type: "success",
        message: `Успешно добавен документ с №: ${id}`,
      };
    },
    async insertNewEntry() {
      const result = await addEntry(this.entry);
      if (result instanceof Error) {
        this.handleErr(result);
      } else {
        this.handleSuccess(result);
      }
    },
  },
};
</script>
<style></style>
<!-- IDBGR6480598530<<<<<<<<<<<<<<<9910115M2902278BGR9910116445<4SALEH<<ISMAIL<OSAMA<<<<<<<<<<< -->
<!-- P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<L898902C<3UTO6908061F9406236ZE184226B<<<<<14 -->
<!-- PPSYRSALEH<<OSAMA<<<<<<<<<<<<<<<<<<<<<<<<<<<0004254258XXB6311098M2903194<<<<<<<<<<<<<<08
   -->
<!-- P<BGRSALEH<<ISMAIL<OSAMA<<<<<<<<<<<<<<<<<<<<3852988692BGR9910115M23071059910116445<<<<80
   -->
