import { useEffect, useState } from "react";
import { API } from "./api";

function getColor(hours, date) {
  const today = new Date().toISOString().split("T")[0];
  const startDateRaw = localStorage.getItem("startDate");

  // ⚠️ normalize startDate to YYYY-MM-DD
  const startDate = startDateRaw
    ? new Date(startDateRaw).toISOString().split("T")[0]
    : null;

  // before user joined → white
  if (!startDate || date < startDate) return "#ebedf0";

  // future days → white
  if (date > today) return "#ebedf0";

  // today → white until filled
  if (date === today && !hours) return "#ebedf0";

  // past days missed → red
  if (date < today && !hours) return "#ff4d4d";

  // valid hours → green levels
  if (hours >= 14) return "#004d00";
  if (hours >= 12) return "#1a7f37";
  if (hours >= 8) return "#39d353";

  // less than 8 → red
  return "#ff4d4d";
}
export default function App() {
  const [data, setData] = useState({});
  const [hours, setHours] = useState("");

  const token = localStorage.getItem("token");

  // 📊 FETCH DATA
  const fetchData = async () => {
    const res = await API.get("/data", {
      headers: { Authorization: token }
    });

    const map = {};
    res.data.forEach(d => {
      map[d.date] = d.hours;
    });

    setData(map);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 💾 SAVE TODAY
  const save = async () => {
    const date = new Date().toISOString().split("T")[0];

    await API.post(
      "/data",
      { date, hours: Number(hours) },
      { headers: { Authorization: token } }
    );

    setHours("");
    fetchData();
  };

  // 🔥 STREAK CALCULATION
  function calculateStreak(data) {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const date = d.toISOString().split("T")[0];
      const hrs = data[date];

      if (hrs >= 8) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  const streak = calculateStreak(data);
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("startDate"); // important
  window.location.reload();
};
  return (
    <div style={{ padding: "15px", maxWidth: "900px", margin: "auto" }}>
      

      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
        🔥 Current Streak: {streak} days
      </h3>
      

      {/* INPUT */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours today"
          style={{
            padding: "8px",
            width: "120px",
            textAlign: "center"
          }}
        />
        <button onClick={save} style={{ marginLeft: "10px" }}>
          Save
        </button>
      </div>

      {/* MONTH GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "15px"
        }}
      >
        {Array.from({ length: 12 }).map((_, monthIndex) => {
          const year = new Date().getFullYear();

          const firstDay = new Date(year, monthIndex, 1);
          const lastDay = new Date(year, monthIndex + 1, 0).getDate();

          const monthName = firstDay.toLocaleString("default", {
            month: "short"
          });

          return (
            <div key={monthIndex}>
              
              {/* MONTH NAME */}
              <h4 style={{ textAlign: "center", marginBottom: "5px" }}>
                {monthName}
              </h4>

              {/* DAYS GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px"
                }}
              >
                {Array.from({ length: lastDay }).map((_, day) => {
                  const dateObj = new Date(year, monthIndex, day + 1);
                  const date = dateObj.toISOString().split("T")[0];

                  return (
                    <div
                      key={date}
                      title={date}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        backgroundColor: getColor(data[date], date),
                        borderRadius: 3
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
        🔴 Missed | ⚪ Not filled | 🟢 Completed (8+ hrs)
      </p>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
  <button
    onClick={logout}
    style={{
      padding: "6px 12px",
      cursor: "pointer"
    }}
  >
    Logout
  </button>
</div>
    </div>
  );
}