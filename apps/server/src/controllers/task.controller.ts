
import prisma from "../db/prisma.ts";
import ApiError from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import asyncHandlerFunction from "../utils/asyncHandler.ts";
import type { TaskPayload } from "../types/controllers/task.ts";
import { status } from "../helpers/constants.ts";


export const createTask = asyncHandlerFunction(async (req, res) => {
  const payload:TaskPayload = req.body;

  const userId = req.user.id;

  const { description, endTime, startTime, title } = payload;
  const required: (keyof TaskPayload)[] = [
    "title",
    "description",
    "startTime",
    "endTime",
  ];
  for (const field of required) {
    const val = payload[field];
    if (
      val === undefined ||
      val === null ||
      (typeof val === "string" && val.trim() === "")
    ) {
      throw new ApiError(`${field} is missing`, 400);
    }
  }
    const start = new Date(startTime);
  const end = new Date(endTime);

   if (end < start) {
    throw new ApiError("endTime cannot be earlier than startTime", 400);
  }

  const task = await prisma.task.create({
    data: {
      title:title.trim(),
      description:description.trim(),
      endTime : end,
      startTime:start,
      userId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse("Task created successfully", 201, {}, true));
});

export const getTasks = asyncHandlerFunction(async (req, res) => {
  const userId = req.user.id;
  const search = (req.query.search as string) || "";
  const status = (req.query.status as string) || "";
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {
    userId,
  };

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (status) {
    where.status = status.toUpperCase();
  }

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const result = {
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    page,
    totalPages,
    records: tasks,
    limit,
    totalRecords: total,
  };

  return res
    .status(200)
    .json(new ApiResponse("Fetched total tasks", 200, result, true));
});

export const getTask = asyncHandlerFunction(async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  if (!taskId) {
    throw new ApiError("Task id not found", 401);
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError("Task details not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse("Successfully fetched task", 200, task, true));
});

export const deleteTask = asyncHandlerFunction(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  if (!taskId) {
    throw new ApiError("Task id not found", 401);
  }
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
  if (!task) {
    throw new ApiError("Task not found or unauthorized", 404);
  }
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse("Successfully deleted task", 200, {}, true));
});

export const updateTask = asyncHandlerFunction(async (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;
  if (!status) {
    throw new ApiError("Status not found", 401);
  }

  const isValidStatus = Object.values(status).find(
    (st) => st === status.toUpperCase()
  );

  if (!isValidStatus) {
    throw new ApiError("Not valid status ", 401);
  }

  await prisma.task.update({
    data: {
      status: status.toUpperCase(),
    },
    where: {
      id: taskId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse("Task status toggled successfully", 200, {}, true));
});
