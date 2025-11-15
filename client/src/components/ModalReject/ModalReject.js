import React, { useState } from "react";
import "./ModalReject.css";

export default function ModalReject({ onClose, onSubmit }) {
  const templates = [
    "Запрещённый товар",
    "Неверная категория",
    "Некорректное описание",
    "Проблемы с фото",
    "Подозрение на мошенничество",
    "Другое"
  ];

  const [selected, setSelected] = useState("");
  const [customText, setCustomText] = useState("");

  const handleCheckbox = (template) => {
    if (selected === template) {
      setSelected("");
    } else {
      setSelected(template);
    }
  };

  const handleSubmit = () => {
    if (!selected) {
      alert("Выберите причину");
      return;
    }

    if (selected === "Другое") {
      if (!customText.trim()) {
        alert("Введите причину в поле 'Другое'");
        return;
      }
      onSubmit(customText.trim());
      return;
    }

    onSubmit(selected);
  };

  return (
    <div className="reject-modal__backdrop">
      <div className="reject-modal">
        <h2>Причина отклонения</h2>

        <div className="reject-modal__templates">
          {templates.map((tmp) => (
            <label key={tmp} className="reject-modal__checkbox">
              <input
                type="checkbox"
                checked={selected === tmp}
                onChange={() => handleCheckbox(tmp)}
              />
              {tmp}
            </label>
          ))}
        </div>

        <textarea
          className="reject-modal__textarea"
          placeholder="Введите свою причину..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          disabled={selected !== "Другое"}
        />

        <div className="reject-modal__actions">
          <button className="reject-modal__cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="reject-modal__confirm" onClick={handleSubmit}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
