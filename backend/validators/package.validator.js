import { body } from "express-validator";

export const createPackageValidator = [
  body("packageName")
    .notEmpty()
    .withMessage("Package name is required"),

  body("packageDestination")
    .notEmpty()
    .withMessage("Destination is required"),

  body("packagePrice")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("packageDays")
    .isNumeric()
    .withMessage("Days must be a number"),
];