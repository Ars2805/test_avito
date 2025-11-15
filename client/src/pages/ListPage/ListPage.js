import React, { useEffect, useState } from "react";
import { fetchAds } from "../../api/ads";
import AdCard from "../../components/AdCard/AdCard";
import "./ListPage.css";

export default function ListPage() {
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAds(currentPage);
  }, [currentPage]);

  async function loadAds(page) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAds({ page, limit: 10 });
      setAds(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ошибка при загрузке объявлений");
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (page) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="list-page">
      <header className="list-page__header">
        <h1 className="list-page__title">Список объявлений</h1>
        {pagination && (
          <p className="list-page__info">
            Всего: {pagination.totalItems} | Страница {pagination.currentPage} из {pagination.totalPages}
          </p>
        )}
      </header>

      <section className="list-page__content">
        {loading && <div className="list-page__loading">Загрузка...</div>}
        {error && <div className="list-page__error">{error}</div>}

        {!loading && !error && ads.length === 0 && (
          <div className="list-page__empty">Объявления не найдены</div>
        )}

        <div className="list-page__grid">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>

      {pagination && pagination.totalPages > 1 && (
        <footer className="list-page__pagination">
          <button
            className="list-page__page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Предыдущая
          </button>

          <span className="list-page__page-info">
            {currentPage} / {pagination.totalPages}
          </span>

          <button
            className="list-page__page-btn"
            disabled={currentPage === pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Следующая →
          </button>
        </footer>
      )}
    </main>
  );
}
