
const prefix = "/auth";

export const USER_ENDPOINTS = {
    register: {
        url: `${prefix}/register`,
        method: 'post'
    },
    login: {
        url: `${prefix}/login`,
        method: 'post'
    },
    logout: {
        url: `${prefix}/logout`,
        method: 'post'
    },
    me: {
        url: `${prefix}/me`,
        method: 'get'
    },
    refresh: {
        url: `${prefix}/refresh`,
        method: 'post'
    }
}as const;
