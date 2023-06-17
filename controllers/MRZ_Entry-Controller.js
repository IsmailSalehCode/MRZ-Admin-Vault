const { MRZ_Entry } = require("../DB/config");

async function createEntry(entry) {
  try {
    const newEntry = await MRZ_Entry.create(entry);
    console.log("Created: ", newEntry.toJSON());
  } catch (err) {
    console.error(err);
  }
}

module.exports = { createEntry };
