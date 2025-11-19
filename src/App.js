import React, { useState, useEffect } from "react";
import NotificationSettings from "./NotificationSettings";
import {
  Calendar,
  Plus,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Edit2,
  Save,
  History,
  FileSpreadsheet,
} from "lucide-react";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    medication: { dose: "4", timeTaken: "08:00", notes: "" },
    nausea: { morning: 5, afternoon: 5, evening: 5, notes: "" },
    lightheadedness: { episodes: 3, severity: 5, triggers: "" },
    headache: { severity: 5, location: "temples", type: "tension", notes: "" },
    eyePressure: { severity: 5, constant: true, notes: "" },
    tics: {
      vocalSeverity: 8,
      motorSeverity: 7,
      injuries: true,
      injuryDetails: "",
      suppressionLevel: 7,
      rebound: true,
    },
    pain: {
      throat: 7,
      jaw: 6,
      muscle: 6,
      stomach: 5,
    },
    school: {
      attended: true,
      suppressionLevel: 7,
      reboundSeverity: 8,
      notes: "",
    },
    mood: { overall: 5, energy: 5, anxiety: 6, irritability: 5 },
    notes: "",
  });

  const [expandedEntries, setExpandedEntries] = useState(new Set());

  // Historical data from May 2025 onwards (when severe vocal tics started)
  const recentHistoricalData = [
    {
      id: "hist-may-2025",
      date: "2025-05-15",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Just restarted after stopping in February",
      },
      nausea: {
        morning: 8,
        afternoon: 7,
        evening: 8,
        notes: "Daily nausea, very bad",
      },
      lightheadedness: {
        episodes: 5,
        severity: 7,
        triggers: "Standing up, random",
      },
      headache: {
        severity: 7,
        location: "all over",
        type: "pressure",
        notes: "Daily",
      },
      eyePressure: {
        severity: 6,
        constant: true,
        notes: "Started noticing this more",
      },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 8,
        injuries: true,
        injuryDetails:
          "THE STORM - could barely walk, breathing issues, body twisting",
        suppressionLevel: 8,
        rebound: true,
      },
      pain: { throat: 9, jaw: 7, muscle: 8, stomach: 7 },
      school: {
        attended: false,
        suppressionLevel: 0,
        reboundSeverity: 10,
        notes: "Too severe to attend",
      },
      mood: { overall: 3, energy: 2, anxiety: 9, irritability: 8 },
      notes:
        "SEVERE EXPLOSION after stopping medication - this is when we realized how much aripiprazole was helping",
    },
    {
      id: "hist-june-2025",
      date: "2025-06-15",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Back on medication, slight improvement",
      },
      nausea: { morning: 7, afternoon: 6, evening: 7, notes: "Still daily" },
      lightheadedness: { episodes: 4, severity: 6, triggers: "Throughout day" },
      headache: {
        severity: 6,
        location: "temples",
        type: "tension",
        notes: "Daily headaches",
      },
      eyePressure: {
        severity: 6,
        constant: true,
        notes: "Constant pressure feeling",
      },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 7,
        injuries: true,
        injuryDetails: "Vocal tics 85+ decibels, nose swelling and bruising",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 8, jaw: 7, muscle: 7, stomach: 6 },
      school: {
        attended: true,
        suppressionLevel: 8,
        reboundSeverity: 9,
        notes: "Suppressing all day, severe rebound at home",
      },
      mood: { overall: 4, energy: 3, anxiety: 8, irritability: 7 },
      notes:
        "Severe vocal tics started - 85+ decibels measured, family wearing earplugs constantly",
    },
    {
      id: "hist-july-2025",
      date: "2025-07-15",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "No change in vocal tics",
      },
      nausea: {
        morning: 7,
        afternoon: 6,
        evening: 7,
        notes: "Still every day",
      },
      lightheadedness: {
        episodes: 4,
        severity: 6,
        triggers: "Random throughout day",
      },
      headache: {
        severity: 7,
        location: "temples, forehead",
        type: "pressure",
        notes: "Getting worse",
      },
      eyePressure: { severity: 7, constant: true, notes: "More noticeable" },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 7,
        injuries: true,
        injuryDetails:
          "Nose bruising, self-hitting, chipped tooth from jaw clenching",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 8, jaw: 7, muscle: 7, stomach: 6 },
      school: {
        attended: true,
        suppressionLevel: 8,
        reboundSeverity: 9,
        notes: "Exhausted from suppression",
      },
      mood: { overall: 4, energy: 3, anxiety: 8, irritability: 7 },
      notes: "Chipped tooth from tics, chronic sore throat from vocal tics",
    },
    {
      id: "hist-aug-2025",
      date: "2025-08-15",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Plateaued - not helping enough",
      },
      nausea: {
        morning: 7,
        afternoon: 7,
        evening: 8,
        notes: "Daily, sometimes worse",
      },
      lightheadedness: { episodes: 5, severity: 6, triggers: "Getting worse" },
      headache: {
        severity: 7,
        location: "all over",
        type: "pressure",
        notes: "Daily",
      },
      eyePressure: { severity: 7, constant: true, notes: "Constant pressure" },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 7,
        injuries: true,
        injuryDetails: "Ongoing nose injuries, facial bruising",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 8, jaw: 7, muscle: 7, stomach: 7 },
      school: {
        attended: true,
        suppressionLevel: 8,
        reboundSeverity: 9,
        notes: "Very difficult to manage",
      },
      mood: { overall: 4, energy: 3, anxiety: 8, irritability: 7 },
      notes: "No improvement in vocal tics despite being on medication",
    },
    {
      id: "hist-sept-2025",
      date: "2025-09-15",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Discussing increase with doctor",
      },
      nausea: {
        morning: 7,
        afternoon: 7,
        evening: 7,
        notes: "Constant daily nausea",
      },
      lightheadedness: { episodes: 5, severity: 7, triggers: "Throughout day" },
      headache: {
        severity: 7,
        location: "temples, back of head",
        type: "pressure",
        notes: "Daily",
      },
      eyePressure: { severity: 7, constant: true, notes: "Very noticeable" },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 7,
        injuries: true,
        injuryDetails: "Continuous injuries, ringing in ears from volume",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 8, jaw: 7, muscle: 7, stomach: 7 },
      school: {
        attended: true,
        suppressionLevel: 8,
        reboundSeverity: 9,
        notes: "Struggling",
      },
      mood: { overall: 4, energy: 3, anxiety: 8, irritability: 7 },
      notes:
        "Tics causing ringing in ears from volume, family still wearing earplugs",
    },
    {
      id: "hist-oct-2025",
      date: "2025-10-15",
      medication: { dose: "4", timeTaken: "08:00", notes: "Increased to 4mg" },
      nausea: {
        morning: 7,
        afternoon: 7,
        evening: 7,
        notes: "No change with higher dose",
      },
      lightheadedness: { episodes: 5, severity: 7, triggers: "Ongoing" },
      headache: {
        severity: 7,
        location: "temples",
        type: "pressure",
        notes: "Daily",
      },
      eyePressure: { severity: 7, constant: true, notes: "Ongoing" },
      tics: {
        vocalSeverity: 9,
        motorSeverity: 7,
        injuries: true,
        injuryDetails: "Nose swelling, bruising ongoing",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 8, jaw: 7, muscle: 7, stomach: 7 },
      school: {
        attended: true,
        suppressionLevel: 8,
        reboundSeverity: 9,
        notes: "Still very difficult",
      },
      mood: { overall: 4, energy: 3, anxiety: 8, irritability: 7 },
      notes:
        "Increased medication to 4mg, waiting to see if helps. Botox referral being discussed.",
    },
  ];

  // Past historical data (July 2023 - April 2025)
  const pastHistoricalData = [
    {
      id: "hist-july-2023",
      date: "2023-07-21",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Just started aripiprazole",
      },
      nausea: {
        morning: 6,
        afternoon: 5,
        evening: 6,
        notes: "Started from beginning",
      },
      lightheadedness: {
        episodes: 0,
        severity: 0,
        triggers: "Not noticed yet",
      },
      headache: {
        severity: 4,
        location: "occasional",
        type: "mild",
        notes: "Occasional",
      },
      eyePressure: { severity: 0, constant: false, notes: "Not present yet" },
      tics: {
        vocalSeverity: 5,
        motorSeverity: 9,
        injuries: false,
        injuryDetails:
          "Could not walk downstairs alone, could not use stove/knife, body twisting so severely could not stand",
        suppressionLevel: 3,
        rebound: false,
      },
      pain: { throat: 3, jaw: 5, muscle: 8, stomach: 6 },
      school: {
        attended: false,
        suppressionLevel: 0,
        reboundSeverity: 0,
        notes: "Too severe to attend",
      },
      mood: { overall: 3, energy: 2, anxiety: 7, irritability: 6 },
      notes:
        "BASELINE SEVERITY - Starting treatment. Could not function safely. Severe muscle spasms.",
    },
    {
      id: "hist-aug-2023",
      date: "2023-08-12",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "First 8 days no change, then slight improvement",
      },
      nausea: {
        morning: 6,
        afternoon: 5,
        evening: 6,
        notes: "Stomach pain present from start",
      },
      lightheadedness: {
        episodes: 2,
        severity: 3,
        triggers: "Starting to notice",
      },
      headache: {
        severity: 4,
        location: "occasional",
        type: "mild",
        notes: "",
      },
      eyePressure: { severity: 0, constant: false, notes: "" },
      tics: {
        vocalSeverity: 5,
        motorSeverity: 8,
        injuries: false,
        injuryDetails: "Gradual improvement in motor tics",
        suppressionLevel: 4,
        rebound: false,
      },
      pain: { throat: 3, jaw: 5, muscle: 7, stomach: 6 },
      school: {
        attended: false,
        suppressionLevel: 0,
        reboundSeverity: 0,
        notes: "Still adjusting to medication",
      },
      mood: { overall: 4, energy: 3, anxiety: 6, irritability: 6 },
      notes: "First progress report - slight improvement noticed",
    },
    {
      id: "hist-feb-2025",
      date: "2025-02-15",
      medication: {
        dose: "0",
        timeTaken: "",
        notes: "STOPPED - worried about low WBC and illness",
      },
      nausea: {
        morning: 5,
        afternoon: 4,
        evening: 5,
        notes: "Better without medication",
      },
      lightheadedness: {
        episodes: 3,
        severity: 5,
        triggers: "Been present over a year",
      },
      headache: {
        severity: 5,
        location: "occasional",
        type: "mild",
        notes: "",
      },
      eyePressure: { severity: 0, constant: false, notes: "Not yet noticed" },
      tics: {
        vocalSeverity: 6,
        motorSeverity: 6,
        injuries: false,
        injuryDetails: "First 2 weeks okay",
        suppressionLevel: 5,
        rebound: false,
      },
      pain: { throat: 4, jaw: 6, muscle: 6, stomach: 5 },
      school: {
        attended: true,
        suppressionLevel: 6,
        reboundSeverity: 6,
        notes: "Mood volatile",
      },
      mood: { overall: 4, energy: 4, anxiety: 7, irritability: 7 },
      notes:
        "Stopped medication due to low WBC concern. Mood became noticeably more volatile.",
    },
    {
      id: "hist-april-2024",
      date: "2024-04-30",
      medication: {
        dose: "3",
        timeTaken: "08:00",
        notes: "Stable on dose, no change in tics",
      },
      nausea: { morning: 6, afternoon: 5, evening: 6, notes: "Ongoing" },
      lightheadedness: {
        episodes: 3,
        severity: 5,
        triggers: "Ongoing for months",
      },
      headache: {
        severity: 5,
        location: "temples",
        type: "tension",
        notes: "Frequent",
      },
      eyePressure: { severity: 0, constant: false, notes: "" },
      tics: {
        vocalSeverity: 6,
        motorSeverity: 6,
        injuries: false,
        injuryDetails: "Less aggressive than before but still present",
        suppressionLevel: 6,
        rebound: true,
      },
      pain: { throat: 4, jaw: 6, muscle: 6, stomach: 6 },
      school: {
        attended: true,
        suppressionLevel: 7,
        reboundSeverity: 7,
        notes: "Continuing as normal",
      },
      mood: { overall: 5, energy: 4, anxiety: 6, irritability: 6 },
      notes:
        "Big difference noted - tics less aggressive but still present. Medication helping but not enough.",
    },
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ticTrackerData");
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // If no saved data, load recent historical data by default
      setEntries(recentHistoricalData);
      localStorage.setItem(
        "ticTrackerData",
        JSON.stringify(recentHistoricalData)
      );
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("ticTrackerData", JSON.stringify(entries));
    }
  }, [entries]);

  const loadPastHistory = () => {
    if (!historyLoaded) {
      const allHistory = [...pastHistoricalData, ...entries];
      // Sort by date
      allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(allHistory);
      setHistoryLoaded(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingId ? { ...formData, id: editingId } : entry
        )
      );
      setEditingId(null);
    } else {
      const newEntry = {
        ...formData,
        id: Date.now().toString(),
      };
      setEntries([newEntry, ...entries]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      medication: { dose: "4", timeTaken: "08:00", notes: "" },
      nausea: { morning: 5, afternoon: 5, evening: 5, notes: "" },
      lightheadedness: { episodes: 3, severity: 5, triggers: "" },
      headache: {
        severity: 5,
        location: "temples",
        type: "tension",
        notes: "",
      },
      eyePressure: { severity: 5, constant: true, notes: "" },
      tics: {
        vocalSeverity: 8,
        motorSeverity: 7,
        injuries: true,
        injuryDetails: "",
        suppressionLevel: 7,
        rebound: true,
      },
      pain: { throat: 7, jaw: 6, muscle: 6, stomach: 5 },
      school: {
        attended: true,
        suppressionLevel: 7,
        reboundSeverity: 8,
        notes: "",
      },
      mood: { overall: 5, energy: 5, anxiety: 6, irritability: 5 },
      notes: "",
    });
  };

  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tic-tracker-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const exportForDoctors = () => {
    let report = "TIC TRACKER - SYMPTOM REPORT\n";
    report += "================================\n\n";
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += `Total Entries: ${entries.length}\n\n`;

    entries.forEach((entry, index) => {
      report += `\nENTRY ${index + 1}: ${entry.date}\n`;
      report += "-----------------------------------\n";
      report += `Medication: ${entry.medication.dose}mg at ${entry.medication.timeTaken}\n`;
      report += `\nNausea: Morning ${entry.nausea.morning}/10, Afternoon ${entry.nausea.afternoon}/10, Evening ${entry.nausea.evening}/10\n`;
      report += `Lightheadedness: ${entry.lightheadedness.episodes} episodes, Severity ${entry.lightheadedness.severity}/10\n`;
      report += `Headache: ${entry.headache.severity}/10 (${entry.headache.type}, ${entry.headache.location})\n`;
      report += `Eye Pressure: ${entry.eyePressure.severity}/10 (${
        entry.eyePressure.constant ? "Constant" : "Intermittent"
      })\n`;
      report += `\nTics:\n`;
      report += `  Vocal Severity: ${entry.tics.vocalSeverity}/10\n`;
      report += `  Motor Severity: ${entry.tics.motorSeverity}/10\n`;
      report += `  Injuries: ${entry.tics.injuries ? "Yes" : "No"}\n`;
      if (entry.tics.injuryDetails)
        report += `  Details: ${entry.tics.injuryDetails}\n`;
      report += `  Suppression Level: ${entry.tics.suppressionLevel}/10\n`;
      report += `  Rebound: ${entry.tics.rebound ? "Yes" : "No"}\n`;
      report += `\nPain Levels:\n`;
      report += `  Throat: ${entry.pain.throat}/10\n`;
      report += `  Jaw: ${entry.pain.jaw}/10\n`;
      report += `  Muscle: ${entry.pain.muscle}/10\n`;
      report += `  Stomach: ${entry.pain.stomach}/10\n`;
      report += `\nSchool: ${entry.school.attended ? "Attended" : "Absent"}\n`;
      if (entry.school.attended) {
        report += `  Suppression: ${entry.school.suppressionLevel}/10\n`;
        report += `  Rebound: ${entry.school.reboundSeverity}/10\n`;
      }
      report += `\nMood:\n`;
      report += `  Overall: ${entry.mood.overall}/10\n`;
      report += `  Energy: ${entry.mood.energy}/10\n`;
      report += `  Anxiety: ${entry.mood.anxiety}/10\n`;
      report += `  Irritability: ${entry.mood.irritability}/10\n`;
      if (entry.notes) report += `\nNotes: ${entry.notes}\n`;
      report += "\n";
    });

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tic-tracker-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
  };

  const exportToGoogleSheets = () => {
    // Create CSV format for Google Sheets
    let csv =
      "Date,Medication Dose,Time Taken,Nausea (Morning),Nausea (Afternoon),Nausea (Evening),Lightheadedness Episodes,Lightheadedness Severity,Headache Severity,Headache Location,Headache Type,Eye Pressure Severity,Eye Pressure Constant,Vocal Tic Severity,Motor Tic Severity,Injuries,Injury Details,Suppression Level,Rebound,Throat Pain,Jaw Pain,Muscle Pain,Stomach Pain,School Attended,School Suppression,School Rebound,Mood Overall,Energy,Anxiety,Irritability,Notes\n";

    entries.forEach((entry) => {
      csv += `${entry.date},`;
      csv += `${entry.medication.dose}mg,`;
      csv += `${entry.medication.timeTaken},`;
      csv += `${entry.nausea.morning},`;
      csv += `${entry.nausea.afternoon},`;
      csv += `${entry.nausea.evening},`;
      csv += `${entry.lightheadedness.episodes},`;
      csv += `${entry.lightheadedness.severity},`;
      csv += `${entry.headache.severity},`;
      csv += `${entry.headache.location},`;
      csv += `${entry.headache.type},`;
      csv += `${entry.eyePressure.severity},`;
      csv += `${entry.eyePressure.constant ? "Yes" : "No"},`;
      csv += `${entry.tics.vocalSeverity},`;
      csv += `${entry.tics.motorSeverity},`;
      csv += `${entry.tics.injuries ? "Yes" : "No"},`;
      csv += `"${entry.tics.injuryDetails.replace(/"/g, '""')}",`;
      csv += `${entry.tics.suppressionLevel},`;
      csv += `${entry.tics.rebound ? "Yes" : "No"},`;
      csv += `${entry.pain.throat},`;
      csv += `${entry.pain.jaw},`;
      csv += `${entry.pain.muscle},`;
      csv += `${entry.pain.stomach},`;
      csv += `${entry.school.attended ? "Yes" : "No"},`;
      csv += `${entry.school.suppressionLevel},`;
      csv += `${entry.school.reboundSeverity},`;
      csv += `${entry.mood.overall},`;
      csv += `${entry.mood.energy},`;
      csv += `${entry.mood.anxiety},`;
      csv += `${entry.mood.irritability},`;
      csv += `"${entry.notes.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tic-tracker-data.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Tic Tracker</h1>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Track symptoms for Kay-Lee's Tourette's Syndrome
          </p>
          <NotificationSettings />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Entry
            </button>
            {!historyLoaded && (
              <button
                onClick={loadPastHistory}
                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                <History className="w-4 h-4" />
                Load Past History
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={exportToGoogleSheets}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to Google Sheets
            </button>
            <button
              onClick={exportForDoctors}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={exportData}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Backup Data
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Entry" : "New Entry"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {/* Medication */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Medication (Aripiprazole)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dose (mg)
                    </label>
                    <input
                      type="text"
                      value={formData.medication.dose}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          medication: {
                            ...formData.medication,
                            dose: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Taken
                    </label>
                    <input
                      type="time"
                      value={formData.medication.timeTaken}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          medication: {
                            ...formData.medication,
                            timeTaken: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={formData.medication.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          medication: {
                            ...formData.medication,
                            notes: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      placeholder="Any changes or observations"
                    />
                  </div>
                </div>
              </div>

              {/* Nausea */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Nausea (0-10 scale)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Morning: {formData.nausea.morning}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.nausea.morning}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nausea: {
                            ...formData.nausea,
                            morning: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Afternoon: {formData.nausea.afternoon}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.nausea.afternoon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nausea: {
                            ...formData.nausea,
                            afternoon: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evening: {formData.nausea.evening}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.nausea.evening}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nausea: {
                            ...formData.nausea,
                            evening: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.nausea.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nausea: { ...formData.nausea, notes: e.target.value },
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="What made it better or worse?"
                  />
                </div>
              </div>

              {/* Lightheadedness */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Lightheadedness
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Episodes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lightheadedness.episodes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lightheadedness: {
                            ...formData.lightheadedness,
                            episodes: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity (0-10): {formData.lightheadedness.severity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.lightheadedness.severity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lightheadedness: {
                            ...formData.lightheadedness,
                            severity: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Triggers/When it happens
                  </label>
                  <input
                    type="text"
                    value={formData.lightheadedness.triggers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lightheadedness: {
                          ...formData.lightheadedness,
                          triggers: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., standing up, random, after tics"
                  />
                </div>
              </div>

              {/* Headache */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Headache
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity (0-10): {formData.headache.severity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.headache.severity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headache: {
                            ...formData.headache,
                            severity: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.headache.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headache: {
                            ...formData.headache,
                            location: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., temples, all over"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.headache.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headache: {
                            ...formData.headache,
                            type: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="tension">Tension</option>
                      <option value="pressure">Pressure</option>
                      <option value="sharp">Sharp</option>
                      <option value="throbbing">Throbbing</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Eye Pressure */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Eye Pressure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity (0-10): {formData.eyePressure.severity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.eyePressure.severity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eyePressure: {
                            ...formData.eyePressure,
                            severity: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.eyePressure.constant}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eyePressure: {
                              ...formData.eyePressure,
                              constant: e.target.checked,
                            },
                          })
                        }
                        className="mr-2"
                      />
                      Constant (vs. comes and goes)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tics */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Tics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vocal Tic Severity (0-10): {formData.tics.vocalSeverity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.tics.vocalSeverity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tics: {
                            ...formData.tics,
                            vocalSeverity: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motor Tic Severity (0-10): {formData.tics.motorSeverity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.tics.motorSeverity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tics: {
                            ...formData.tics,
                            motorSeverity: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suppression Level at School (0-10):{" "}
                      {formData.tics.suppressionLevel}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.tics.suppressionLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tics: {
                            ...formData.tics,
                            suppressionLevel: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.tics.rebound}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tics: {
                              ...formData.tics,
                              rebound: e.target.checked,
                            },
                          })
                        }
                        className="mr-2"
                      />
                      Rebound at home (tics explode after school)
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.tics.injuries}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tics: {
                            ...formData.tics,
                            injuries: e.target.checked,
                          },
                        })
                      }
                      className="mr-2"
                    />
                    Physical injuries from tics today?
                  </label>
                </div>
                {formData.tics.injuries && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Injury Details
                    </label>
                    <input
                      type="text"
                      value={formData.tics.injuryDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tics: {
                            ...formData.tics,
                            injuryDetails: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., swollen nose, bruising, self-hitting"
                    />
                  </div>
                )}
              </div>

              {/* Pain Levels */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Pain Levels (0-10)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Throat: {formData.pain.throat}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.pain.throat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pain: {
                            ...formData.pain,
                            throat: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jaw: {formData.pain.jaw}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.pain.jaw}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pain: {
                            ...formData.pain,
                            jaw: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Muscle: {formData.pain.muscle}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.pain.muscle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pain: {
                            ...formData.pain,
                            muscle: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stomach: {formData.pain.stomach}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.pain.stomach}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pain: {
                            ...formData.pain,
                            stomach: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* School */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  School
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.school.attended}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: {
                            ...formData.school,
                            attended: e.target.checked,
                          },
                        })
                      }
                      className="mr-2"
                    />
                    Attended school today?
                  </label>
                </div>
                {formData.school.attended && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suppression Level (0-10):{" "}
                        {formData.school.suppressionLevel}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={formData.school.suppressionLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            school: {
                              ...formData.school,
                              suppressionLevel: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rebound Severity (0-10):{" "}
                        {formData.school.reboundSeverity}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={formData.school.reboundSeverity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            school: {
                              ...formData.school,
                              reboundSeverity: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.school.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        school: { ...formData.school, notes: e.target.value },
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="How was the school day?"
                  />
                </div>
              </div>

              {/* Mood */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Mood (0-10)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall: {formData.mood.overall}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.mood.overall}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mood: {
                            ...formData.mood,
                            overall: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy: {formData.mood.energy}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.mood.energy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mood: {
                            ...formData.mood,
                            energy: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anxiety: {formData.mood.anxiety}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.mood.anxiety}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mood: {
                            ...formData.mood,
                            anxiety: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Irritability: {formData.mood.irritability}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.mood.irritability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mood: {
                            ...formData.mood,
                            irritability: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* General Notes */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  placeholder="Anything else important about today..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update Entry" : "Save Entry"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
              No entries yet. Click "New Entry" to start tracking symptoms.
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {entry.date}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {expandedEntries.has(entry.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Summary View (Always Visible) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Medication</div>
                    <div className="font-semibold text-purple-700">
                      {entry.medication.dose}mg
                    </div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Vocal Tics</div>
                    <div className="font-semibold text-pink-700">
                      {entry.tics.vocalSeverity}/10
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Nausea (avg)</div>
                    <div className="font-semibold text-blue-700">
                      {Math.round(
                        (entry.nausea.morning +
                          entry.nausea.afternoon +
                          entry.nausea.evening) /
                          3
                      )}
                      /10
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Mood</div>
                    <div className="font-semibold text-green-700">
                      {entry.mood.overall}/10
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedEntries.has(entry.id) && (
                  <div className="border-t pt-4 space-y-4">
                    {/* All the detailed information */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Medication Details
                      </h4>
                      <p className="text-gray-600">
                        Taken at: {entry.medication.timeTaken}
                      </p>
                      {entry.medication.notes && (
                        <p className="text-gray-600">
                          Notes: {entry.medication.notes}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Nausea
                      </h4>
                      <p className="text-gray-600">
                        Morning: {entry.nausea.morning}/10, Afternoon:{" "}
                        {entry.nausea.afternoon}/10, Evening:{" "}
                        {entry.nausea.evening}/10
                      </p>
                      {entry.nausea.notes && (
                        <p className="text-gray-600">
                          Notes: {entry.nausea.notes}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Lightheadedness
                      </h4>
                      <p className="text-gray-600">
                        {entry.lightheadedness.episodes} episodes, Severity:{" "}
                        {entry.lightheadedness.severity}/10
                      </p>
                      {entry.lightheadedness.triggers && (
                        <p className="text-gray-600">
                          Triggers: {entry.lightheadedness.triggers}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Headache
                      </h4>
                      <p className="text-gray-600">
                        Severity: {entry.headache.severity}/10 (
                        {entry.headache.type}, {entry.headache.location})
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Eye Pressure
                      </h4>
                      <p className="text-gray-600">
                        Severity: {entry.eyePressure.severity}/10 (
                        {entry.eyePressure.constant
                          ? "Constant"
                          : "Intermittent"}
                        )
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Tics</h4>
                      <p className="text-gray-600">
                        Vocal: {entry.tics.vocalSeverity}/10, Motor:{" "}
                        {entry.tics.motorSeverity}/10
                      </p>
                      <p className="text-gray-600">
                        Suppression: {entry.tics.suppressionLevel}/10, Rebound:{" "}
                        {entry.tics.rebound ? "Yes" : "No"}
                      </p>
                      <p className="text-gray-600">
                        Injuries: {entry.tics.injuries ? "Yes" : "No"}
                      </p>
                      {entry.tics.injuryDetails && (
                        <p className="text-gray-600">
                          Details: {entry.tics.injuryDetails}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Pain Levels
                      </h4>
                      <p className="text-gray-600">
                        Throat: {entry.pain.throat}/10, Jaw: {entry.pain.jaw}
                        /10, Muscle: {entry.pain.muscle}/10, Stomach:{" "}
                        {entry.pain.stomach}/10
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        School
                      </h4>
                      <p className="text-gray-600">
                        {entry.school.attended ? "Attended" : "Did not attend"}
                      </p>
                      {entry.school.attended && (
                        <>
                          <p className="text-gray-600">
                            Suppression: {entry.school.suppressionLevel}/10,
                            Rebound: {entry.school.reboundSeverity}/10
                          </p>
                          {entry.school.notes && (
                            <p className="text-gray-600">
                              Notes: {entry.school.notes}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Mood</h4>
                      <p className="text-gray-600">
                        Overall: {entry.mood.overall}/10, Energy:{" "}
                        {entry.mood.energy}/10, Anxiety: {entry.mood.anxiety}
                        /10, Irritability: {entry.mood.irritability}/10
                      </p>
                    </div>

                    {entry.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Notes
                        </h4>
                        <p className="text-gray-600">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
