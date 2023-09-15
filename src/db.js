// db.js
import Dexie from "dexie";

export const db = new Dexie("mainDB");
db.version(2).stores({
  mrzEntries:
    "&docNum, surname, givenNames, type, format, issuingOrg, nationality, sex, birthDate, expDate, personalNum, optional1, optional2, notes, updatedAt, collectionId",
  collections: "++id,name",
});
