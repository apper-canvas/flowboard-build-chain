const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'task_c';

const transformTaskFromDB = (dbTask) => {
  return {
    Id: dbTask.Id,
    projectId: dbTask.project_id_c?.Id || dbTask.project_id_c,
    title: dbTask.title_c || dbTask.Name,
    description: dbTask.description_c,
    status: dbTask.status_c,
    priority: dbTask.priority_c,
    startDate: dbTask.start_date_c,
    dueDate: dbTask.due_date_c,
    createdAt: dbTask.created_at_c || dbTask.CreatedOn,
    updatedAt: dbTask.updated_at_c || dbTask.ModifiedOn,
    archived: dbTask.archived_c
  };
};

const transformTaskToDB = (taskData) => {
  const dbData = {};
  
  // Only include updateable fields
  if (taskData.title !== undefined) dbData.title_c = taskData.title;
  if (taskData.description !== undefined) dbData.description_c = taskData.description;
  if (taskData.status !== undefined) dbData.status_c = taskData.status;
  if (taskData.priority !== undefined) dbData.priority_c = taskData.priority;
  if (taskData.startDate !== undefined) dbData.start_date_c = taskData.startDate;
  if (taskData.dueDate !== undefined) dbData.due_date_c = taskData.dueDate;
  if (taskData.archived !== undefined) dbData.archived_c = taskData.archived;
  if (taskData.projectId !== undefined) dbData.project_id_c = parseInt(taskData.projectId);
  
  // Set timestamps for create operations
  if (taskData.createdAt !== undefined) dbData.created_at_c = taskData.createdAt;
  if (taskData.updatedAt !== undefined) dbData.updated_at_c = taskData.updatedAt;
  
  return dbData;
};

export const taskService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformTaskFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Task not found");
      }
      
      return transformTaskFromDB(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching task:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching task:", error.message);
        throw error;
      }
    }
  },

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformTaskFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by project:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks by project:", error.message);
        throw error;
      }
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "archived_c",
            Operator: "EqualTo",
            Values: [false]
          }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "start_date_c",
                    operator: "LessThanOrEqualTo",
                    values: [endDate.toISOString()]
                  }
                ],
                operator: "AND"
              },
              {
                conditions: [
                  {
                    fieldName: "due_date_c", 
                    operator: "GreaterThanOrEqualTo",
                    values: [startDate.toISOString()]
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformTaskFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by date range:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks by date range:", error.message);
        throw error;
      }
    }
  },

  async getActive() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "archived_c",
            Operator: "EqualTo", 
            Values: [false]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformTaskFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching active tasks:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching active tasks:", error.message);
        throw error;
      }
    }
  },

  async getArchived() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "archived_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformTaskFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching archived tasks:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching archived tasks:", error.message);
        throw error;
      }
    }
  },

  async create(taskData) {
    try {
      const dbTaskData = transformTaskToDB({
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false
      });
      
      const params = {
        records: [dbTaskData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return transformTaskFromDB(successfulRecords[0].data);
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating task:", error.message);
        throw error;
      }
    }
  },

  async update(id, taskData) {
    try {
      const dbTaskData = transformTaskToDB({
        ...taskData,
        updatedAt: new Date().toISOString()
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbTaskData
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return transformTaskFromDB(successfulRecords[0].data);
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating task:", error.message);
        throw error;
      }
    }
  },

  async archive(id) {
    return await this.update(id, { archived: true });
  },

  async restore(id) {
    return await this.update(id, { archived: false });
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting task:", error.message);
        throw error;
      }
    }
  }
};