import {
  createNewTask,
  runTasks,
  getTodayTask,
  
} from "./services/task.service.js";


import { mainMenu, newTaskMenu } from "./menus/menus.js";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
  let opc = 0;

  while (opc != 4) {
    let { opc } = await mainMenu();
    opc = parseInt(opc);

    let data = "";

    switch (opc) {
      case 1:
        data = await newTaskMenu();
        await createNewTask(data);

        break;
      case 2:
        await runTasks();
        break;
      case 3:
        await getTodayTask();
        break;
      case 4:
        process.exit(0);
      default:
        console.error("Opción inválida, por favor intente de nuevo.");
    }
  }
};

main();
