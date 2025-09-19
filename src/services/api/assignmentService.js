import { toast } from 'react-toastify';

const tableName = 'assignment_c';

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "estimated_time_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 200, offset: 0 }
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        title: assignment.title_c || assignment.Name,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        grade: assignment.grade_c,
        category: assignment.category_c,
        estimatedTime: assignment.estimated_time_c,
        notes: assignment.notes_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "estimated_time_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        title: assignment.title_c || assignment.Name,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        grade: assignment.grade_c,
        category: assignment.category_c,
        estimatedTime: assignment.estimated_time_c,
        notes: assignment.notes_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: assignmentData.title,
          Tags: assignmentData.tags || '',
          course_id_c: parseInt(assignmentData.courseId),
          title_c: assignmentData.title,
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          status_c: assignmentData.status,
          grade_c: assignmentData.grade,
          category_c: assignmentData.category,
          estimated_time_c: assignmentData.estimatedTime,
          notes_c: assignmentData.notes
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            courseId: createdRecord.course_id_c?.Id || createdRecord.course_id_c,
            title: createdRecord.title_c || createdRecord.Name,
            dueDate: createdRecord.due_date_c,
            priority: createdRecord.priority_c,
            status: createdRecord.status_c,
            grade: createdRecord.grade_c,
            category: createdRecord.category_c,
            estimatedTime: createdRecord.estimated_time_c,
            notes: createdRecord.notes_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment in Assignment service:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: id,
          Name: assignmentData.title,
          Tags: assignmentData.tags || '',
          course_id_c: parseInt(assignmentData.courseId),
          title_c: assignmentData.title,
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          status_c: assignmentData.status,
          grade_c: assignmentData.grade,
          category_c: assignmentData.category,
          estimated_time_c: assignmentData.estimatedTime,
          notes_c: assignmentData.notes
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            courseId: updatedRecord.course_id_c?.Id || updatedRecord.course_id_c,
            title: updatedRecord.title_c || updatedRecord.Name,
            dueDate: updatedRecord.due_date_c,
            priority: updatedRecord.priority_c,
            status: updatedRecord.status_c,
            grade: updatedRecord.grade_c,
            category: updatedRecord.category_c,
            estimatedTime: updatedRecord.estimated_time_c,
            notes: updatedRecord.notes_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment in Assignment service:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete Assignments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting records:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};