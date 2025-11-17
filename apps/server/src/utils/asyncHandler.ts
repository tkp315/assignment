import type{ Request, Response,NextFunction} from 'express';

const asyncHandlerFunction = (requestFunction: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestFunction(req, res, next);
    } catch (err: unknown) {
      const error = err as any;
      const statusCode = error.code >= 100 && error.code < 600 ? error.code : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  };
};

export default asyncHandlerFunction;
