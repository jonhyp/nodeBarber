import { startOfHour } from "date-fns";
import Appointment from "../models/Appointment";
import AppointmentRepository from "../repositories/AppointmentsRepository";

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentRepository;

  constructor(appointmentsRepository: AppointmentRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate =
      this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw Error("This appointment is already booked.");
    }

    const appointment = this.appointmentsRepository.create({
      provider: provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

// O services vai conter toda a regra de negocio. É interessante que cada arquivo no services seja
//responsavel por uma ação.
