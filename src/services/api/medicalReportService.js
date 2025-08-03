import reportsData from "@/services/mockData/medicalReports.json";

class MedicalReportService {
  constructor() {
    this.reports = [...reportsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.reports]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const report = this.reports.find(r => r.Id === parseInt(id));
        if (report) {
          resolve({ ...report });
        } else {
          reject(new Error("Report not found"));
        }
      }, 200);
    });
  }

  async getByPatientId(patientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const patientReports = this.reports.filter(r => 
          r.patientId === parseInt(patientId)
        );
        resolve([...patientReports]);
      }, 300);
    });
  }

  async getByAppointmentId(appointmentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointmentReports = this.reports.filter(r => 
          r.appointmentId === parseInt(appointmentId)
        );
        resolve([...appointmentReports]);
      }, 200);
    });
  }

  async create(reportData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport = {
          Id: Math.max(...this.reports.map(r => r.Id)) + 1,
          ...reportData,
          uploadDate: new Date().toISOString()
        };
        this.reports.push(newReport);
        resolve({ ...newReport });
      }, 500);
    });
  }

  async update(id, reportData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.reports.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          this.reports[index] = { ...this.reports[index], ...reportData };
          resolve({ ...this.reports[index] });
        } else {
          reject(new Error("Report not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.reports.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.reports.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Report not found"));
        }
      }, 200);
    });
  }

  async uploadFile(file, patientId, appointmentId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reportData = {
          patientId: parseInt(patientId),
          appointmentId: appointmentId ? parseInt(appointmentId) : null,
          fileName: file.name,
          fileUrl: `/mock-files/${file.name}`,
          fileType: file.type.includes("pdf") ? "pdf" : "image"
        };
        
        const newReport = this.create(reportData);
        resolve(newReport);
      }, 800);
    });
  }

  getSupportedFileTypes() {
    return [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx"
    ];
  }

  getMaxFileSize() {
    return 5 * 1024 * 1024; // 5MB
  }
}

export default new MedicalReportService();