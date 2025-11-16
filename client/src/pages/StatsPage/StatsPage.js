import React, { useEffect, useState } from "react";
import {
  fetchStatsSummary,
  fetchStatsActivity,
  fetchStatsDecisions,
  fetchStatsCategories,
} from "../../api/stats";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "./StatsPage.css";

const periodOptions = [
  { label: "Сегодня", value: "today" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
];

const COLORS = ["#5ca874", "#d66a5c", "#d0b457"];

export default function StatsPage() {
  const [period, setPeriod] = useState("week");
  const [summary, setSummary] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [decisionsData, setDecisionsData] = useState({});
  const [categoriesData, setCategoriesData] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, activityRes, decisionsRes, categoriesRes] =
          await Promise.all([
            fetchStatsSummary({ period }),
            fetchStatsActivity({ period }),
            fetchStatsDecisions({ period }),
            fetchStatsCategories({ period }),
          ]);

        setSummary(summaryRes);
        setActivityData(activityRes);
        setDecisionsData(decisionsRes);
        setCategoriesData(categoriesRes);
      } catch (err) {
        console.error(err);
        setError("Ошибка при загрузке статистики");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [period]);

  if (loading) return <div className="stats-page__loading">Загрузка...</div>;
  if (error) return <div className="stats-page__error">{error}</div>;

  return (
    <main className="stats-page">
      <div className="stats-page__cards">
        <div className="stats-card stats-card--total">
          <div className="stats-card__header">
            <span>Всего проверено</span>
            <select
              className="stats-card__period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="stats-card__value">{summary.totalReviewed}</div>
        </div>

        <div className="stats-card stats-card--percent">
          <div className="stats-card__item">
            <span>Одобрено</span>
            <strong>{summary.approvedPercentage.toFixed(1)}%</strong>
          </div>
          <div className="stats-card__item">
            <span>Отклонено</span>
            <strong>{summary.rejectedPercentage.toFixed(1)}%</strong>
          </div>
          <div className="stats-card__item">
            <span>Среднее время проверки</span>
            <strong>{summary.averageReviewTime} мин</strong>
          </div>
        </div>
      </div>

      <div className="stats-page__charts">
        <div className="chart-container">
          <h3>Активность по дням</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <XAxis 
                dataKey="date"
                tickFormatter={(dateStr) => {
                  const d = new Date(dateStr);
                  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(dateStr) => {
                  const d = new Date(dateStr);
                  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                }}
                formatter={(value, name) => {
                  let label = "";
                  if (name === "approved") label = "Одобрено";
                  else if (name === "rejected") label = "Отклонено";
                  else if (name === "requestChanges") label = "На доработку";
                  return [value, label];
                }}
              />
              <Bar dataKey="approved" fill="#5ca874" />
              <Bar dataKey="rejected" fill="#d66a5c" />
              <Bar dataKey="requestChanges" fill="#d0b457" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Распределение решений</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Одобрено", value: decisionsData.approved || 0 },
                  { name: "Отклонено", value: decisionsData.rejected || 0 },
                  { name: "На доработку", value: decisionsData.requestChanges || 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
                <Cell fill={COLORS[2]} />
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Статистика по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.entries(categoriesData).map(([cat, val]) => ({ category: cat, value: val }))}
            >
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}`, "Количество"]}
              />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
