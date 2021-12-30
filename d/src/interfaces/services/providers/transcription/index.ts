export interface GetTranscriptionByUserIdAndLinkRequest {
    user_id: string;
    file_url: string;
}

export interface GetTranscriptionByUserIdAndLinkResponse {
    transcription?: string;
    error?: string;
}
