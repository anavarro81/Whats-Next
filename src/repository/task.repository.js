import * as tasksRepository from "../repository/task.repository.js";
import { getDB } from "../bd.js";
import daysjs from "dayjs";

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
    case "ALL":
      task = await tasksCollection.find({}).toArray()
      return task;
    case "TODAY":
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

export const updateDueDate = async (task, postponeAmount) => {
  const db = await getDB();
  const tasksCollection = db.collection("tasks");

  const { _id, dueDate } = task;

  let interval = 0;
  let unit = "";

  switch (postponeAmount) {
    case "1day":
      interval = 1;
      unit = "day";
      break;
    case "2days":
      interval = 2;
      unit = "day";
      break;
    case "7days":
      interval = 1;
      unit = "week";
      break;
    case "1month":
      interval = 1;
      unit = "month";
      break;
    default:
      break;
  }

  let nextOccurrence = daysjs(dueDate).add(interval, unit).toDate();

  try {
    const result = await tasksCollection.updateOne(
      { _id: _id },
      // { dueDate: nextOccurrence },
      { $set: { dueDate: nextOccurrence } },
    );
  } catch (error) {
    console.error('error al actualizar la tarea ', error)
  }
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

export const updateNextOccurrence = async (
  id,
  interval,
  unit,
  nextOccurrence,
) => {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("recurringTasks");

    let nextO = daysjs(nextOccurrence).add(interval, unit).toDate();

    const result = await tasksCollection.updateOne(
      { _id: id },
      { $set: { nextOccurrence: nextO } },
    );
  } catch (error) {
    console.log("Error al actualizar la tarea recurrente ", error);
  }
};
