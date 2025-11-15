import React from "react";
import "./AdCard.css";

function AdCard({ ad }) {
  const {
    images,
    title,
    price,
    category,
    createdAt,
    status,
    priority
  } = ad;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className="ad-card">
      <div className="ad-card__image-wrapper">
        <img
          src={images && images.length > 0 ? images[0] : "https://via.placeholder.com/300x200?text=No+Image"}
          alt={title}
          className="ad-card__image"
        />
      </div>

      <div className="ad-card__content">
        <h3 className="ad-card__title">{title}</h3>

        <p className="ad-card__price">{price} ₽</p>

        <p className="ad-card__category">{category}</p>

        <p className="ad-card__date">Создано: {formatDate(createdAt)}</p>

        <div className="ad-card__badges">
          <span className={`ad-card__status ad-card__status_${status}`}>
            {(status === "pending" || status === "draft") && "На модерации"}
            {status === "approved" && "Одобрено"}
            {status === "rejected" && "Отклонено"}
          </span>

          <span className={`ad-card__priority ad-card__priority_${priority}`}>
            {priority === "urgent" ? "Срочное" : "Обычное"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
