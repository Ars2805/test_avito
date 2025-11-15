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

/* === Одобрить объявление === */
export async function approveAd(id) {
  try {
    const res = await fetch(`${BASE_URL}/ads/${id}/approve`, { method: "POST" });
    if (!res.ok) throw new Error("Ошибка при одобрении объявления");
    return await res.json();
  } catch (error) {
    console.error("Ошибка при approveAd:", error);
    throw error;
  }
}

/* === Отклонить объявление === */
export async function rejectAd(id, reason, comment = "") {
  try {
    const res = await fetch(`${BASE_URL}/ads/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, comment })
    });
    if (!res.ok) throw new Error("Ошибка при отклонении объявления");
    return await res.json();
  } catch (error) {
    console.error("Ошибка при rejectAd:", error);
    throw error;
  }
}

/* === Запросить доработку объявления === */
export async function requestChanges(id, reason, comment = "") {
  try {
    const res = await fetch(`${BASE_URL}/ads/${id}/request-changes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, comment })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Ошибка при запросе изменений");
    }

    const data = await res.json();
    return data.ad;
  } catch (error) {
    console.error("Ошибка при requestChanges:", error);
    throw error;
  }
}
