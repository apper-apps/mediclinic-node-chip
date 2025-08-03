import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.appointments]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const appointment = this.appointments.find(a => a.Id === parseInt(id));
        if (appointment) {
          resolve({ ...appointment });
        } else {
          reject(new Error("Appointment not found"));
        }
      }, 200);
    });
  }

  async getByPatientId(patientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const patientAppointments = this.appointments.filter(a => 
          a.patientId === parseInt(patientId)
        );
        resolve([...patientAppointments]);
      }, 250);
    });
  }

  async getByDoctorId(doctorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctorAppointments = this.appointments.filter(a => 
          a.doctorId === parseInt(doctorId)
        );
        resolve([...doctorAppointments]);
      }, 250);
    });
  }

  async getTodaysAppointments(doctorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split("T")[0];
        const todaysAppointments = this.appointments.filter(a => 
          a.doctorId === parseInt(doctorId) && a.date === today
        );
        resolve([...todaysAppointments]);
      }, 200);
    });
  }

  async create(appointmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
          ...appointmentData,
          status: "upcoming",
          notes: ""
        };
        this.appointments.push(newAppointment);
        resolve({ ...newAppointment });
      }, 400);
    });
  }

  async update(id, appointmentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.appointments.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          this.appointments[index] = { ...this.appointments[index], ...appointmentData };
          resolve({ ...this.appointments[index] });
        } else {
          reject(new Error("Appointment not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.appointments.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.appointments.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Appointment not found"));
        }
      }, 200);
    });
  }

  async getAvailableTimeSlots(date, doctorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allSlots = [
          "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
          "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
        ];

        const bookedSlots = this.appointments
          .filter(a => a.date === date && a.doctorId === parseInt(doctorId) && a.status !== "cancelled")
          .map(a => a.timeSlot);

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        resolve(availableSlots);
      }, 200);
    });
  }

  getServices() {
    return [
      "General Consultation",
      "Follow-up",
      "Specialist Consultation",
      "Health Checkup",
      "Vaccination",
      "Minor Surgery",
      "Emergency Consultation"
    ];
  }
}

export default new AppointmentService();