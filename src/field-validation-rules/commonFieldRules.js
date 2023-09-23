const required = (v) => !!v || "Не може да е празно!";
function minLength(minNum) {
  return (v) => (v || "").toString().length >= minNum || "Твърде късо!";
}
// const defTxtRules = [
//   ,
//   (v) => (v && v.length > 2) || "Трябва да съдържа минимум 3 символа!",
// ];

export { required, minLength };
