const AttendanceRecord = require("../models/AttendanceRecord");
const Student = require("../models/Student");

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

const recalculateStudentAttendancePercentage = async (ownerId, studentId) => {
  const records = await AttendanceRecord.find({
    owner: ownerId,
    student: studentId,
  });

  if (records.length === 0) {
    return;
  }

  const presents = records.filter((r) => r.status === "Present").length;
  const lates = records.filter((r) => r.status === "Late").length;
  const percentage = Math.round(
    ((presents + lates * 0.5) / records.length) * 100
  );

  await Student.findOneAndUpdate(
    { _id: studentId, owner: ownerId },
    { $set: { attendance: `${percentage}%` } }
  );
};

const getAttendanceByDate = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateString();
    const records = await AttendanceRecord.find({
      owner: req.user._id,
      date,
    }).populate("student", "name section image status attendance");

    return res.json({ date, records });
  } catch (error) {
    return next(error);
  }
};

const saveAttendance = async (req, res, next) => {
  try {
    const { date = getTodayDateString(), records, studentId, status, notes } =
      req.body;
    const isToday = date === getTodayDateString();

    const itemsToProcess = Array.isArray(records)
      ? records
      : studentId
      ? [{ studentId, status, notes }]
      : [];

    if (itemsToProcess.length === 0) {
      return res
        .status(400)
        .json({ message: "No attendance records provided" });
    }

    const savedRecords = [];

    for (const item of itemsToProcess) {
      const record = await AttendanceRecord.findOneAndUpdate(
        {
          owner: req.user._id,
          student: item.studentId,
          date,
        },
        {
          $set: {
            status: item.status || "Present",
            notes: item.notes || "",
          },
        },
        { upsert: true, returnDocument: "after", runValidators: true }
      );

      savedRecords.push(record);

      // If updating today's attendance, sync current status on Student
      if (isToday) {
        await Student.findOneAndUpdate(
          { _id: item.studentId, owner: req.user._id },
          { $set: { status: item.status || "Present" } }
        );
      }

      // Recalculate historical percentage
      await recalculateStudentAttendancePercentage(
        req.user._id,
        item.studentId
      );
    }

    return res.json({
      message: "Attendance saved successfully",
      date,
      count: savedRecords.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getAttendanceStats = async (req, res, next) => {
  try {
    const students = await Student.find({ owner: req.user._id });
    const totalStudents = students.length;

    // Past 7 days trend
    const days = 7;
    const trendData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

      const dayRecords = await AttendanceRecord.find({
        owner: req.user._id,
        date: dateStr,
      });

      const present = dayRecords.filter((r) => r.status === "Present").length;
      const absent = dayRecords.filter((r) => r.status === "Absent").length;
      const late = dayRecords.filter((r) => r.status === "Late").length;

      trendData.push({
        date: dateStr,
        day: dayLabel,
        present,
        absent,
        late,
      });
    }

    // Breakdown for today
    const today = getTodayDateString();
    const todayRecords = await AttendanceRecord.find({
      owner: req.user._id,
      date: today,
    });

    const presentToday = todayRecords.filter(
      (r) => r.status === "Present"
    ).length;
    const absentToday = todayRecords.filter((r) => r.status === "Absent").length;
    const lateToday = todayRecords.filter((r) => r.status === "Late").length;
    const unmarkedToday = Math.max(
      0,
      totalStudents - (presentToday + absentToday + lateToday)
    );

    // Fee status summary
    const feeSummary = {
      paid: students.filter((s) => s.feeStatus === "Paid").length,
      pending: students.filter((s) => s.feeStatus === "Pending").length,
      overdue: students.filter((s) => s.feeStatus === "Overdue").length,
    };

    return res.json({
      totalStudents,
      today: {
        date: today,
        present: presentToday,
        absent: absentToday,
        late: lateToday,
        unmarked: unmarkedToday,
      },
      feeSummary,
      weeklyTrend: trendData,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAttendanceByDate,
  saveAttendance,
  getAttendanceStats,
};
