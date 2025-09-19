import { toast } from 'react-toastify';

const tableName = 'course_c';

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "grade_categories_c" } },
          { field: { Name: "current_grade_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
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
      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || course.Name,
        professor: course.professor_c,
        credits: course.credits_c || 0,
        color: course.color_c || '#0ea5e9',
        semester: course.semester_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
        currentGrade: course.current_grade_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
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
          { field: { Name: "name_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "grade_categories_c" } },
          { field: { Name: "current_grade_c" } }
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

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || course.Name,
        professor: course.professor_c,
        credits: course.credits_c || 0,
        color: course.color_c || '#0ea5e9',
        semester: course.semester_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
        currentGrade: course.current_grade_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: courseData.name,
          Tags: courseData.tags || '',
          name_c: courseData.name,
          professor_c: courseData.professor,
          credits_c: courseData.credits,
          color_c: courseData.color,
          semester_c: courseData.semester,
          schedule_c: JSON.stringify(courseData.schedule || []),
          grade_categories_c: JSON.stringify(courseData.gradeCategories || []),
          current_grade_c: courseData.currentGrade || 0
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
          console.error(`Failed to create courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
            name: createdRecord.name_c || createdRecord.Name,
            professor: createdRecord.professor_c,
            credits: createdRecord.credits_c || 0,
            color: createdRecord.color_c || '#0ea5e9',
            semester: createdRecord.semester_c,
            schedule: createdRecord.schedule_c ? JSON.parse(createdRecord.schedule_c) : [],
            gradeCategories: createdRecord.grade_categories_c ? JSON.parse(createdRecord.grade_categories_c) : [],
            currentGrade: createdRecord.current_grade_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course in Course service:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: id,
          Name: courseData.name,
          Tags: courseData.tags || '',
          name_c: courseData.name,
          professor_c: courseData.professor,
          credits_c: courseData.credits,
          color_c: courseData.color,
          semester_c: courseData.semester,
          schedule_c: JSON.stringify(courseData.schedule || []),
          grade_categories_c: JSON.stringify(courseData.gradeCategories || []),
          current_grade_c: courseData.currentGrade || 0
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
          console.error(`Failed to update courses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
            name: updatedRecord.name_c || updatedRecord.Name,
            professor: updatedRecord.professor_c,
            credits: updatedRecord.credits_c || 0,
            color: updatedRecord.color_c || '#0ea5e9',
            semester: updatedRecord.semester_c,
            schedule: updatedRecord.schedule_c ? JSON.parse(updatedRecord.schedule_c) : [],
            gradeCategories: updatedRecord.grade_categories_c ? JSON.parse(updatedRecord.grade_categories_c) : [],
            currentGrade: updatedRecord.current_grade_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course in Course service:", error?.response?.data?.message);
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
          console.error(`Failed to delete Courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
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