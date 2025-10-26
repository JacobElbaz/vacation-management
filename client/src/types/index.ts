import { REQUEST_STATUS, USER_ROLES } from "../constants";

export type VacationRequest = {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];
    comments?: string;
    created_at?: string;
}

export type User = {
    id: number;
    name: string;
    role: typeof USER_ROLES[keyof typeof USER_ROLES];
}