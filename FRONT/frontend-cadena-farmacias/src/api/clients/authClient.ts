import axios from "axios";

export const authClient = axios.create({
    baseURL: "http://localhost:9000",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});
