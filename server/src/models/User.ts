import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Requester", "Validator"),
    allowNull: false,
  },
});

export default User;
