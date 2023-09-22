const defTxtRules = [
  (v) => !!v || "Не може да е празно!",
  (v) => (v && v.length > 2) || "Трябва да съдържа минимум 3 символа!",
];

export { defTxtRules };
