import { pool } from "../config/mysql.config.js";
import { Response } from "../domain/response.js";
import { log } from "../utils/logger.js";
import { QUERY } from "../query/patient.query.js";

export const HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO_CONTENT" },
  NOT_FOUND: { code: 404, status: "NOT_FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

export const getPatients = (req, res) => {
  log.info(`${req.method} ${req.originalUrl}, Fetching patients`);
  pool.query(QUERY.SELECT_PATIENTS, (error, results) => {
    if (!results) {
      res
        .status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, "No patients found"));
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(HttpStatus.OK.code, HttpStatus.OK.status, "Patients retrieved", { patients: results })
        );
    }
  });
};

export const createPatient = (req, res) => {
  log.info(`${req.method} ${req.originalUrl}, Creating patient`);
  pool.query(QUERY.CREATE_PATIENT, Object.values(req.body), (error, results) => {
    if (!results) {
      log.error(error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.status,
            "Error occurred"
          )
        );
    } else {
      const patient = { id: results.insertedId, ...req.body, created_at: new Date() };

      res.status(HttpStatus.CREATED.code).send(
        new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, "Patient created", {
          patient,
        })
      );
    }
  });
};

export const getPatient = (req, res) => {
  log.info(`${req.method} ${req.originalUrl}, Fetching patient`);
  pool.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by ${req.params.id} was not found`
          )
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, "Patient retrieved", results[0]));
    }
  });
};

export const updatePatient = (req, res) => {
  log.info(`${req.method} ${req.originalUrl}, fetching patient`);
  pool.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`
          )
        );
    } else {
      log.info(`${req.method} ${req.originalUrl}, updating patient`);
      pool.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code).send(
            new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient updated`, {
              id: req.params.id,
              ...req.body,
            })
          );
        } else {
          log.error(error.message);
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(
              new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                `Error occurred`
              )
            );
        }
      });
    }
  });
};

export const deletePatient = (req, res) => {
  log.info(`${req.method} ${req.originalUrl}, Deleting patient`);
  pool.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res
        .status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, "Patient deleted", results[0]));
    } else {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by ${req.params.id} was not found`
          )
        );
    }
  });
};
