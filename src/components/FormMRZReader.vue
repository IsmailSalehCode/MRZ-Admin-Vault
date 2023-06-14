<template>
  <v-container style="max-width: 1000px">
    <v-card>
      <v-form ref="mrzForm" @submit.prevent>
        <v-card-title>
          <v-text-field
            label="Машинен код"
            v-model.trim="machineCode"
            class="mx-auto centered-input"
            variant="outlined"
            append-icon="mdi-close"
            @click:append="resetForm"
          ></v-text-field>
          <!-- TODO: :rules ; loading... -->
        </v-card-title>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      // mrzRules: require("../field-validation-rules/mrzRules"),
      machineCode: null,
    };
  },
  methods: {
    resetForm() {
      this.$refs.mrzForm.reset();
    },
  },
};
</script>
<style></style>
