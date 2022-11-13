import fetch from "node-fetch";
import getPreference from "./preferences";

export async function readwiseRequest(
  url: string,
  method?: "GET" | "POST" | "PUT",
  body?: any
) {
  const key = getPreference("readwiseToken");

  const res = await fetch(`https://readwise.io/api/v3${url}`, {
    method: method ?? "GET",
    headers: {
      Authorization: `Token ${key}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json());

  return res;
}
