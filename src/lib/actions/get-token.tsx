import { getToken } from "./auth"

export const getTokenAwaited = async () => {
  const fetchedToken = await getToken();
  return fetchedToken?.value;
};