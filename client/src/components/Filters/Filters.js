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
          <option value="Авто">Авто</option>
          <option value="Недвижимость">Недвижимость</option>
          <option value="Электроника">Электроника</option>
          <option value="Разное">Разное</option>
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

      <button className="filters__reset" onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}
