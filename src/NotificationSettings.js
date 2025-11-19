import React, { useState, useEffect } from "react";

function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // NEW - control expand/collapse
  const [reminderTimes, setReminderTimes] = useState([
    { time: "09:00", enabled: true, label: "Morning" },
    { time: "13:00", enabled: true, label: "Afternoon" },
    { time: "18:00", enabled: true, label: "Evening" },
    { time: "21:00", enabled: true, label: "Before Bed" },
  ]);

  const isNotificationSupported =
    "Notification" in window && "serviceWorker" in navigator;

  const enableNotifications = async () => {
    if (!isNotificationSupported) {
      alert(
        "Notifications are not supported in this browser. Try using Chrome or Safari!"
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setNotificationsEnabled(true);
        setIsExpanded(true); // Expand after enabling
        scheduleNotifications();

        new Notification("Tic Tracker Notifications Enabled! 🎉", {
          body: "Kay-Lee will receive reminders to log symptoms",
          icon: "/logo192.png",
        });
      } else {
        alert("Please enable notifications in your browser settings");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      alert("Could not enable notifications");
    }
  };

  const scheduleNotifications = () => {
    const existingTimers = JSON.parse(
      localStorage.getItem("notificationTimers") || "[]"
    );
    existingTimers.forEach((timer) => clearTimeout(timer));

    const newTimers = [];

    reminderTimes.forEach((reminder) => {
      if (!reminder.enabled) return;

      const [hours, minutes] = reminder.time.split(":");
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime - now;

      const timer = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Time to Log - ${reminder.label} ⏰`, {
            body: "How are Kay-Lee's symptoms today?",
            icon: "/logo192.png",
            tag: reminder.label,
            requireInteraction: true,
          });

          scheduleNotifications();
        }
      }, timeUntilNotification);

      newTimers.push(timer);
    });

    localStorage.setItem("notificationTimers", JSON.stringify(newTimers));
    localStorage.setItem("reminderTimes", JSON.stringify(reminderTimes));
  };

  const toggleReminder = (index) => {
    const newTimes = [...reminderTimes];
    newTimes[index].enabled = !newTimes[index].enabled;
    setReminderTimes(newTimes);

    if (notificationsEnabled) {
      scheduleNotifications();
    }
  };

  const updateReminderTime = (index, newTime) => {
    const newTimes = [...reminderTimes];
    newTimes[index].time = newTime;
    setReminderTimes(newTimes);

    if (notificationsEnabled) {
      scheduleNotifications();
    }
  };

  const handleSaveAndCollapse = () => {
    scheduleNotifications();
    setIsExpanded(false); // Collapse after saving
    alert("Reminders saved! ✅");
  };

  useEffect(() => {
    const savedTimes = localStorage.getItem("reminderTimes");
    if (savedTimes) {
      setReminderTimes(JSON.parse(savedTimes));
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
      scheduleNotifications();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header - Always visible */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🔔 Daily Reminders</h2>
          {notificationsEnabled && !isExpanded && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Notifications active
            </p>
          )}
        </div>
        {notificationsEnabled && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
      </div>

      {/* Content - Collapsible */}
      {(!notificationsEnabled || isExpanded) && (
        <div className="mt-4">
          {!isNotificationSupported ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                ⚠️ Notifications are not supported in this browser. Please use
                Chrome, Safari, or Edge.
              </p>
            </div>
          ) : (
            <>
              {!notificationsEnabled ? (
                <div>
                  <p className="mb-4 text-gray-600">
                    Get reminders throughout the day to log Kay-Lee's symptoms.
                    Never forget to track!
                  </p>
                  <button
                    onClick={enableNotifications}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
                  >
                    🔔 Enable Daily Reminders
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded mb-4">
                    <p className="text-green-800 font-semibold">
                      ✅ Reminders Enabled! Kay-Lee will get notifications at:
                    </p>
                  </div>

                  <h3 className="font-bold mb-3 text-lg">
                    ⏰ Reminder Schedule:
                  </h3>

                  {reminderTimes.map((reminder, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 mb-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={() => toggleReminder(index)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-medium w-32">
                        {reminder.label}:
                      </span>
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) =>
                          updateReminderTime(index, e.target.value)
                        }
                        disabled={!reminder.enabled}
                        className="border rounded px-3 py-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
                      />
                      {reminder.enabled && (
                        <span className="text-green-600 text-sm">✓ Active</span>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleSaveAndCollapse}
                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold"
                  >
                    💾 Save & Close
                  </button>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      💡 <strong>Tip:</strong> For reminders to work on your
                      phone, add this app to your home screen!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationSettings;
