import { db } from "./db";

function getCurrentTimestamp() {
  return new Date().getTime();
}

function translateErr(err) {
  console.log("Err in translateErr:");
  console.error(err);
  // returns Error containing a message in Bulgarian for the UI
  let bgErrMessage;
  switch (err.inner.message) {
    case "Key already exists in the object store.":
      bgErrMessage = "Засечен опит за добавяне на съществуващ запис.";
      break;
    case "Failed to execute 'add' on 'IDBObjectStore': Evaluating the object store's key path did not yield a value.":
      bgErrMessage = "Засечен опит за добавяне на невалиден запис.";
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

      const collectionWithEntryCount = {
        id: iterCollection.id,
        name: iterCollection.name,
        itemCount: entryCount,
      };

      collectionsWithEntryCount.push(collectionWithEntryCount);
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
async function deleteCollections(ids) {
  const toDelCollectionIds = ids;

  try {
    for (let i = 0; i < toDelCollectionIds.length; i++) {
      const iterCollectionId = toDelCollectionIds[i];

      // remove all docs from collection
      const docsToRelease = await db.mrzEntries
        .where("collectionId")
        .equals(iterCollectionId)
        .toArray();
      docsToRelease.forEach((doc) => {
        doc.collectionId = null;
      });
      await db.mrzEntries.bulkPut(docsToRelease);

      // delete collection
      await db.collections.delete(iterCollectionId);
    }
    return 1;
  } catch (err) {
    return translateErr(err);
  }
}

async function getEntriesByIds(ids) {
  const toFetch = ids;
  const result = [];
  try {
    for (let i = 0; i < toFetch.length; i++) {
      const iterId = toFetch[i];
      const iterEntry = await db.mrzEntries.get(iterId);
      if (iterEntry) {
        result.push(iterEntry);
      }
    }
    return result;
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

async function importEntry(entry) {
  try {
    // reset collectionId key. Will work even if entry is an invalid doc.
    entry.collectionId = null;

    const newEntry = await db.mrzEntries.add(entry);
    return newEntry;
  } catch (err) {
    return translateErr(err);
  }
}

export {
  addEntry,
  getAllEntries,
  deleteEntries,
  getEntryNotesById,
  updateEntryNotesById,
  isNotesUpdateRedundant,
  addNewCollection,
  getAllCollections,
  getAllEntriesFromCollection,
  updateEntriesCollection,
  getAllCollectionsWithEntryCount,
  deleteCollections,
  getEntriesByIds,
  importEntry,
};
