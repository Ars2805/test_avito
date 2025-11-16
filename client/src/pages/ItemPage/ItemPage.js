import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdById, approveAd, rejectAd, requestChanges } from "../../api/ads";
import ModalReject from "../../components/ModalReject/ModalReject";
import { AdsContext } from "../../context/AdsContext";
import "./ItemPage.css";
import { fetchAds } from "../../api/ads";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allAds, setAllAds } = useContext(AdsContext);


  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const translateAction = (action) => {
    switch (action) {
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      case "pending":
      case "requestChanges":
        return "На модерации";
      default:
        return action;
    }
  };

  useEffect(() => {
    async function loadAll() {
      if (!allAds || allAds.length === 0) {
        try {
          const data = await fetchAds({ page: 1, limit: 10000 });
          setAllAds(data.items);
        } catch (err) {
          console.error("Ошибка загрузки списка объявлений:", err);
        }
      }
    }

    loadAll();
  }, []);


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

  const currentIndex =
    allAds && allAds.length > 0
      ? allAds.findIndex((item) => item.id === ad.id)
      : -1;

  const handleBack = () => navigate("/");
  const handlePrev = () => {
    if (currentIndex > 0) navigate(`/item/${allAds[currentIndex - 1].id}`);
  };
  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < allAds.length - 1)
      navigate(`/item/${allAds[currentIndex + 1].id}`);
  };

  const handleApprove = async () => {
    try {
      await approveAd(ad.id);
      const updated = await fetchAdById(ad.id);
      setAd(updated);
      alert("Объявление одобрено!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при одобрении объявления");
    }
  };

  const handleRequestChanges = async () => {
    try {
      const updatedAd = await requestChanges(ad.id, "Доработка", "");
      setAd({ ...updatedAd, status: "pending" });
      alert("Запрос на доработку отправлен!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при запросе доработки");
    }
  };

  const handleReject = async (reason, comment) => {
    try {
      await rejectAd(ad.id, reason, comment);
      const updated = await fetchAdById(ad.id);
      setAd(updated);
      setRejectModalOpen(false);
      alert("Объявление отклонено!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при отклонении объявления");
    }
  };

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
                  <p>
                    <strong>Модератор:</strong> {entry.moderatorName}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Решение:</strong> {translateAction(entry.action)}
                  </p>
                  {entry.comment && (
                    <p>
                      <strong>Комментарий:</strong> {entry.comment}
                    </p>
                  )}
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
          <p>
            <strong>Имя:</strong> {ad.seller.name}
          </p>
          <p>
            <strong>Рейтинг:</strong> {ad.seller.rating}
          </p>
          <p>
            <strong>Количество объявлений:</strong> {ad.seller.totalAds}
          </p>
          <p>
            <strong>Дата регистрации:</strong>{" "}
            {new Date(ad.seller.registeredAt).toLocaleDateString()}
          </p>
        </section>
      )}

      <section className="moderator-actions">
        <div className="moderator-actions__buttons">
          <button className="btn btn-approve" onClick={handleApprove}>
            Одобрить
          </button>
          <button
            className="btn btn-reject"
            onClick={() => setRejectModalOpen(true)}
          >
            Отклонить
          </button>
          <button className="btn btn-revise" onClick={handleRequestChanges}>
            Вернуть на доработку
          </button>
        </div>
      </section>

      {rejectModalOpen && (
        <ModalReject
          onClose={() => setRejectModalOpen(false)}
          onSubmit={(reason, comment) => handleReject(reason, comment)}
        />
      )}

      <section className="item-page__navigation">
        <button className="btn btn-back" onClick={handleBack}>
          ← Назад к списку
        </button>
        <div className="item-page__nav-buttons">
          <button
            className="btn btn-prev"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
          >
            Предыдущее
          </button>
          <button
            className="btn btn-next"
            onClick={handleNext}
            disabled={currentIndex === -1 || currentIndex >= allAds.length - 1}
          >
            Следующее
          </button>
        </div>
      </section>
    </main>
  );
}
