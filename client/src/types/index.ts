export type VacationRequest = {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    comments?: string;
    created_at?: string;
}

export type User = {
    id: number;
    name: string;
    role: "Requester" | "Validator";
}