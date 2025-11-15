import React, { useEffect, useState } from "react";
import { fetchAds } from "../../api/ads";
import AdCard from "../../components/AdCard/AdCard";
import Filters from "../../components/Filters/Filters";
import "./ListPage.css";

export default function ListPage() {
  const [allAds, setAllAds] = useState([]); 
  const [ads, setAds] = useState([]);      
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 

  const [filters, setFilters] = useState({
    query: "",
    status: [],
    category: "",
    priceFrom: "",
    priceTo: "",
    sortBy: ""
  });

  useEffect(() => {
    async function loadAllAds() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAds({ page: 1, limit: 10000 });
        setAllAds(data.items);
      } catch (err) {
        console.error(err);
        setError(err.message || "Ошибка при загрузке объявлений");
      } finally {
        setLoading(false);
      }
    }
    loadAllAds();
  }, []);

  useEffect(() => {
    let filtered = [...allAds];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(ad => filters.status.includes(ad.status));
    }

    if (filters.category) {
      filtered = filtered.filter(ad => ad.category === filters.category);
    }

    if (filters.priceFrom) {
      filtered = filtered.filter(ad => ad.price >= Number(filters.priceFrom));
    }
    if (filters.priceTo) {
      filtered = filtered.filter(ad => ad.price <= Number(filters.priceTo));
    }

    
    if (filters.sortBy) {
      const [type, order] = filters.sortBy.split("_");
      filtered.sort((a, b) => {
        let valA, valB;

        switch (type) {
          case "price":
            valA = a.price;
            valB = b.price;
            break;
          case "date":
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
            break;
          case "priority":
            const mapPriority = { urgent: 2, normal: 1 };
            valA = mapPriority[a.priority] || 0;
            valB = mapPriority[b.priority] || 0;
            break;
          default:
            return 0;
        }

        if (order === "asc") return valA - valB;
        return valB - valA;
      });
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);

    const page = currentPage > totalPages ? totalPages || 1 : currentPage;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAds = filtered.slice(startIndex, endIndex);

    setAds(paginatedAds);
    setPagination({
      totalItems,
      totalPages,
      currentPage: page
    });
  }, [allAds, filters, currentPage]);

  const resetFilters = () => {
    setFilters({
      query: "",
      status: [],
      category: "",
      priceFrom: "",
      priceTo: "",
      sortBy: ""
    });
    setCurrentPage(1);
  };

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

      <Filters filters={filters} setFilters={setFilters} onReset={resetFilters} />

      <section className="list-page__content">
        {loading && <div className="list-page__loading">Загрузка...</div>}
        {error && <div className="list-page__error">{error}</div>}

        {!loading && !error && ads.length === 0 && (
          <div className="list-page__empty">Объявления не найдены</div>
        )}

        <div className="list-page__grid">
          {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      </section>

      {pagination && pagination.totalPages > 1 && (
        <footer className="list-page__pagination">
          <button
            className="list-page__page-btn"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            ← Предыдущая
          </button>

          <span className="list-page__page-info">
            {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            className="list-page__page-btn"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Следующая →
          </button>
        </footer>
      )}
    </main>
  );
}