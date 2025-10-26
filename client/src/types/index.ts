export type VacationRequest = {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
}

export type User = {
    id: number;
    name: string;
    role: "Requester" | "Validator";
}