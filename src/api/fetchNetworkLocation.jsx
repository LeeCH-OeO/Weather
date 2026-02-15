import axios from "axios";

const parseCloudflareTrace = (traceText = "") => {
  const lines = String(traceText).split("\n");
  const payload = {};
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (!key || !rest.length) continue;
    payload[key.trim()] = rest.join("=").trim();
  }
  return payload;
};

const mapIpWho = (data) => ({
  latitude: data?.latitude,
  longitude: data?.longitude,
  city: data?.city || "",
  ok: data?.success !== false,
});

const mapIpApi = (data) => ({
  latitude: data?.lat,
  longitude: data?.lon,
  city: data?.city || "",
  ok: data?.status !== "fail",
});

async function FetchNetworkLocation() {
  // 0) Worker endpoint: uses request.cf when deployed on Cloudflare Workers
  try {
    const { data } = await axios.get("/api/network-location", {
      timeout: 2500,
    });
    if (
      Number.isFinite(Number(data?.latitude)) &&
      Number.isFinite(Number(data?.longitude))
    ) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || "",
      };
    }
  } catch (error) {
    // ignore and fallback
  }

  // 1) Cloudflare-native trace endpoint (works on Cloudflare proxied domain)
  try {
    const { data: traceRaw } = await axios.get("/cdn-cgi/trace", {
      responseType: "text",
      timeout: 3500,
    });
    const trace = parseCloudflareTrace(traceRaw);
    if (trace?.ip) {
      const { data } = await axios.get(`https://ipwho.is/${trace.ip}`, {
        timeout: 3500,
      });
      const mapped = mapIpWho(data);
      if (
        mapped.ok &&
        Number.isFinite(Number(mapped.latitude)) &&
        Number.isFinite(Number(mapped.longitude))
      ) {
        return mapped;
      }
    }
  } catch (error) {
    // ignore and fallback
  }

  // 2) fallback providers (non-Cloudflare local/dev or blocked trace path)
  const providers = [
    {
      url: "https://ipwho.is/",
      map: mapIpWho,
    },
    {
      url: "https://ip-api.com/json/?fields=status,lat,lon,city",
      map: mapIpApi,
    },
  ];

  for (const provider of providers) {
    try {
      const { data } = await axios.get(provider.url, { timeout: 3500 });
      const mapped = provider.map(data);
      if (
        mapped.ok &&
        Number.isFinite(Number(mapped.latitude)) &&
        Number.isFinite(Number(mapped.longitude))
      ) {
        return mapped;
      }
    } catch (error) {
      // try next fallback provider
    }
  }

  throw new Error("network location lookup failed");
}

export default FetchNetworkLocation;
