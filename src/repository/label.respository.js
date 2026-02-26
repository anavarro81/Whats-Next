import { getDB } from "../bd.js";

export const newLabel = async (label) => {
  if (!label) {
    console.error("nombre de la etiqueta no informado");
    return;
  }

  try {
    const db = await getDB();
    const existLabel = await db.collection("labels").find({ label }).toArray();

    

    if (existLabel.length == 0) {
      
      const labelInserted = await db.collection("labels").insertOne({ label });
      
      return labelInserted;
    }
  } catch (error) {
    console.error("error al crear la etiqueta ", error);
  }
};

