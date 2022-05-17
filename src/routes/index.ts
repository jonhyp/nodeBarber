import { Router } from "express";
import appointmentsRouter from "./appointments.routes";

const routes = Router();

routes.use("/appointments", appointmentsRouter);
//Todas as rotas que iniciarem com /appointments, serao redirecionadas para o arquivo ./appointments.routes

export default routes;
