// db.js
import Dexie from "dexie";

export const db = new Dexie("mainDB");
db.version(1).stores({
  mrzEntries:
    "&docNum, surname, givenNames, type, format, issuingOrg, nationality, sex, birthDate, expDate, personalNum, optional1, optional2, notes, createdAt, updatedAt",
});
// todo: add createdAt, updatedAt
