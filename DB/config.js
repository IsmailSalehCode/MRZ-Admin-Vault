const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Relative path to the SQLite database file
});

const MRZ_Entry = sequelize.define("MRZ_Entry", {
  surname: {
    type: DataTypes.STRING(39),
    allowNull: false,
  },
  givenNames: {
    type: DataTypes.STRING(39),
    allowNull: false,
  },
  docType: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  docFormat: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  docNum: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  docIssuingOrg: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  sex: {
    type: DataTypes.STRING(1),
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allownull: false,
  },
  docExpDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  personalNum: {
    type: DataTypes.STRING,
    allowNull: true,
    /** according to the International Civil Aviation Organization (ICAO) standards for Machine Readable Travel Documents (MRTDs), the personal number field in the Machine Readable Zone (MRZ) is an optional field. This means that it can be left blank or be absent from the MRZ altogether. */
  },
  optional1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  optional2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { sequelize, MRZ_Entry };
