import { FiLoader } from "react-icons/fi";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner"; 
import React from "react";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface ApiArgs {
  url: string;
  method: HttpMethod;
  data?: any;
}

export const useApiCall = () => {
  async function apiCall({ url, method, data }: ApiArgs) {
    // Loading toast
    const loadingId = toast.loading("Processing request...", {
      duration: Infinity,
      icon: <FiLoader className="animate-spin" />,
    });

    try {
      let response;

      switch (method.toUpperCase()) {
        case "GET":
          response = await axiosInstance.get(url);
          break;

        case "POST":
          response = await axiosInstance.post(url, data);
          break;

        case "PUT":
          response = await axiosInstance.put(url, data);
          break;

        case "PATCH":
          response = await axiosInstance.patch(url, data);
          break;

        case "DELETE":
          response =
            data !== undefined
              ? await axiosInstance.delete(url, { data })
              : await axiosInstance.delete(url);
          break;

        default:
          throw new Error("Unsupported HTTP method");
      }

      // Remove loading toast
      toast.dismiss(loadingId);

      // SUCCESS
      toast.success(response?.data?.message || "Success!", {
        icon: <CheckCircle className="w-5 h-5" />,
        duration: 2000,
      });

      return response.data;
    } catch (err) {
      // Remove loading toast
      toast.dismiss(loadingId);

      let errorMsg = "Something went wrong";

      if (axios.isAxiosError(err)) {
        errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Request failed. Try again.";
      }

      // ERROR TOAST
      toast.error(errorMsg, {
        icon: <XCircle className="w-5 h-5" />,
        duration: 3000,
      });

      return null;
    }
  }

  return apiCall;
};

export default useApiCall;
