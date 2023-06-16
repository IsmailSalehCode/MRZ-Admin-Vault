<template>
  <v-container style="max-width: 1015px">
    <v-card elevation="5" rounded="lg">
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
            :loading="loadingCodeRead"
          ></v-text-field>
        </v-card-title>
      </v-form>
      <!-- output from mrz processing below -->
      <!-- Check for mrzData != null is not effective. The mrzData object will NEVER be null, because it always has fields. -->
      <v-card-text v-if="mrzData.info.length !== 0">
        <!-- Checking for mrzData.info.length!=0, because it's the first thing AlertMRZInfo.vue works with. -->
        <AlertMRZInfo :mrzInfo="mrzData.info" />
      </v-card-text>
      <v-card-text v-if="mrzData.type != null">
        <!-- Checking for mrzData.type!=null, because it's the first thing CardMRZ_RenderData.vue works with. -->
        <CardMRZ_RenderData :rData="mrzData" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import _mrzRules from "../field-validation-rules/mrzRules";
import _NaNCharValues from "../ICAO-constants/NaNCharValues";
import AlertMRZInfo from "./AlertMRZInfo.vue";
import CardMRZ_RenderData from "./CardMRZ_RenderData.vue";

export default {
  components: {
    AlertMRZInfo,
    CardMRZ_RenderData,
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
  data() {
    return {
      mrzRules: _mrzRules,
      NaNCharValues: _NaNCharValues,
      machineCode: null,
      loadingCodeRead: false,
      mrzData: {
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
      },
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
    alertInvalidDoc() {
      this.mrzData.info.push({
        type: "error",
        message:
          "Невалиден документ. Моля сканирайте отново или коригирайте ръчно.",
      });
    },
    convertAllToDigits(arr) {
      const charValues = this.NaNCharValues;
      for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
        if (/[^\d]/g.test(element)) {
          element = charValues.get(element);
          arr[i] = element;
        }
      }
      return arr;
    },
    alertTruncatedDocumentNumber(chars) {
      console.log("truncated docnumber", chars);
      this.mrzData.info.push({
        type: "info",
        message:
          "Документният номер е бил съкратен и продължава в полетата за допълнителни данни!",
      });
    },
    alertCheckSumSuccess() {
      this.mrzData.info.push({
        type: "success",
        message: "Успешен MRZ прочит!",
      });
    },
    alertCheckSumError() {
      this.mrzData.info.push({
        type: "warning",
        message:
          "Засечена е грешка спрямо контролните цифри. Моля сканирайте отново или коригирайте ръчно.",
      });
    },
    validCheckSum(chars, checkDigit) {
      if (checkDigit === "<") {
        //checkdigit has been truncated
        if (chars.match(/[^<]/g)) {
          //alert truncated document number, so return true
          this.alertTruncatedDocumentNumber(chars);
        }
        //checkdigit could have been truncated because all chars are "<", so return true
        return true;
      }
      let arr = chars.split("");
      arr = this.convertAllToDigits(arr);
      let multiplier = 7;
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        // console.log(element);
        switch (multiplier) {
          case 7:
            sum += element * multiplier;
            multiplier = 3;
            break;
          case 3:
            sum += element * multiplier;
            multiplier = 1;
            break;
          case 1:
            sum += element * multiplier;
            multiplier = 7;
            break;
        }
      }
      if (Number(sum % 10) === Number(checkDigit)) {
        return true;
      } else {
        return false;
      }
    },
    parseType1() {
      const result =
        /(?<type>(?!IC)[IAC]{1}(?!V)[A-Z<]{1})(?<issuing_org>[A-Z<]{3})(?<doc_num>[A-Z\d<]{9})(?<doc_num_check_digit>[\d<]{1})(?<first_row_optional_data>[A-Z\d<]{15})(?<birth_date>[\d]{6})(?<birth_date_check_digit>[\d]{1})(?<sex>[MF<]{1})(?<exp_date>[\d]{6})(?<exp_date_check_digit>[\d]{1})(?<nationality>[A-Z<]{3})(?<second_row_optional_data>[A-Z\d<]{11})(?<big_check_digit>[\d]{1})(?<names>[A-Z<]{30})/g.exec(
          this.machineCode
        );
      const format = "TD1";
      if (result) {
        if (
          this.validCheckSum(
            result.groups.doc_num,
            result.groups.doc_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.birth_date,
            result.groups.birth_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.exp_date,
            result.groups.exp_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.doc_num.concat(
              result.groups.doc_num_check_digit.concat(
                result.groups.first_row_optional_data.concat(
                  result.groups.birth_date.concat(
                    result.groups.birth_date_check_digit.concat(
                      result.groups.exp_date.concat(
                        result.groups.exp_date_check_digit.concat(
                          result.groups.second_row_optional_data
                        )
                      )
                    )
                  )
                )
              )
            ),
            result.groups.big_check_digit
          )
        ) {
          this.alertCheckSumSuccess();
        } else {
          this.alertCheckSumError();
        }
        //show result regardless of error in checksum calcs
        this.showResult(format, result.groups);
      } else {
        this.alertInvalidDoc();
      }
    },
    parseType2() {
      const firstLetter = this.machineCode.charAt(0);
      if (firstLetter === "V") {
        this.parseVisaB();
      } else {
        this.parseDefaultType2();
      }
    },
    parseDefaultType2() {
      const result =
        /(?<type>(?!IC)[IAC]{1}(?!V)[A-Z<]{1})(?<issuing_org>[A-Z<]{3})(?<names>[A-Z<]{31})(?<doc_num>[A-Z\d<]{9})(?<doc_num_check_digit>[\d<]{1})(?<nationality>[A-Z<]{3})(?<birth_date>[\d]{6})(?<birth_date_check_digit>[\d]{1})(?<sex>[MF<]{1})(?<exp_date>[\d]{6})(?<exp_date_check_digit>[\d]{1})(?<second_row_optional_data>[A-Z\d<]{7})(?<big_check_digit>[\d]{1})/g.exec(
          this.machineCode
        );
      const format = "TD2";
      if (result) {
        if (
          this.validCheckSum(
            result.groups.doc_num,
            result.groups.doc_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.birth_date,
            result.groups.birth_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.exp_date,
            result.groups.exp_date_check_digit
          ) &&
          //not sure about this big_check_digit checksum, yet (below this comment)
          this.validCheckSum(
            result.groups.doc_num.concat(
              result.groups.doc_num_check_digit.concat(
                result.groups.birth_date.concat(
                  result.groups.birth_date_check_digit.concat(
                    result.groups.exp_date.concat(
                      result.groups.exp_date_check_digit.concat(
                        result.groups.second_row_optional_data
                      )
                    )
                  )
                )
              )
            ),
            result.groups.big_check_digit
          )
        ) {
          this.alertCheckSumSuccess();
        } else {
          this.alertCheckSumError();
        }
        //show result regardless of error in checksum calcs
        this.showResult(format, result.groups);
      } else {
        this.alertInvalidDoc();
      }
    },
    parseVisaB() {
      const result =
        /(?<type>V[A-Z<]{1})(?<issuing_org>[A-Z<]{3})(?<names>[A-Z<]{31})(?<doc_num>[A-Z\d<]{9})(?<doc_num_check_digit>[\d]{1})(?<nationality>[A-Z<]{3})(?<birth_date>[\d]{6})(?<birth_date_check_digit>[\d]{1})(?<sex>[MF<]{1})(?<exp_date>[\d]{6})(?<exp_date_check_digit>[\d]{1})(?<second_row_optional_data>[A-Z\d<]{8})/g.exec(
          this.machineCode
        );
      const format = "TD2 MRV-B";
      if (result) {
        if (
          this.validCheckSum(
            result.groups.doc_num,
            result.groups.doc_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.birth_date,
            result.groups.birth_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.exp_date,
            result.groups.exp_date_check_digit
          )
        ) {
          this.alertCheckSumSuccess();
        } else {
          this.alertCheckSumError();
        }
        //show result regardless of error in checksum calcs
        this.showResult(format, result.groups);
      } else {
        this.alertInvalidDoc();
      }
    },
    parseType3() {
      const firstLetter = this.machineCode.charAt(0);
      if (firstLetter === "P") {
        this.parsePassport();
      } else if (firstLetter === "V") {
        this.parseVisaA();
      }
    },
    parseVisaA() {
      const result =
        /(?<type>V[A-Z<]{1})(?<issuing_org>[A-Z<]{3})(?<names>[A-Z<]{39})(?<doc_num>[A-Z\d<]{9})(?<doc_num_check_digit>[\d]{1})(?<nationality>[A-Z<]{3})(?<birth_date>[\d]{6})(?<birth_date_check_digit>[\d]{1})(?<sex>[MF<]{1})(?<exp_date>[\d]{6})(?<exp_date_check_digit>[\d]{1})(?<second_row_optional_data>[A-Z\d<]{16})/g.exec(
          this.machineCode
        );
      const format = "TD3 MRV-A";
      if (result) {
        if (
          this.validCheckSum(
            result.groups.doc_num,
            result.groups.doc_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.birth_date,
            result.groups.birth_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.exp_date,
            result.groups.exp_date_check_digit
          )
        ) {
          this.alertCheckSumSuccess();
        } else {
          this.alertCheckSumError();
        }
        //show result regardless of error in checksum calcs
        this.showResult(format, result.groups);
      } else {
        this.alertInvalidDoc();
      }
    },
    parsePassport() {
      const result =
        /(?<type>P[A-Z<]{1})(?<issuing_org>[A-Z<]{3})(?<names>[A-Z<]{39})(?<doc_num>[A-Z\d<]{9})(?<doc_num_check_digit>[\d]{1})(?<nationality>[A-Z<]{3})(?<birth_date>[\d]{6})(?<birth_date_check_digit>[\d]{1})(?<sex>[MF<]{1})(?<exp_date>[\d]{6})(?<exp_date_check_digit>[\d]{1})(?<personal_num>[A-Z\d<]{14})(?<personal_num_check_digit>[\d<]{1})(?<big_check_digit>[\d]{1})/g.exec(
          this.machineCode
        );
      const format = "TD3 PASSPORT";
      if (result) {
        if (
          this.validCheckSum(
            result.groups.doc_num,
            result.groups.doc_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.birth_date,
            result.groups.birth_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.exp_date,
            result.groups.exp_date_check_digit
          ) &&
          this.validCheckSum(
            result.groups.personal_num,
            result.groups.personal_num_check_digit
          ) &&
          this.validCheckSum(
            result.groups.doc_num.concat(
              result.groups.doc_num_check_digit.concat(
                result.groups.birth_date.concat(
                  result.groups.birth_date_check_digit.concat(
                    result.groups.exp_date.concat(
                      result.groups.exp_date_check_digit.concat(
                        result.groups.personal_num.concat(
                          result.groups.personal_num_check_digit
                        )
                      )
                    )
                  )
                )
              )
            ),
            result.groups.big_check_digit
          )
        ) {
          this.alertCheckSumSuccess();
        } else {
          this.alertCheckSumError();
        }
        //show result regardless of error in checksum calcs
        this.showResult(format, result.groups);
      } else {
        this.alertInvalidDoc();
      }
    },
    showResult(format, data) {
      //Unsupported missing dates from travel documents: If all or part of the date of birth is unknown, the relevant character positions shall be completed with filler characters (<).
      //make sure all regex have the same group names!!!
      console.log(format, data);
      this.mrzData.format = format;
      this.mrzData.mrz = this.machineCode;
      this.mrzData.type = this.removeFiller(data.type);
      // -TODO verify it all works
      this.mrzData.issuingOrg = data.issuing_org;
      //===================================
      this.extractNames(data.names);
      this.mrzData.docNum = this.removeFiller(data.doc_num);
      // -TODO verify it all works
      this.mrzData.nationality = data.nationality;
      //===================================
      this.mrzData.birthDate = this.toDate(data.birth_date);
      // -TODO verify it all works
      this.mrzData.sex = data.sex;
      //===================================
      this.mrzData.expDate = this.toDate(data.exp_date);
      //re6enie pri printvane: ako ima null poleta, ne se rendervat
      if (
        data.first_row_optional_data &&
        this.removeFiller(data.first_row_optional_data) != ""
      ) {
        this.mrzData.optional1 = this.removeFiller(
          data.first_row_optional_data
        );
      }
      if (
        data.second_row_optional_data &&
        this.removeFiller(data.second_row_optional_data) != ""
      ) {
        this.mrzData.optional2 = this.removeFiller(
          data.second_row_optional_data
        );
      }
      if (data.personal_num && this.removeFiller(data.personal_num) != "") {
        this.mrzData.personalNum = this.removeFiller(data.personal_num);
      }
      //ctrl+f ?! и се подсигури че regex-ите наистина са така, защото има разминаване с https://www.doubango.org/SDKs/mrz/docs/MRZ_formats.html
      //виж според основната документация къде check-digitовете могат да са '<'
      //Засега: Check digit-овете могат да са '<' при TD2 doc_num_check_digit, TD1 doc_num_check_digit
      console.log("mrzdata->", this.mrzData);
    },
    toDate(str) {
      str = str.split("");
      let yearDigits = str[0] + str[1];
      const monthDigits = str[2] + str[3];
      const dayDigits = str[4] + str[5];

      return (
        yearDigits.toString() +
        "-" +
        monthDigits.toString() +
        "-" +
        dayDigits.toString()
      );
    },
    extractNames(str) {
      str = str.split(/<</g);
      this.mrzData.surname = str[0];
      this.mrzData.givenNames = str[1].replaceAll(/</g, " ").trim();
    },
    removeFiller(str) {
      const result = str.replaceAll(/</g, "");
      return result;
    },
  },
};
</script>
<style>
.centered-input input {
  text-align: center;
}
</style>
