import * as tasksRepository from "../repository/task.repository.js";
import daysjs from "dayjs";
import { getDB } from "../bd.js";

import {
  runTaskMenu,
  runTaskOneByOneMenu,
  todayTaskMenu,
} from "../menus/menus.js";

export const getOverDueTime = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { today, endOfDay };
};

export const connectToDB = async (bdName) => {
  const db = await getDB();
  const collection = db.collection(bdName);
  return collection;
};

export const validatetaskData = (data) => {
  let validFormat = false;
  let recurringTask = false;

  const taskData = {
    taskName: "",
    timeBlock: "",
    dueDate: null,
  };

  // Extraigo el nombre de la tarea
  const taskName = data.name.match(/"([^"]+)"/);

  if (taskName) {
    taskData.taskName = taskName[1];
  } else {
    console.error("Nombre de tarea no valido");
    return { validFormat: false, taskData: null };
  }

  // Extraigo el bloque de tiempo @M (mañana), @T(Tarde) o @N (Noche)
  // Por defecto, si no se indica nada será de mañana. 
  
  const timeBlock = data.name.match(/@([MTN])/);

  if (timeBlock) {    
    taskData.timeBlock = timeBlock[1];
  } else {    
    taskData.timeBlock = "M"
  }

  // Extraigo la fecha (si existe)
  const date = data.name.match(/(\d{2}\/\d{2})/);

  if (date) {
    //2026-02-20T00:00:00Z

    const [diaStr, mesStr] = date[1].split("/");
    const day = parseInt(diaStr, 10);
    const month = parseInt(mesStr, 10) - 1; // the month is 0-indexed
    const year = "2026";

    const dueDate = new Date(Date.UTC(year, month, day));
    const dueDateStr = dueDate.toISOString();

    taskData.dueDate = new Date(dueDateStr);
  }

  if (data.interval > 0 && data.unit) {
    recurringTask = true;
    taskData.interval = data.interval;
    taskData.unit = data.unit;
  }

  validFormat = true;
  return {
    validFormat: validFormat,
    taskData: taskData,
    recurringTask: recurringTask,
  };
};

export const createNewTask = async (data) => {
  try {
    const { validFormat, taskData, recurringTask } = validatetaskData(data);

    if (validFormat) {
      console.log("datos tarea correctos");
    } else {
      console.error("datos tarea incorrectos");
      return;
    }

    // Si
    if (!taskData.dueDate && recurringTask) {
      taskData.dueDate = new Date();
    }

    await tasksRepository.insertTask(taskData);

    if (recurringTask) {
      const { taskName, interval, unit } = taskData;
      const nextOccurrence = daysjs(new Date()).add(interval, unit).toDate();
      console.log("siguiente ocurrencia: ", nextOccurrence);
      await tasksRepository.insertRecurringTask({
        taskName,
        interval,
        unit,
        nextOccurrence,
      });
    }

    return;
  } catch (error) {
    console.error("error al insertar", error);
  }
};
// Obtener todas las tareas en el orden especificado
export const getTasksToRun = async (data) => {
  try {
    const tasks = await tasksRepository.getTasks(data.order);
    return tasks;
  } catch (error) {
    console.error("error al obtener tareas", error);
    process.exit(1);
  }
};

export const runTasks = async () => {
  // selecctionar orden de tareas
  const order = await runTaskMenu();

  const tasks = await getTasksToRun(order);

  if (tasks.length == 0) {
    console.error("No existen tareas");
    return;
  }

  const { opc, postponeAmount } = await runTaskOneByOneMenu(tasks);

  let exit = "N";

  while (exit !== "S") {
    switch (opc) {
      case "completedNext":
        await tasksRepository.deleteTask(tasks[0]._id);
        tasks.shift();

        if (tasks.length > 0) {
          opc = await runTaskOneByOneMenu(tasks);
        } else {
          console.log("No quedan tareas");
          exit = "S";
        }
        break;

      case "completedExit":
        await tasksRepository.deleteTask(tasks[0]._id);
        tasks.shift();
        exit = "S";
        break;

      case "postpone":
        await tasksRepository.updateDueDate(tasks[0], postponeAmount);
        tasks.shift();
        exit = "S";
        break;

      default:
        // Esto maneja cualquier otro valor de 'opc' (equivalente al último else)
        exit = "S";
        break;
    }
  }
};

export const getTodayTask = async () => {
  try {
    const todayTask = await tasksRepository.getTodayTasks();

    if (todayTask.length > 0) {
      let opc = await todayTaskMenu(todayTask);

      while (opc != "EXIT") {
        opc = await todayTaskMenu(todayTask);
      }

      return;
    } else {
      console.log("No tienes tareas para hoy");
      return;
    }
  } catch (error) {
    console.error("error al obtener tareas de hoy ", error);
  }
};

export const getTaskBylabel = async (label) => {
  try {
    if (!label) {
      console.error("label no inforado");
      return;
    }
    const task = tasksRepository.getTaskBylabel(label);

    if (!task.length) {
      console.log(`No existen tareas para la etiqueta ${label}`);
      return;
    } else {
      return task;
    }
  } catch (error) {
    console.error("Error al recuperar las tareas de la label ", error);
  }
};

/* Recupera las tareas  recurrente con fecha anterior o igual a hoy */

export const getRecurringTask = async () => {
  try {
    const recurringTasksCollection = await connectToDB("recurringTasks");
    const { endOfDay } = getOverDueTime();
    const recurringTasks = await recurringTasksCollection
      .find({ nextOccurrence: { $lte: endOfDay } })
      .toArray();
    return recurringTasks;
  } catch (error) {
    console.error("error al obtener tareas recurrentes ", error);
  }
};

/* Inserta en la tabla de tareas las tareas recurrentes que se tienen que realizar hoy */

export const loadRecurringTask = async () => {
  try {
    const recurringTasks = await getRecurringTask();
    for (const recurringTask of recurringTasks) {
      const { _id, taskName, nextOccurrence, interval, unit } = recurringTask;
      await tasksRepository.insertTask({ taskName, dueDate: nextOccurrence });

      await tasksRepository.updateNextOccurrence(
        _id,
        interval,
        unit,
        nextOccurrence,
      );
    }
  } catch (error) {
    console.error("error al cargar tarea recurrente ", error);
  }
};
