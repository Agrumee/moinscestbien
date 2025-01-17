export function getCSRFCookie(): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

// export function deleteCSRFCookie() {
//   document.cookie = "csrftoken=; Max-Age=-99999999;";
// }
