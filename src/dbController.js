import { db } from "./db";

function getCurrentTimestamp() {
  return new Date().getTime();
}

function translateErr(err) {
  // returns Error containing a message in Bulgarian for the UI
  let bgErrMessage;
  switch (err.inner.code) {
    case 0:
      bgErrMessage = "Този документ е бил добавен вече.";
      break;
  }
  return Error(bgErrMessage);
}

async function addEntry(entry) {
  try {
    const newEntry = await db.mrzEntries.add({
      docNum: entry.docNum,
      surname: entry.surname,
      givenNames: entry.givenNames,
      type: entry.type,
      format: entry.format,
      issuingOrg: entry.issuingOrg,
      nationality: entry.nationality,
      sex: entry.sex,
      birthDate: entry.birthDate,
      expDate: entry.expDate,
      personalNum: entry.personalNum,
      optional1: entry.optional1,
      optional2: entry.optional2,
      notes: entry.notes,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    });
    return newEntry;
  } catch (err) {
    return translateErr(err);
  }
}

export { addEntry };
