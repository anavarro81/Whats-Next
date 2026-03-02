import { getDB } from "../bd.js";

import * as tasksRepository from "../repository/task.repository.js";

export const deleteTask = async (id) => {
  try {
    const db = await getDB();
    await db.collection("tasks").deleteOne({ _id: id });
  } catch (error) {}
};

export const getTasks = async (order) => {
  const db = await getDB();
  const tasksCollection = db.collection("tasks");
  let task = "";
  switch (order) {
    case "random":
      task = await tasksCollection
        .aggregate([{ $sample: { size: 10 } }])
        .toArray();
      return task;
    case "desc":
      task = await tasksCollection
        .find({ dueDate: { $exists: true } })
        .sort({ dueDate: -1 })
        .toArray();

      return task;

    case "asc":
      task = await tasksCollection
        .find({ dueDate: { $exists: true } })
        .sort({ dueDate: 1 })
        .toArray();
    case "today":
      task = await tasksRepository.getTodayTasks();
      return task;
    default:
      console.error("orden no valido ");
  }
};

export const getTodayTasks = async () => {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("tasks");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTask = await tasksCollection
      .find({ dueDate: { $lte: today, $lte: endOfDay } })
      .toArray();

    return todayTask;
  } catch (error) {
    console.error("error al obtener tareas de hoy ", error);
  }
};

export const getTaskBylabel = async (label) => {
  try {
    const tasks = await tasksCollection.find({ label }).toArray();

    if (tasks.length == 0) {
      console.log(`No existen tareas de la categoria: ${label}`);
      return;
    } else {
      return tasks;
    }
  } catch (error) {
    console.log("error al recuperar las tares ", error);
  }
};

export const updateDueDate = async (postponeAmount) => {
  const db = await getDB();
  const tasksCollection = db.collection("tasks");
  const task = await tasksCollection.updateOne();
};

export const insertTask = async (taskData) => {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("tasks");
    await tasksCollection.insertOne(taskData);
    console.log("tarea insertada correctamente");
  } catch (error) {
    console.error("error al insertar tarea ", error);
  }
};


export const insertRecurringTask = async (taskData) => {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("recurringTasks");
    await tasksCollection.insertOne(taskData);
  } catch (error) {
    console.error("error al insertar tarea recurrente ", error);
  }
};  