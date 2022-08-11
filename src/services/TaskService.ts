import faker from '@faker-js/faker';
import { addDays, subDays } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: string;
}

class TaskService {
  private tasks: Task[];

  constructor() {
    this.tasks = [];

    for (let i = 0; i < 20; i += 1) {
      this.tasks.push({
        id: faker.datatype.uuid(),
        title: faker.lorem.words(6),
        description: faker.lorem.words(20),
        date: faker.datatype.datetime({
          min: subDays(new Date(), 3).getTime(),
          max: addDays(new Date(), 3).getTime(),
        }),
        duration: faker.random.arrayElement([
          '00:15',
          '00:30',
          '00:45',
          '01:00',
          '01:15',
          '01:30',
          '01:45',
          '02:00',
        ]),
      });
    }
  }

  private async delay(time?: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, time || 500);
    });
  }

  async listTasks(): Promise<Task[]> {
    await this.delay();

    return new Promise((resolve) => {
      resolve(this.tasks);
    });
  }
}

export default new TaskService();