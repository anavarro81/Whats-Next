import {getDB} from '../bd.js'
import { taskData } from "../data/taskData.js";

export const loadTasks = async () => {
  try {
    

    const db = await getDB()
    const tasksCollection = db.collection('tasks')

    await tasksCollection.deleteMany({});
    console.log("Se han borrado las tareas");
    await tasksCollection.insertMany(taskData);
    console.log("Tareas cargadas correctamente");
    process.exit(1)
  } catch (error) {
    console.error("Error al cargar las tareas", error);
  }
};

loadTasks();

