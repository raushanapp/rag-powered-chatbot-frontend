import axios from "axios";

class ApiService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
        this.endpoint = {
            session: import.meta.env.VITE_API_SESSION_ENDPOINT_GET,
            history: import.meta.env.VITE_API_HISTORY_ENDPOINT_GET,
        };

        this.api = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
    //  CreateSession
    async createSession() {
        const response = await this.api.post(`${this.endpoint.session}`);
        return response.data.sessionId
    }
    //  getChatHistory
    async getChatHistory(sessionId) {
        if (!sessionId) return;
        const response = await this.api.get(`${this.endpoint.history}/${sessionId}`);
        return response.data.message;
    }
    // Clear Session
    async clearSession(sessionId) {
        await this.api.delete(`${this.endpoint.session}/${sessionId}`);
    }
}

export default new ApiService();