import express from "express";

const router = express.Router();

import {
  insertAllStudents,
  allStudentsDetails,
} from "../controller/studentsController.js";

router.post("/insert-students", insertAllStudents);
router.get("/allStudents", allStudentsDetails);

export default router;
