import inquirer from "inquirer";

const mainMenuChoices = [
  { name: "Alta de tarea", value: 1 },
  { name: "Ejecutar tareas", value: 2 },
  { name: "Tareas de hoy", value: 3 },
  { name: "Salir", value: 4 },
];

const runTaskQuestions = [
  { name: "Random", value: "random" },
  { name: "Descending", value: "desc" },
  { name: "Ascending", value: "asc" },
  { name: "Tareas de hoy", value: "today" },
];

const postponeOptionsChoices = [
  {name: "Mañana (24h)", value: 24},
  {name: "Pasado mañana (48h)", value: 48},
  {name: "Próxima semana", value: 7},
  {name: "Próxima mes", value: 1},
]

export const mainMenu = async () => {
  const data = await inquirer.prompt([
    {
      type: "rawlist",
      name: "opc",
      message: "Select an option:",
      choices: mainMenuChoices,
    },
  ]);

  return data;
};

export const runTaskMenu = async () => {
  const data = inquirer.prompt({
    type: "rawlist",
    name: "order",
    message: "¿En qué orden quieres mostrar las taras",
    choices: runTaskQuestions,
  });

  return data;
};

// Obtener datos la tarea en formato:
// - "Nombre de la tarea"
// - Bloque:
//   M = Mañana [9-14]
//   T = Mañana [14-20]
//   N - Noche [> 20h]
//   Fecha en formado DD/MM

export const newTaskMenu = async () => {
  const task = await inquirer.prompt({
    type: "input",
    name: "task",
    message: "Introduce la tarea en formato tasknName -[M/T/N] DD/MM",
  });
  return task;
};

export const runTaskOneByOneMenu = async (tasks) => {
  const data = await inquirer.prompt([
    {
      type: "rawlist",
      name: "opc",
      message: `¿Has completado la tarea: ${tasks[0].taskName}`,
      choices: [
        {
          name: `Sí, la he completado. Quiero otra`,
          value: "completedNext",
        },
        {
          name: "Sí, la he completado. Quiero salir`,",
          value: "completedExit",
        },
        {
          name: "No, la quiero postponer`,",
          value: "postpone",
        },
        {
          name: "Salir`,",
          value: "exit",
        },
      ],
    },

    {
      type: "list",
      name: "postponeAmount",
      message: "¿Cuánto tiempo deseas posponerla?",
      choices: postponeOptionsChoices,
      when: (answers) => answers.opc === "postpone",
    },
  ]);

  console.log (data)

  return data.opc;
};

export const todayTaskMenu = async (todayTask) => {
  const opcSalir = [{ name: "Salir", value: "exit" }];

  console.table(todayTask, ["taskName", "timeBlock", "dueDate"]);

  // '\b\b' `Tarea #${i + 1}:`, todayTask[i].name + '\n' + "Descripcion: " + todayTask[i].description

  const data = await inquirer.prompt([
    {
      type: "rawlist",
      name: "opc",
      message: "Selecciona salir para volver al menu principal",
      choices: opcSalir,
    },
  ]);

  return data.opc;
};
