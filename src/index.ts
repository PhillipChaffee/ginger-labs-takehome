import {RegisterRoutes} from "../build/routes";
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
  json,
  urlencoded
} from "express";
import {ValidateError} from "tsoa";
import swaggerUi from "swagger-ui-express";
import registerJobsRunner from "./resources/jobs/jobsRunner";

export const app = express();

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);

// Swagger UI
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

// Generic error handling to return 500 on any uncaught error
app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

// Register all job queues
registerJobsRunner();

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}/docs`)
);