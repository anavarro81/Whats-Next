import { getDB } from "../bd.js";

export const deleteBD = async () => {
  try {
    const db = await getDB();
    const tasksCollection = db.collection("tasks");
    const recurringTasksCollection = db.collection("recurringTasks");

    await tasksCollection.deleteMany({});
    console.log("Se ha borrado la base de datos: tasks");

    await recurringTasksCollection.deleteMany({});
    console.log("Se ha borrado la base de datos: recurringTasks");
    process.exit(1);
  } catch (error) {
    console.error("Error al borrar la base de datos", error);
  }
};

deleteBD();
