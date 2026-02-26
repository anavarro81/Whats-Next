import * as tasksRepository from "../repository/task.repository.js";
import {
  runTaskMenu,
  runTaskOneByOneMenu,
  todayTaskMenu,
} from "../menus/menus.js";

export const validateTaskFormat = (data) => {
  const taskData = {
    validFormat: false,
    taskName: "",
    timeBlock: "",
    dueDate: "",
    recurring: false,
    periodity: "",
  };

  // Extraigo el nombre de la tarea
  const taskName = data.task.match(/"([^"]+)"/);
  console.log("data ", data.task);

  if (taskName) {
    taskData.taskName = taskName[1];
  } else {
    console.error("tarea no valida");
    return taskData;
  }

  // Extraigo el bloque de tiempo -M (mañana), -T(Tarde) o -N (Noche)
  const timeBlock = data.task.match(/-([MTN])/);

  if (timeBlock) {
    console.log("timeBlock: ", timeBlock[1]);
    taskData.timeBlock = timeBlock[1];
  }

  // Extraigo la fecha (si existe)
  const date = data.task.match(/(\d{2}\/\d{2})/);

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

  // El flag para taras recurrentes es: R-X donde X es la periodicidad -D(diaria), -W(Semanal)...

  const recurringTask = data.task.match(/\bR-(?:D|W|M|A)\b/);

  if (recurringTask) {
    const periodity = recurringTask.slice(1, 2);
    taskData.recurring = true;
    taskData.periodity = periodity;
  }

  taskData.validFormat = true;
  return taskData;
};

export const createNewTask = async (data) => {
  try {
    const taskData = validateTaskFormat(data);

    if (taskData.validFormat) {
      console.log("datos tarea correctos");
    } else {
      console.error("datos tarea incorrectos");
    }

    console.log("insertar datos ", taskData);

    await tasksRepository.insertTask(taskData);

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

  let opc = "";

  if (tasks.length == 0) {
    console.error('No existen tareas')
    return
  }


  opc = await runTaskOneByOneMenu(tasks);

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

      while (opc != "exit") {
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
