const express = require("express");
const router = express.Router();
const {
  getAttendanceByDate,
  getEmployeeAttendance,
  getAttendanceStats,
  logAttendance,
  getTodaysSummary,
  checkIn,
  checkOut,
  getAttendanceReport,
  getAttendancePercentage
} = require("../controllers/attendanceController");

// GET attendance stats
router.get("/stats", getAttendanceStats);

// GET today's summary
router.get("/summary/today", getTodaysSummary);

// GET attendance by date
router.get("/", getAttendanceByDate);

// GET attendance report
router.get("/report", getAttendanceReport);

// GET employee attendance
router.get("/employee/:id", getEmployeeAttendance);

// GET attendance percentage
router.get("/percentage", getAttendancePercentage);

// POST log attendance
router.post("/", logAttendance);

// POST check-in
router.post("/check-in", checkIn);

// POST check-out
router.post("/check-out", checkOut);

module.exports = router;
