import React, { useState, useEffect } from "react";

function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTimes, setReminderTimes] = useState([
    { time: "09:00", enabled: true, label: "Morning" },
    { time: "13:00", enabled: true, label: "Afternoon" },
    { time: "18:00", enabled: true, label: "Evening" },
    { time: "21:00", enabled: true, label: "Before Bed" },
  ]);

  // Check if notifications are supported
  const isNotificationSupported =
    "Notification" in window && "serviceWorker" in navigator;

  // Request notification permission
  const enableNotifications = async () => {
    if (!isNotificationSupported) {
      alert("Notifications are not supported in this browser");
      return;
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Register service worker
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );

        setNotificationsEnabled(true);

        // Schedule notifications
        scheduleNotifications();

        // Show success message
        new Notification("Tic Tracker Notifications Enabled!", {
          body: "You will receive reminders to log symptoms",
          icon: "/icon-192x192.png",
        });
      } else {
        alert("Please enable notifications in your browser settings");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      alert("Could not enable notifications");
    }
  };

  // Schedule notifications based on reminder times
  const scheduleNotifications = () => {
    reminderTimes.forEach((reminder) => {
      if (!reminder.enabled) return;

      const [hours, minutes] = reminder.time.split(":");
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime - now;

      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Time to Log - ${reminder.label}`, {
            body: "How are Kay-Lee's symptoms today?",
            icon: "/icon-192x192.png",
            tag: reminder.label,
            requireInteraction: true,
          });

          // Schedule for same time tomorrow
          scheduleNotifications();
        }
      }, timeUntilNotification);
    });

    // Save schedule to localStorage
    localStorage.setItem("reminderTimes", JSON.stringify(reminderTimes));
  };

  // Toggle individual reminder
  const toggleReminder = (index) => {
    const newTimes = [...reminderTimes];
    newTimes[index].enabled = !newTimes[index].enabled;
    setReminderTimes(newTimes);

    if (notificationsEnabled) {
      scheduleNotifications();
    }
  };

  // Update reminder time
  const updateReminderTime = (index, newTime) => {
    const newTimes = [...reminderTimes];
    newTimes[index].time = newTime;
    setReminderTimes(newTimes);

    if (notificationsEnabled) {
      scheduleNotifications();
    }
  };

  // Load saved settings on mount
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">📱 Notification Settings</h2>

      {!isNotificationSupported ? (
        <p className="text-red-600">
          Notifications are not supported in this browser
        </p>
      ) : (
        <>
          {!notificationsEnabled ? (
            <div>
              <p className="mb-4">
                Enable daily reminders to log Kay-Lee's symptoms
              </p>
              <button
                onClick={enableNotifications}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Enable Notifications
              </button>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">✓ Notifications Enabled</p>

              <h3 className="font-bold mb-2">Daily Reminders:</h3>

              {reminderTimes.map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 mb-3 p-3 bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder(index)}
                    className="w-5 h-5"
                  />
                  <span className="font-medium w-24">{reminder.label}:</span>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminderTime(index, e.target.value)}
                    disabled={!reminder.enabled}
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}

              <button
                onClick={scheduleNotifications}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save & Reschedule
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NotificationSettings;
