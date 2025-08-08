const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'project_c';

const transformProjectFromDB = (dbProject) => {
  return {
    Id: dbProject.Id,
    name: dbProject.Name,
    description: dbProject.description_c,
    createdAt: dbProject.created_at_c || dbProject.CreatedOn,
    updatedAt: dbProject.updated_at_c || dbProject.ModifiedOn
  };
};

const transformProjectToDB = (projectData) => {
  const dbData = {};
  
  // Only include updateable fields
  if (projectData.name !== undefined) dbData.Name = projectData.name;
  if (projectData.description !== undefined) dbData.description_c = projectData.description;
  
  // Set timestamps for create operations
  if (projectData.createdAt !== undefined) dbData.created_at_c = projectData.createdAt;
  if (projectData.updatedAt !== undefined) dbData.updated_at_c = projectData.updatedAt;
  
  return dbData;
};

export const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(transformProjectFromDB);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching projects:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
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
        throw new Error("Project not found");
      }
      
      return transformProjectFromDB(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching project:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching project:", error.message);
        throw error;
      }
    }
  },

  async create(projectData) {
    try {
      const dbProjectData = transformProjectToDB({
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const params = {
        records: [dbProjectData]
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
          console.error(`Failed to create projects ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return transformProjectFromDB(successfulRecords[0].data);
        }
      }
      
      throw new Error("Failed to create project");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating project:", error.message);
        throw error;
      }
    }
  },

  async update(id, projectData) {
    try {
      const dbProjectData = transformProjectToDB({
        ...projectData,
        updatedAt: new Date().toISOString()
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbProjectData
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
          console.error(`Failed to update projects ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return transformProjectFromDB(successfulRecords[0].data);
        }
      }
      
      throw new Error("Failed to update project");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating project:", error.message);
        throw error;
      }
    }
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
          console.error(`Failed to delete projects ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting project:", error.message);
        throw error;
      }
    }
  }
};