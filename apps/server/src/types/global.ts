
declare global {
    namespace Express {
        interface Request {
            user?: any; // or specify a more precise type for user
        }
    }
}