import { Router } from "express";
import { z } from "zod";

const createSchema = z.object({ title: z.string().min(1), dueDate: z.string().datetime().optional() });
const updateSchema = z.object({ title: z.string().optional(), dueDate: z.string().datetime().optional(), completed: z.boolean().optional() });

export default function tasksRouter(prisma) {
  const r = Router();

  r.get("/", async (req, res) => {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }]
    });
    res.json(tasks);
  });

  r.post("/", async (req, res) => {
    const { title, dueDate } = createSchema.parse(req.body);
    const task = await prisma.task.create({
      data: { userId: req.user.id, title, dueDate: dueDate ? new Date(dueDate) : null }
    });
    res.status(201).json(task);
  });

  r.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = updateSchema.parse(req.body);
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const updated = await prisma.task.update({ where: { id }, data });
    res.json(updated);
  });

  r.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  });

  return r;
}
