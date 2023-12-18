export function convSubsToURI(subs: string) {
  return subs
    .split("\n")
    .filter((url) => url !== "")
    .map((url) => encodeURIComponent(url))
    .join("|")
}
