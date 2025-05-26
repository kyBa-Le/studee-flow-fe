export function DateConverter(isoDate) {
    return isoDate ? isoDate.split("T")[0] : "";
}