/**
 * User Roles
 */
export const USER_ROLES = {
  REQUESTER: 'Requester',
  VALIDATOR: 'Validator',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Vacation Request Status
 */
export const REQUEST_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

