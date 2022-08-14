import HttpClient from './utils/HttpClient';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
}

interface TaskRequest {
  title: string;
  description: string;
  date: Date;
  duration: string;
}

class TaskService {
  async listTasks() {
    return HttpClient.get<Task[]>('/task');
  }

  async createTask(body: TaskRequest) {
    return HttpClient.post<Task>('/task', body);
  }

  async updateTask(id: string, body: TaskRequest) {
    return HttpClient.put<Task>(`/task/${id}`, body);
  }

  async deleteTask(id: string) {
    return HttpClient.delete<Task>(`/task/${id}`);
  }
}

export default new TaskService();
