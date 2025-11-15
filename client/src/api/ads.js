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

    const items = data.ads || [];

    return {
      items,
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

export async function fetchAdById(id) {
  try {
    const res = await fetch(`/api/v1/ads/${id}`);
    if (!res.ok) throw new Error("Ошибка при загрузке объявления");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при fetchAdById:", error);
    throw error;
  }
}

