import express from "express";
import {
  getPatient,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controller/patient.controller.js";

export const patientRoutes = express.Router();

patientRoutes.route("/").get(getPatients).post(createPatient);

patientRoutes.route("/:id").get(getPatient).put(updatePatient).delete(deletePatient);
