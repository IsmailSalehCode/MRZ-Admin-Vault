const validLength = (v) =>
  (v && [90, 72, 88].includes(v.toString().length)) || "Невалидна дължина";

const validCharacters = (v) =>
  (v && !/[^A-Z\d<]/g.test(v)) || "Невалидни символи и/или език на букви";

export default { validLength, validCharacters };
