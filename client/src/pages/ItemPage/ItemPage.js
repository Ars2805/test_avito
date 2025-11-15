import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAdById } from "../../api/ads";
import "./ItemPage.css";

export default function ItemPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const translateAction = (action) => {
    switch (action) {
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      case "revision":
        return "Доработка";
      default:
        return action;
    }
  };

  useEffect(() => {
    async function loadAd() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdById(id);
        setAd(data);
      } catch (err) {
        console.error(err);
        setError("Ошибка при загрузке объявления");
      } finally {
        setLoading(false);
      }
    }
    loadAd();
  }, [id]);

  if (loading) return <div className="item-page__loading">Загрузка...</div>;
  if (error) return <div className="item-page__error">{error}</div>;
  if (!ad) return <div className="item-page__empty">Объявление не найдено</div>;

  return (
    <main className="item-page">
      <div className="item-page__top">
        <div className="item-page__gallery">
          {ad.images && ad.images.length > 0 ? (
            <>
              <img
                className="item-page__gallery-main"
                src={ad.images[currentImage]}
                alt={`Фото ${currentImage + 1}`}
              />
              <div className="item-page__gallery-thumbs">
                {ad.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Превью ${index + 1}`}
                    className={index === currentImage ? "active" : ""}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>Изображения отсутствуют</p>
          )}
        </div>

        <div className="item-page__moderation">
          <h2>История модерации</h2>
          {ad.moderationHistory && ad.moderationHistory.length > 0 ? (
            <ul>
              {ad.moderationHistory.map((entry) => (
                <li key={entry.id}>
                  <p><strong>Модератор:</strong> {entry.moderatorName}</p>
                  <p><strong>Дата:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                  <p><strong>Решение:</strong> {translateAction(entry.action)}</p>
                  {entry.comment && <p><strong>Комментарий:</strong> {entry.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>История отсутствует</p>
          )}
        </div>
      </div>

      <section className="item-page__description">
        <h2>Описание товара</h2>
        <p>{ad.description}</p>
      </section>

      {ad.characteristics && (
        <section className="item-page__characteristics">
          <h2>Характеристики</h2>
          <table>
            <tbody>
              {Object.entries(ad.characteristics).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {ad.seller && (
        <section className="item-page__seller">
          <h2>Продавец</h2>
          <p><strong>Имя:</strong> {ad.seller.name}</p>
          <p><strong>Рейтинг:</strong> {ad.seller.rating}</p>
          <p><strong>Количество объявлений:</strong> {ad.seller.totalAds}</p>
          <p><strong>Дата регистрации:</strong> {new Date(ad.seller.registeredAt).toLocaleDateString()}</p>
        </section>
      )}
    </main>
  );
}