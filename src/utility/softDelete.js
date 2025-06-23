import prisma from "../db/db.js";

export const softDelete = async (model, idField, idValue) => {
  return await prisma[model].update({
    where: { [idField]: idValue },
    data: { del: true }
  });
};

// usage
// await softDelete('product', 'product_id', 1);
