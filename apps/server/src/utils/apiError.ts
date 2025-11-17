class ApiError extends Error {
   statusCode: number
   data: any | null
   errors: any[]

   constructor(
      message = "Something went wrong",
      statusCode: number,
      errors: any[] = [],
      stack = ""
   ) {
      super(message)
      Object.setPrototypeOf(this, ApiError.prototype) 
      this.name = this.constructor.name

      this.statusCode = statusCode
      this.data = null
      this.errors = errors

      if (stack) {
         this.stack = stack
      } else {
         if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor)
         }
      }
   }
}

export default ApiError