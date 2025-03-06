const employeeData = [
  {
    "id": 1, "firstName": "Amit", "email": "employee1@example.com", "password": "123",
    "tasks": [
      { "title": "Task 1", "description": "Description 1", "date": "2025-02-22", "category": "Category A", "active": true, "completed": false, "failed": false },
      { "title": "Task 2", "description": "Description 2", "date": "2025-02-23", "category": "Category B", "active": false, "completed": true, "failed": false }
    ],
    "taskNumbers": { "active": 1, "completed": 1, "failed": 0 }
  },
  {
    "id": 2, "firstName": "Priya", "email": "employee2@example.com", "password": "123",
    "tasks": [
      { "title": "Task 1", "description": "Description 1", "date": "2025-02-24", "category": "Category C", "active": true, "completed": false, "failed": false },
      { "title": "Task 2", "description": "Description 2", "date": "2025-02-25", "category": "Category D", "active": false, "completed": true, "failed": false }
    ],
    "taskNumbers": { "active": 1, "completed": 1, "failed": 0 }
  },
  {
    "id": 3, "firstName": "Rahul", "email": "employee3@example.com", "password": "123",
    "tasks": [
      { "title": "Task 1", "description": "Description 1", "date": "2025-02-26", "category": "Category E", "active": false, "completed": false, "failed": true },
      { "title": "Task 2", "description": "Description 2", "date": "2025-02-27", "category": "Category F", "active": true, "completed": false, "failed": false }
    ],
    "taskNumbers": { "active": 1, "completed": 0, "failed": 1 }
  },
  {
    "id": 4, "firstName": "Neha", "email": "employee4@example.com", "password": "123",
    "tasks": [
      { "title": "Task 1", "description": "Description 1", "date": "2025-02-28", "category": "Category G", "active": false, "completed": true, "failed": false },
      { "title": "Task 2", "description": "Description 2", "date": "2025-03-01", "category": "Category H", "active": true, "completed": false, "failed": false }
    ],
    "taskNumbers": { "active": 1, "completed": 1, "failed": 0 }
  },
  {
    "id": 5, "firstName": "Kiran", "email": "employee5@example.com", "password": "123",
    "tasks": [
      { "title": "Task 1", "description": "Description 1", "date": "2025-03-02", "category": "Category I", "active": true, "completed": false, "failed": false },
      { "title": "Task 2", "description": "Description 2", "date": "2025-03-03", "category": "Category J", "active": false, "completed": false, "failed": true }
    ],
    "taskNumbers": { "active": 1, "completed": 0, "failed": 1 }
  }
];

const admin = [
  {
    "id": 1, "firstName": "Vikram", "email": "admin1@example.com", "password": "123"
  },
  {
    "id": 2, "firstName": "Ananya", "email": "admin2@example.com", "password": "123"
  }
];



  export const  setLocalStorage = ()=>{
    localStorage.setItem('employee',JSON.stringify(employeeData))
    localStorage.setItem('Admin',JSON.stringify(admin))
  }

  export const getLocalStorage = () => {
    const employeesData = JSON.parse(localStorage.getItem("employeeData")) || [];
    const adminData = JSON.parse(localStorage.getItem("admin")) || {};  

    return { employees: employeesData, admin: adminData };
};