import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

const VacationRequest = sequelize.define(
  "VacationRequest",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
      allowNull: false,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      // Index on user_id for efficient user-specific queries
      {
        fields: ["user_id"],
        name: "idx_vacation_request_user_id",
      },
      // Index on status for efficient status filtering
      {
        fields: ["status"],
        name: "idx_vacation_request_status",
      },
      // Composite index for filtering by status and sorting by created_at
      {
        fields: ["status", "created_at"],
        name: "idx_vacation_request_status_created",
      },
    ],
  }
);

VacationRequest.belongsTo(User, { foreignKey: "user_id" });

export default VacationRequest;
