import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { convertDurationToMinutes } from '../utils/convertDurationToMinutes';

export class TaskController {
  async create(request: Request, response: Response) {
    const { title, description, date, duration  } = request.body;

    const task = await prismaClient.task.create({
      data: {
        title,
        description,
        date,
        duration: convertDurationToMinutes(duration),
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        duration: true,
      }
    });

    return response.json(task);
  }

  async index(request: Request, response: Response) {
    const tasks = await prismaClient.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        duration: true,
      },
      orderBy: {
        created_at: 'asc',
      },
      
    });

    return response.json(tasks);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, description, date, duration } = request.body;

    const task = await prismaClient.task.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        date,
        duration: convertDurationToMinutes(duration),
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        duration: true,
      }
    });

    return response.json(task);
  }
}