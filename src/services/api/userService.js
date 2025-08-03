import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
    this.currentUser = null;
  }

  async login(email, password, role) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => 
          u.email === email && u.role === role
        );

        if (user) {
          this.currentUser = { ...user };
          resolve({ ...user });
        } else {
          reject(new Error("Invalid credentials or role"));
        }
      }, 300);
    });
  }

  async register(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          Id: Math.max(...this.users.map(u => u.Id)) + 1,
          ...userData,
          role: "patient",
          createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        this.currentUser = { ...newUser };
        resolve({ ...newUser });
      }, 400);
    });
  }

  getCurrentUser() {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  logout() {
    this.currentUser = null;
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === parseInt(id));
        if (user) {
          resolve({ ...user });
        } else {
          reject(new Error("User not found"));
        }
      }, 200);
    });
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.users]);
      }, 200);
    });
  }

  async getDoctors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctors = this.users.filter(u => u.role === "doctor");
        resolve([...doctors]);
      }, 200);
    });
  }

  async update(id, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.Id === parseInt(id));
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData };
          if (this.currentUser && this.currentUser.Id === parseInt(id)) {
            this.currentUser = { ...this.users[index] };
          }
          resolve({ ...this.users[index] });
        } else {
          reject(new Error("User not found"));
        }
      }, 300);
    });
  }
}

export default new UserService();