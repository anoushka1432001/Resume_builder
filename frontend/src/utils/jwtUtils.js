import { jwtDecode } from "jwt-decode";

export function getTokenData(token) {
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const user_name = decoded.name;

    if (decoded && expiryTime && user_name) {
      return {expiryTime, user_name}; // convert to milliseconds
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
  }
  return null;
}
