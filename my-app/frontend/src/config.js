const httpUrl = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000";
const wsUrl = httpUrl.replace(/^http/, "ws");

export const graphqlHttpUrl = httpUrl;
export const graphqlWsUrl = wsUrl;
