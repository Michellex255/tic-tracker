import React, { useState, useEffect, useRef } from "react";
import NotificationSettings from "./NotificationSettings";

function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [vocalTics, setVocalTics] = useState(5);
  const [motorTics, setMotorTics] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [pain, setPain] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState(new Set());

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("ticTrackerEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ticTrackerEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, [entries, expandedMonths]);

  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveScrollPosition();

    const newEntry = {
      date,
      vocalTics,
      motorTics,
      anxiety,
      sleepQuality,
      pain,
      mood,
      notes,
      timestamp: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setNotes("");
    alert("Entry saved! ✅");
  };

  const exportToGoogleSheets = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Vocal Tics,Motor Tics,Anxiety,Sleep Quality,Pain,Mood,Notes\n" +
      entries
        .map(
          (e) =>
            `${e.date},${e.vocalTics},${e.motorTics},${e.anxiety},${e.sleepQuality},${e.pain},${e.mood},"${e.notes}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tic_tracker_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadPastHistory = () => {
    saveScrollPosition();

    const historicalData = [
      {
        date: "2023-07-15",
        vocalTics: 7,
        motorTics: 6,
        anxiety: 8,
        sleepQuality: 4,
        pain: 7,
        mood: 4,
        notes: "Started noticing tics more frequently",
      },
      {
        date: "2023-08-10",
        vocalTics: 8,
        motorTics: 7,
        anxiety: 8,
        sleepQuality: 4,
        pain: 8,
        mood: 3,
        notes: "Tics getting louder",
      },
      {
        date: "2023-09-05",
        vocalTics: 8,
        motorTics: 7,
        anxiety: 9,
        sleepQuality: 3,
        pain: 8,
        mood: 3,
        notes: "School started - very stressful",
      },
      {
        date: "2023-10-12",
        vocalTics: 9,
        motorTics: 8,
        anxiety: 9,
        sleepQuality: 3,
        pain: 9,
        mood: 2,
        notes: "Tests starting, tics very severe",
      },
      {
        date: "2023-11-20",
        vocalTics: 9,
        motorTics: 8,
        anxiety: 9,
        sleepQuality: 2,
        pain: 9,
        mood: 2,
        notes: "Exhausted all the time",
      },
      {
        date: "2023-12-15",
        vocalTics: 8,
        motorTics: 7,
        anxiety: 7,
        sleepQuality: 5,
        pain: 7,
        mood: 4,
        notes: "Holiday break - slight improvement",
      },
      {
        date: "2024-01-10",
        vocalTics: 9,
        motorTics: 8,
        anxiety: 9,
        sleepQuality: 3,
        pain: 9,
        mood: 3,
        notes: "Back to school, tics worsened",
      },
      {
        date: "2024-02-14",
        vocalTics: 9,
        motorTics: 8,
        anxiety: 9,
        sleepQuality: 3,
        pain: 9,
        mood: 2,
        notes: "Started aripiprazole medication",
      },
      {
        date: "2024-03-20",
        vocalTics: 8,
        motorTics: 7,
        anxiety: 8,
        sleepQuality: 4,
        pain: 8,
        mood: 4,
        notes: "Medication helping a bit",
      },
      {
        date: "2024-04-15",
        vocalTics: 8,
        motorTics: 7,
        anxiety: 8,
        sleepQuality: 4,
        pain: 8,
        mood: 4,
        notes: "Stable on medication",
      },
    ];

    const combined = [...historicalData, ...entries];
    setEntries(combined);
    alert("Historical data loaded! ✅");
  };

  const groupEntriesByMonth = () => {
    const months = {};

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthLabel = `${monthNames[month]} ${year}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          label: monthLabel,
          entries: [],
          year,
          month,
        };
      }

      months[monthKey].entries.push(entry);
    });

    return months;
  };

  const toggleMonth = (monthKey) => {
    saveScrollPosition();
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  const monthlyEntries = groupEntriesByMonth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border-t-4 border-blue-500">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            📊 Tic Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track Kay-Lee's Tourette's Syndrome symptoms daily
          </p>
        </div>

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Entry Form - BEAUTIFUL VERSION */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 mb-6 border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">
              ✏️
            </span>
            Today's Entry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Picker */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                📅 Date
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    setDate(new Date().toISOString().split("T")[0])
                  }
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Sliders - Each with unique color */}
            <div className="space-y-5">
              {[
                {
                  label: "🗣️ Vocal Tics",
                  value: vocalTics,
                  setter: setVocalTics,
                  color: "blue",
                  bgColor: "bg-blue-50",
                  borderColor: "border-blue-200",
                },
                {
                  label: "💪 Motor Tics",
                  value: motorTics,
                  setter: setMotorTics,
                  color: "purple",
                  bgColor: "bg-purple-50",
                  borderColor: "border-purple-200",
                },
                {
                  label: "😰 Anxiety Level",
                  value: anxiety,
                  setter: setAnxiety,
                  color: "red",
                  bgColor: "bg-red-50",
                  borderColor: "border-red-200",
                },
                {
                  label: "😴 Sleep Quality",
                  value: sleepQuality,
                  setter: setSleepQuality,
                  color: "green",
                  bgColor: "bg-green-50",
                  borderColor: "border-green-200",
                },
                {
                  label: "⚡ Pain Level",
                  value: pain,
                  setter: setPain,
                  color: "orange",
                  bgColor: "bg-orange-50",
                  borderColor: "border-orange-200",
                },
                {
                  label: "😊 Mood",
                  value: mood,
                  setter: setMood,
                  color: "yellow",
                  bgColor: "bg-yellow-50",
                  borderColor: "border-yellow-200",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`${item.bgColor} rounded-lg p-5 shadow-sm border-2 ${item.borderColor}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-lg font-bold text-gray-800">
                      {item.label}
                    </label>
                    <span
                      className={`text-3xl font-extrabold text-${item.color}-600 bg-white px-4 py-1 rounded-full shadow-sm`}
                    >
                      {item.value}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={item.value}
                    onChange={(e) => item.setter(parseInt(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, 
                        ${
                          item.color === "blue"
                            ? "#3b82f6"
                            : item.color === "purple"
                            ? "#a855f7"
                            : item.color === "red"
                            ? "#ef4444"
                            : item.color === "green"
                            ? "#22c55e"
                            : item.color === "orange"
                            ? "#f97316"
                            : "#eab308"
                        } 0%, 
                        ${
                          item.color === "blue"
                            ? "#3b82f6"
                            : item.color === "purple"
                            ? "#a855f7"
                            : item.color === "red"
                            ? "#ef4444"
                            : item.color === "green"
                            ? "#22c55e"
                            : item.color === "orange"
                            ? "#f97316"
                            : "#eab308"
                        } ${item.value * 10}%, 
                        #d1d5db ${item.value * 10}%, 
                        #d1d5db 100%)`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg p-5 shadow-sm border-2 border-gray-200">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                💭 Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any triggers, events, or observations today..."
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              💾 Save Entry
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🛠️ Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportToGoogleSheets}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              📤 Export to Google Sheets
            </button>
            <button
              onClick={loadPastHistory}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
            >
              📜 Load Past History
            </button>
          </div>
        </div>

        {/* Monthly Entries */}
        {entries.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                📅
              </span>
              Past Entries by Month
            </h2>

            {Object.keys(monthlyEntries)
              .sort((a, b) => b.localeCompare(a))
              .map((monthKey) => {
                const month = monthlyEntries[monthKey];
                const isExpanded = expandedMonths.has(monthKey);

                const avgVocal = (
                  month.entries.reduce((sum, e) => sum + e.vocalTics, 0) /
                  month.entries.length
                ).toFixed(1);
                const avgMotor = (
                  month.entries.reduce((sum, e) => sum + e.motorTics, 0) /
                  month.entries.length
                ).toFixed(1);
                const avgAnxiety = (
                  month.entries.reduce((sum, e) => sum + e.anxiety, 0) /
                  month.entries.length
                ).toFixed(1);
                const avgPain = (
                  month.entries.reduce((sum, e) => sum + e.pain, 0) /
                  month.entries.length
                ).toFixed(1);

                return (
                  <div
                    key={monthKey}
                    className="mb-4 border-2 rounded-xl overflow-hidden shadow-md"
                  >
                    <button
                      onClick={() => toggleMonth(monthKey)}
                      className="w-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 p-6 text-left flex justify-between items-center transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-blue-900 mb-2">
                          {month.label}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <p className="text-sm text-gray-700">
                            📝{" "}
                            <span className="font-semibold">
                              {month.entries.length}
                            </span>{" "}
                            {month.entries.length === 1 ? "entry" : "entries"}
                          </p>
                          <p className="text-sm text-gray-700">
                            🗣️ Vocal:{" "}
                            <span className="font-semibold text-blue-600">
                              {avgVocal}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            😰 Anxiety:{" "}
                            <span className="font-semibold text-red-600">
                              {avgAnxiety}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            ⚡ Pain:{" "}
                            <span className="font-semibold text-orange-600">
                              {avgPain}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-4xl ml-4 transform transition-transform"
                        style={{
                          transform: isExpanded
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▶
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="bg-gradient-to-br from-gray-50 to-white p-5">
                        {month.entries
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((entry, index) => (
                            <div
                              key={index}
                              className="mb-4 p-5 border-l-4 border-blue-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <p className="font-bold text-xl mb-3 text-gray-800">
                                📅{" "}
                                {new Date(entry.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                <span className="font-medium">
                                  🗣️ Vocal:{" "}
                                  <span className="text-blue-600 font-bold">
                                    {entry.vocalTics}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  💪 Motor:{" "}
                                  <span className="text-purple-600 font-bold">
                                    {entry.motorTics}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😰 Anxiety:{" "}
                                  <span className="text-red-600 font-bold">
                                    {entry.anxiety}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😴 Sleep:{" "}
                                  <span className="text-green-600 font-bold">
                                    {entry.sleepQuality}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  ⚡ Pain:{" "}
                                  <span className="text-orange-600 font-bold">
                                    {entry.pain}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😊 Mood:{" "}
                                  <span className="text-yellow-600 font-bold">
                                    {entry.mood}/10
                                  </span>
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-sm mt-4 p-3 bg-blue-50 rounded-lg italic text-gray-700 border-l-2 border-blue-300">
                                  💭 "{entry.notes}"
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {entries.length === 0 && (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <p className="text-xl text-gray-500">
              📝 No entries yet. Fill out the form above to start tracking!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
