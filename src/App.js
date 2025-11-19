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

  // FIX FOR SCROLL JUMPING
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

  // Restore scroll position after state updates
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

    // Reset form
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
      // July 2023 - December 2023
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

      // 2024 data
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

  // MONTHLY FOLDER FUNCTIONS (CHANGED FROM WEEKLY)
  const groupEntriesByMonth = () => {
    const months = {};

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            📊 Tic Tracker
          </h1>
          <p className="text-gray-600">Track Kay-Lee's symptoms daily</p>
        </div>

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Entry Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Today's Entry</h2>

          <form onSubmit={handleSubmit}>
            {/* Date */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() =>
                    setDate(new Date().toISOString().split("T")[0])
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Sliders */}
            {[
              {
                label: "Vocal Tics",
                value: vocalTics,
                setter: setVocalTics,
                color: "blue",
              },
              {
                label: "Motor Tics",
                value: motorTics,
                setter: setMotorTics,
                color: "purple",
              },
              {
                label: "Anxiety",
                value: anxiety,
                setter: setAnxiety,
                color: "red",
              },
              {
                label: "Sleep Quality",
                value: sleepQuality,
                setter: setSleepQuality,
                color: "green",
              },
              {
                label: "Pain Level",
                value: pain,
                setter: setPain,
                color: "orange",
              },
              { label: "Mood", value: mood, setter: setMood, color: "yellow" },
            ].map((item) => (
              <div key={item.label} className="mb-4">
                <label className="block font-semibold mb-2">
                  {item.label}:{" "}
                  <span className={`text-${item.color}-600 font-bold`}>
                    {item.value}/10
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={item.value}
                  onChange={(e) => item.setter(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}

            {/* Notes */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any triggers, events, or observations..."
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 text-lg"
            >
              💾 Save Entry
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportToGoogleSheets}
              className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              📤 Export to Google Sheets
            </button>
            <button
              onClick={loadPastHistory}
              className="bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700"
            >
              📜 Load Past History
            </button>
          </div>
        </div>

        {/* Monthly Entries */}
        {entries.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              📅 Past Entries by Month
            </h2>

            {Object.keys(monthlyEntries)
              .sort((a, b) => b.localeCompare(a)) // Most recent first
              .map((monthKey) => {
                const month = monthlyEntries[monthKey];
                const isExpanded = expandedMonths.has(monthKey);

                // Calculate month averages
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
                    className="mb-4 border-2 rounded-lg overflow-hidden"
                  >
                    {/* Month Header */}
                    <button
                      onClick={() => toggleMonth(monthKey)}
                      className="w-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 p-5 text-left flex justify-between items-center transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-blue-900">
                          {month.label}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
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
                      <span className="text-3xl ml-4">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </button>

                    {/* Month Entries */}
                    {isExpanded && (
                      <div className="bg-white p-4">
                        {month.entries
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((entry, index) => (
                            <div
                              key={index}
                              className="mb-3 p-4 border-l-4 border-blue-500 bg-gray-50 rounded"
                            >
                              <p className="font-semibold text-lg mb-2">
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
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                <span className="font-medium">
                                  🗣️ Vocal:{" "}
                                  <span className="text-blue-600">
                                    {entry.vocalTics}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  💪 Motor:{" "}
                                  <span className="text-purple-600">
                                    {entry.motorTics}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😰 Anxiety:{" "}
                                  <span className="text-red-600">
                                    {entry.anxiety}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😴 Sleep:{" "}
                                  <span className="text-green-600">
                                    {entry.sleepQuality}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  ⚡ Pain:{" "}
                                  <span className="text-orange-600">
                                    {entry.pain}/10
                                  </span>
                                </span>
                                <span className="font-medium">
                                  😊 Mood:{" "}
                                  <span className="text-yellow-600">
                                    {entry.mood}/10
                                  </span>
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-sm mt-3 p-2 bg-white rounded italic text-gray-700">
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
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            <p>No entries yet. Fill out the form above to start tracking! 📝</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
