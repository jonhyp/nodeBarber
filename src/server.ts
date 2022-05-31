import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import routes from "./routes/index";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";

import "./database";

const app = express();
app.use(express.json());
app.use("/files", express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //se esse erro foi originado a partir da minha aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "internal server error",
  });
});

app.listen(3333, () => {
  console.log("running on port 3333");
});
