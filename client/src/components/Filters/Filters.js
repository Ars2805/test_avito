import React from "react";
import "./Filters.css";

export default function Filters({ filters, setFilters, onReset }) {
  const handleStatusChange = (value) => {
    const newStatuses = filters.status.includes(value)
      ? filters.status.filter((s) => s !== value)
      : [...filters.status, value];

    setFilters({ ...filters, status: newStatuses });
  };

  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value });
  };

  const handlePriceChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleQueryChange = (value) => {
    setFilters({ ...filters, query: value });
  };

  const handleSort = (type, order) => {
    setFilters({ ...filters, sortBy: `${type}_${order}` });
  };

  return (
    <div className="filters">
      <div className="filters__group">
        <label className="filters__label">Поиск по названию</label>
        <input
          type="text"
          className="filters__input"
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Введите название..."
        />
      </div>

      <div className="filters__group">
        <span className="filters__label">Статус</span>
        <div className="filters__checkboxes">
          {["pending", "approved", "rejected"].map((st) => (
            <label key={st} className="filters__checkbox">
              <input
                type="checkbox"
                checked={filters.status.includes(st)}
                onChange={() => handleStatusChange(st)}
              />
              {st === "pending" && "На модерации"}
              {st === "approved" && "Одобрено"}
              {st === "rejected" && "Отклонено"}
            </label>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <label className="filters__label">Категория</label>
        <select
          className="filters__select"
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Все</option>
          <option value="Детское">Детское</option>
          <option value="Животные">Животные</option>
          <option value="Мода">Мода</option>
          <option value="Недвижимость">Недвижимость</option>
          <option value="Работа">Работа</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Услуги">Услуги</option>
          <option value="Электроника">Электроника</option>
        </select>
      </div>

      <div className="filters__group filters__price">
        <label className="filters__label">Цена</label>
        <input
          type="number"
          className="filters__input"
          placeholder="от"
          value={filters.priceFrom}
          onChange={(e) => handlePriceChange("priceFrom", e.target.value)}
        />
        <input
          type="number"
          className="filters__input"
          placeholder="до"
          value={filters.priceTo}
          onChange={(e) => handlePriceChange("priceTo", e.target.value)}
        />
      </div>

      <div className="filters__group filters__sort">
        <span className="filters__label">Сортировка</span>
        <div className="filters__sort-buttons">

          <div className="filters__sort-item">
            <span>Цена</span>
            <div className="filters__sort-arrows">
              <button
                className={filters.sortBy === "price_asc" ? "active" : ""}
                onClick={() => handleSort("price", "asc")}
              >
                ↑
              </button>
              <button
                className={filters.sortBy === "price_desc" ? "active" : ""}
                onClick={() => handleSort("price", "desc")}
              >
                ↓
              </button>
            </div>
          </div>


          <div className="filters__sort-item">
            <span>Дата</span>
            <div className="filters__sort-arrows">
              <button
                className={filters.sortBy === "date_asc" ? "active" : ""}
                onClick={() => handleSort("date", "asc")}
              >
                ↑
              </button>
              <button
                className={filters.sortBy === "date_desc" ? "active" : ""}
                onClick={() => handleSort("date", "desc")}
              >
                ↓
              </button>
            </div>
          </div>


          <div className="filters__sort-item">
            <span>Приоритет</span>
            <div className="filters__sort-arrows">
              <button
                className={filters.sortBy === "priority_asc" ? "active" : ""}
                onClick={() => handleSort("priority", "asc")}
              >
                ↑
              </button>
              <button
                className={filters.sortBy === "priority_desc" ? "active" : ""}
                onClick={() => handleSort("priority", "desc")}
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="filters__reset" onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}
