import assignmentsData from "@/services/mockData/assignments.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store (simulates a database)
let assignments = [...assignmentsData];

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(400);
    
    // Find the highest existing Id and add 1
    const maxId = assignments.reduce((max, assignment) => Math.max(max, assignment.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(350);
    
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    assignments[index] = { ...assignmentData, Id: id };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(250);
    
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    assignments.splice(index, 1);
    return true;
  }
};