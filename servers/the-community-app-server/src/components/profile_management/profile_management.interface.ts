export interface userProfileUpdate {
    user_name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    deActivated?: boolean;
    deActivated_reason?: string;
    profile_description?: string;
    current_year?: number;
    course?: string;
    section?: string;
}

export interface reportUser {
    reported_by: string;
    reported_reason: string;
    reportee: string;
}