export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/network-location") {
      const cf = request.cf || {};
      return Response.json({
        latitude: cf.latitude ?? null,
        longitude: cf.longitude ?? null,
        city: cf.city ?? "",
        region: cf.region ?? "",
        country: cf.country ?? "",
        timezone: cf.timezone ?? "",
        colo: cf.colo ?? "",
      });
    }

    return env.ASSETS.fetch(request);
  },
};
