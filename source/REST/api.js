// Instruments
import { MAIN_URL, TOKEN } from "./config";

const callApi = async ({
    method = "GET",
    options = {},
    data = {},
    urlAddition = "",
} = {}) => {
    const authHeaders = TOKEN ? { Authorization: TOKEN } : {};

    const body =
        method === "POST" || method === "PUT"
            ? { body: JSON.stringify(data) }
            : {};

    try {
        const response = await fetch(
            MAIN_URL + (urlAddition.length > 0 ? `/${urlAddition}` : ""),
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                ...body,
                ...options,
            }
        );

        if (response.status >= 200 && response.status < 300) {
            if (method !== "DELETE") {
                const { data: json } = await response.json();

                return json;
            }
        }
    } catch (error) {
        throw new Error(`ERROR ${error}`);
    }
};

export const api = {
    createTask: (message) => {
        return callApi({ method: "POST", data: { message }});
    },

    fetchTasks: () => {
        return callApi();
    },

    updateTask: (data) => {
        return callApi({ method: "PUT", data: [data]});
    },

    removeTask: (id) => {
        return callApi({ method: "DELETE", urlAddition: id });
    },

    completeAllTasks: async (tasks) => {
        const requests = tasks.map((task) =>
            api.updateTask({ ...task, completed: true })
        );

        await Promise.all(requests);
    },
};
