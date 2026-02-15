import axios from "axios";

const URL = "https://nominatim.openstreetmap.org/reverse";

const formatPreciseName = (address = {}, fallbackDisplayName = "") => {
  const locality =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    "";
  const state = address.state || "";
  const country = address.country || "";
  const precise = [locality, state, country].filter(Boolean).join(", ");
  return precise || fallbackDisplayName;
};

async function FetchLocation(latitude, longitude) {
  try {
    const { data } = await axios.get(URL, {
      params: {
        lat: latitude,
        lon: longitude,
        format: "jsonv2",
        addressdetails: 1,
        zoom: 18,
        "accept-language": "en",
      },
    });

    const fallbackDisplayName =
      data?.display_name ||
      `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`;
    const preciseName = formatPreciseName(data?.address, fallbackDisplayName);

    return {
      data: {
        display_name: preciseName,
      },
    };
  } catch (error) {
    return {
      data: {
        display_name: `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`,
      },
    };
  }
}
export default FetchLocation;
