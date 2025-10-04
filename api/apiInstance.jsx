import axios from "axios";
import { conifgs } from "../config";

export const fetchData = async ({
  url,
  body,
  isFile,
  method,
  refreshToken = "",
  refresh = false,
}) => {
  try {
    const headers = {
      "Content-Type": isFile ? "multipart/form-data" : "application/json",
    };

    const token = localStorage.getItem(conifgs.localStorageTokenName);
    if (token) {
      headers.Authorization = `Bearer ${
        (refresh && refreshToken) || (!refresh && token) || ""
      }`;
    }

    const response = await axios({
      data: body,
      headers: headers,
      method: method || "GET",
      url: `${conifgs?.LIVE_BASE_URL}${url}`,
    });
    return response.data;
  } catch (err) {
    return err?.response?.data?.message;
  }
};
