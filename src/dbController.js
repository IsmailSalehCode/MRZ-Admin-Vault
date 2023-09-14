import { db } from "./db";

function getCurrentTimestamp() {
  return new Date().getTime();
}

function translateErr(err) {
  // FOR DEV TODO: DELETE WHEN DONE
  console.log("Err in translateErr:");
  console.error(err);
  // returns Error containing a message in Bulgarian for the UI
  let bgErrMessage;
  switch (err.inner.message) {
    case "Key already exists in the object store.":
      bgErrMessage = "Този документ е бил добавен вече.";
      break;
    default:
      bgErrMessage = `Възникна неочаквана грешка: ${err.message}`;
  }
  return Error(bgErrMessage);
}

async function addNewCollection(collection) {
  const data = collection;
  try {
    await db.collections.add({
      name: data.name,
      color: data.color,
    });
  } catch (err) {
    return translateErr(err);
  }
}

async function getAllCollections() {
  try {
    const collections = await db.collections.toArray();
    return collections;
  } catch (err) {
    return translateErr(err);
  }
}

async function getAllCollectionsWithEntryCount() {
  try {
    const collections = await getAllCollections();
    const collectionsWithEntryCount = [];

    for (let i = 0; i < collections.length; i++) {
      const iterCollection = collections[i];
      const entryCount = await db.mrzEntries
        .where("collectionId")
        .equals(iterCollection.id)
        .count();

      const collectionWithCount = {
        id: iterCollection.id,
        name: iterCollection.name,
        itemCount: entryCount,
      };

      collectionsWithEntryCount.push(collectionWithCount);
    }

    return collectionsWithEntryCount;
  } catch (err) {
    return translateErr(err);
  }
}

async function addEntry(entry) {
  const mrzData = entry.mrzData;
  const entryNotes = entry.notes;
  const entryCollectionId = entry.collectionId;
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
      collectionId: entryCollectionId,
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

async function getAllEntriesFromCollection(collectionId) {
  try {
    const entries = await db.mrzEntries
      .where("collectionId")
      .equals(collectionId)
      .toArray();
    return entries;
  } catch (err) {
    return translateErr(err);
  }
}

async function updateEntriesCollection(entryDocNums, collectionId) {
  const targetCollectionId = collectionId;
  try {
    const docsToUpdate = await db.mrzEntries
      .where("docNum")
      .anyOf(entryDocNums)
      .toArray();

    docsToUpdate.forEach((doc) => {
      doc.collectionId = targetCollectionId;
    });

    await db.mrzEntries.bulkPut(docsToUpdate);
  } catch (err) {
    return translateErr(err);
  }
}

async function deleteEntries(entryDocNums) {
  try {
    const result = await db.mrzEntries.bulkDelete(entryDocNums);
    return result;
  } catch (err) {
    return translateErr(err);
  }
}

async function getEntryNotesById(docNum) {
  const entry = await db.mrzEntries.get(docNum);
  if (entry) {
    return entry["notes"];
  }
  return Error("Документът не съществува.");
}

async function updateEntryNotesById(docNum, newNotes) {
  const currentTimestamp = getCurrentTimestamp();
  try {
    const result = await db.mrzEntries.update(docNum, {
      notes: newNotes,
      updatedAt: currentTimestamp,
    });
    return result;
  } catch (err) {
    return translateErr(err);
  }
}

async function isNotesUpdateRedundant(docNum, inputNotes) {
  const existingNotes = await getEntryNotesById(docNum);
  if (existingNotes == inputNotes) {
    return true;
  }
  return false;
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

async function addAllEntries() {
  const entries = [
    {
      docNum: "1",
      surname: "Lancelot",
      givenNames: "Gary Smith",
      type: "AC",
      format: "TD1",
      issuingOrg: "GBR",
      nationality: "JAM",
      sex: "M",
      birthDate: "98-01-02",
      expDate: "70-05-12",
      personalNum: "Example personal num",
      optional1: "Example optional 1",
      optional2: "Example optional 2",
      notes: "Likes golfing",
      updatedAt: getCurrentTimestamp(),
    },
  ];
  await db.mrzEntries
    .bulkAdd(entries)
    .then(() => {
      console.log("Entries added successfully");
    })
    .catch((error) => {
      console.error("Error occurred while adding entries:", error);
    });
}

export {
  addEntry,
  clearAllEntries,
  getAllEntries,
  deleteEntries,
  addAllEntries,
  getEntryNotesById,
  updateEntryNotesById,
  isNotesUpdateRedundant,
  addNewCollection,
  getAllCollections,
  getAllEntriesFromCollection,
  updateEntriesCollection,
  getAllCollectionsWithEntryCount,
};
