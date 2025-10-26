import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { USER_ROLES } from "../constants";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(USER_ROLES.REQUESTER, USER_ROLES.VALIDATOR),
    allowNull: false,
  },
});

export default User;
