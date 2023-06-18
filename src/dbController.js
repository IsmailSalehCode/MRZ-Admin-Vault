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
    default:
      bgErrMessage = `Възникна неочаквана грешка: ${err.message}`;
      console.error(err);
  }
  return Error(bgErrMessage);
}

async function addEntry(entry) {
  const mrzData = entry.mrzData;
  const entryNotes = entry.notes;
  try {
    const newEntry = await db.mrzEntries.add({
      docNum: mrzData.docNum,
      surname: mrzData.surname,
      givenNames: mrzData.givenNames,
      type: mrzData.type,
      format: mrzData.format,
      issuingOrg: mrzData.issuingOrg,
      nationality: mrzData.nationality,
      sex: mrzData.sex,
      birthDate: mrzData.birthDate,
      expDate: mrzData.expDate,
      personalNum: mrzData.personalNum,
      optional1: mrzData.optional1,
      optional2: mrzData.optional2,
      notes: entryNotes,
      updatedAt: getCurrentTimestamp(),
    });
    return newEntry;
  } catch (err) {
    return translateErr(err);
  }
}

async function getAllEntries() {
  try {
    const entries = await db.mrzEntries.toArray();
    return entries;
  } catch (err) {
    return translateErr(err);
  }
}

async function clearAllEntries() {
  await db.mrzEntries
    .clear()
    .then(() => {
      console.log("Data cleared successfully.");
    })
    .catch((error) => {
      console.error("Failed to clear data:", error);
    });
}

export { addEntry, clearAllEntries, getAllEntries };
