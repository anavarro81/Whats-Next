
Alta de tareas
=============

Obligatorio solo el nombre de la tarea. Entre comillas dobles. 

- Nombre de la tarea (obligatorio). Entre comillas dobls. 


Gestiones

Son todas aquellas tareas que se pueden hacer en casa, con el ordenador. 
Tareas cortas, hasta maximo 1 hora. 
Al dar de alta una tarea se puede indicar el flag -G para indicar que es una gestión. 

La opcion Ejecutar tareas, filtra por las tareas que tengan esta categoria. 
Despues se pueden mostrar (de una en una) en orden aleatorio, ardedente o descendente.

Importante: S/N

Si es importante. Hay que hacerla sí o si. Por ejemplo, pagar a x profesor. 
Si no es importante, no pasa nada si no se hace. Ejemplo: ordenar el cajón del escritorio. 

¿Cuando es importante una tarea?
- Cuando afecta a un tercero. Ejemplo: "pagar a fulanito"
- Cuando supone una multa o sancion el no hacerlo.  Ejemplo: "Paga el impuesto de X"
- 

Las gestiones no importantes se borraran semanalmente de forma automatica. 

-GIS -GIN


Alta de tarea

- El único campo obligatorio es el nombre de la tarea, igual que en Todoist
- Todo lo demas son flags y dependiendo de lo que se informe se guardardará y gestionar de forma diferente. 

- `-W` => Estas esperando por que un tercero haga algo. Por ejemplo: Alguien que te debe dinero que no te lo ha pagado. 

En este caso se mostrará un menu adicional:

- Recordar cada: 

- 24 horas (temas urgentes)
- 48 horas (tema normal)
- 72 horas (tema no urgete)

- `-R` => Tareas que se repiten cada X tiempo. Por ejemplo: "Los lunes saco dinero, los viernes hago la compra". 
- Se guardará con dueTime y dos flags:
  - recurringTask = `true` o `false`
  - recurringPeriod = x dias, meses, semanas, años
  - recurringPeriod = 




Date.UTC()
Devuelve en milisengundos el tiempo trascurido desde 1 de enero de 1970 hasta la fecha que le indiques. 

Luego hay que convetir esos milisegundo  una fecha con new Date(ms)

