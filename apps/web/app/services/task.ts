export const TASK_ENDPOINTS = {
    create: "/add",            
    list: "/tasks",           
    get: (id = ":id") => `/${id}`,       
    remove: (id = ":id") => `/${id}`,    
    toggle: (id = ":id") => `/${id}/toggle`,
} as const;
