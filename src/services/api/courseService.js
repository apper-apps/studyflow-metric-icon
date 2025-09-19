import coursesData from "@/services/mockData/courses.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store (simulates a database)
let courses = [...coursesData];

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    
    // Find the highest existing Id and add 1
    const maxId = courses.reduce((max, course) => Math.max(max, course.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      currentGrade: 0
    };
    
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(350);
    
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    courses[index] = { ...courseData, Id: id };
    return { ...courses[index] };
  },

  async delete(id) {
    await delay(250);
    
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    courses.splice(index, 1);
    return true;
  }
};