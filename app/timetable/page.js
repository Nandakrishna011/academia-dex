"use client";

import { useState } from "react";
import { useTimetableLogic } from "@/app/hooks/useTimetable";
import { useAppStore } from "@/store/useAppStore";

import MobileTimetable from "@/components/timetable/MobileTimetable";
import DesktopTimetable from "@/components/timetable/DesktopTimetable";
import Card from "@/components/ui/Card";

// ✅ NEW IMPORT
import { exportTimetableImage } from "@/app/utils/exportTimetableImage";

// ✅ ICONS
import { Pencil, Check, Download } from "lucide-react";

export default function Timetable() {
  const {
    data,
    batch,
    subjects,
    days,
    todayKey,
    currentPeriod,
    nextClass,
    activeDayIndex,
    setActiveDayIndex,
    isEditing,
    setIsEditing,
    overrides,
    handleOverride,
    handleResetAll,
    handleDone,
    findSubject,
    subjectColorMap,
    currentRef,

    // swipe
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    dragX,
    isDragging,
  } = useTimetableLogic();

  const {
    showLeaveModal,
    handleDiscardGlobal,
    handleStayGlobal,
  } = useAppStore();

  const [isDownloading, setIsDownloading] = useState(false);

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      await exportTimetableImage({
        days,
        subjects,
        overrides,
        findSubject,
      });
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-transparent min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(255,255,255,0.1)" }}>
            Day Order Timetable
          </h1>

          <div className="text-sm space-y-1 mt-1" style={{ color: "var(--muted)" }}>
            <p>Batch {batch}</p>

            {nextClass ? (
              <p className="font-medium" style={{ color: "var(--accent)" }}>
                ⏱ {nextClass.minutesLeft} mins to {nextClass.period}
              </p>
            ) : (
              <p className="font-medium" style={{ color: "var(--muted)" }}>
                🎉 No more classes today
              </p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col items-end gap-2">
          {isEditing && (
            <button
              onClick={handleResetAll}
              className="px-3 py-1.5 text-sm rounded-lg border transition-all"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#fca5a5", borderColor: "rgba(239,68,68,0.2)" }}
            >
              Reset All
            </button>
          )}

          <button
            onClick={async () => {
              if (isEditing) {
                await handleDone();
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition shadow-sm font-medium"
            style={{ 
              backgroundColor: isEditing ? "var(--accent)" : "rgba(10,10,10,0.5)", 
              color: isEditing ? "var(--accent-fg)" : "var(--text)", 
              borderColor: isEditing ? "transparent" : "rgba(255,255,255,0.1)" 
            }}
          >
            {isEditing ? (
              <>
                <Check size={16} />
                Done
              </>
            ) : (
              <>
                <Pencil size={16} />
                Edit Optional
              </>
            )}
          </button>

          {/* 📥 DOWNLOAD BUTTON */}
          {!isEditing && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border shadow-sm transition font-medium"
              style={{
                backgroundColor: isDownloading ? "transparent" : "var(--accent)",
                color: isDownloading ? "var(--muted)" : "var(--accent-fg)",
                borderColor: isDownloading ? "rgba(255,255,255,0.1)" : "transparent"
              }}
            >
              {isDownloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Timetable
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* SWIPE CONTAINER */}
      <div
        onTouchStart={(e) => {
          if (e.target.closest("select")) return;
          handleTouchStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          if (e.target.closest("select")) return;
          handleTouchEnd(e);
        }}
      >
        {!todayKey && (
          <Card className="mb-4 text-center">
            <p style={{ color: "var(--muted)" }}>
              🎉 Holiday / No classes today
            </p>
          </Card>
        )}

        <MobileTimetable
          days={days}
          activeDayIndex={activeDayIndex}
          setActiveDayIndex={setActiveDayIndex}
          todayKey={todayKey}
          currentPeriod={currentPeriod}
          findSubject={findSubject}
          currentRef={currentRef}
          isEditing={isEditing}
          overrides={overrides}
          handleOverride={handleOverride}
          subjects={subjects}
          subjectColorMap={subjectColorMap}
          dragX={dragX}
          isDragging={isDragging}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        <DesktopTimetable
          days={days}
          todayKey={todayKey}
          currentPeriod={currentPeriod}
          findSubject={findSubject}
          currentRef={currentRef}
          isEditing={isEditing}
          overrides={overrides}
          handleOverride={handleOverride}
          subjects={subjects}
          subjectColorMap={subjectColorMap}
        />
      </div>

      {/* GLOBAL MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="p-5 rounded-xl w-80 shadow-2xl border" style={{ backgroundColor: "rgba(10,10,10,0.9)", borderColor: "color-mix(in srgb, var(--accent) 30%, rgba(255,255,255,0.1))" }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
              Unsaved Changes
            </h2>

            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              You have unsaved changes. Do you want to discard them?
            </p>

            <div className="flex justify-end gap-2 text-sm font-medium">
              <button
                onClick={handleStayGlobal}
                className="px-3 py-1.5 rounded transition"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text)" }}
              >
                Stay
              </button>

              <button
                onClick={handleDiscardGlobal}
                className="px-3 py-1.5 rounded transition font-medium"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}