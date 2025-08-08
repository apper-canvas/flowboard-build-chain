import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByProject(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return tasks.filter(task => {
      const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
      const taskEnd = task.dueDate ? new Date(task.dueDate) : taskStart;
      
      return (taskStart <= endDate && taskEnd >= startDate) && !task.archived;
    }).map(t => ({ ...t }));
  },

  async getActive() {
    await delay(300);
    return tasks.filter(t => !t.archived).map(t => ({ ...t }));
  },

  async getArchived() {
    await delay(300);
    return tasks.filter(t => t.archived).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      startDate: taskData.startDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  async archive(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = {
      ...tasks[index],
      archived: true,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  async restore(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = {
      ...tasks[index],
      archived: false,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  }
};