module.exports = {
  validLength: (v) =>
    (v && [90, 72, 88].includes(v.toString().length)) || "Невалидна дължина",
  noBulgarian: (v) => (v && !/[А-Я]/gi.test(v)) || "Кирилицата е забранена",
  validCharacters: (v) =>
    (v && !/[^A-Z\d<]/g.test(v)) || "Невалидни символи и/или език на букви",
};
