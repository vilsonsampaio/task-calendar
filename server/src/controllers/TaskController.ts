import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import * as Yup from 'yup';

import { prismaClient } from '../database/prismaClient';
import { convertDurationToMinutes } from '../utils/convertDurationToMinutes';

const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required("O título é obrigatório"),
  description: Yup.string()
    .notRequired(),
  date: Yup.date()
    .required("A data é obrigatória")
    .typeError("Informe uma data válida"),
  duration: Yup.string()
    .matches(/^\d\d:\d\d$/gm, 'Duração apenas permitida no formato hh:mm')
    .required("A duração é obrigatória")
});

export class TaskController {
  async create(request: Request, response: Response) {
    const { title, description, date, duration  } = request.body;

    await taskSchema.validate({ title, description, date, duration }, {
      abortEarly: false,
    });

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
    try {
      const { id } = request.params;
  
      if (!id) {
        return response.status(400).json({ message: 'O ID é obrigatório' });
      }
  
      const { title, description, date, duration } = request.body;
  
      await taskSchema.validate({ title, description, date, duration }, {
        abortEarly: false,
      });
  
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return response.status(404).json({ message: 'Não existe tarefa com o ID informado' });
        }
      }

      throw error;
    }
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;

    const task = await prismaClient.task.delete({
      where: {
        id: id,
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