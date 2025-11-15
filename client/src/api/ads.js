const BASE_URL = "/api/v1";

export async function fetchAds({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page,
    limit
  });

  try {
    const res = await fetch(`${BASE_URL}/ads?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Ошибка при запросе объявлений");
    }

    const data = await res.json();

    return {
      items: data.ads || [],
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error("Ошибка при fetchAds:", error);
    return {
      items: [],
      pagination: null
    };
  }
}