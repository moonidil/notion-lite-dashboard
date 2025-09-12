import { Router } from "express";
import { z } from "zod";

const upsertSchema = z.object({ title: z.string().optional(), content: z.string().optional() });

export default function notesRouter(prisma) {
  const r = Router();

  r.get("/", async (req, res) => {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: "desc" }
    });
    res.json(notes);
  });

  r.post("/", async (req, res) => {
    const { title = "", content = "" } = upsertSchema.parse(req.body || {});
    const note = await prisma.note.create({ data: { userId: req.user.id, title, content } });
    res.status(201).json(note);
  });

  r.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, content } = upsertSchema.parse(req.body || {});
    const note = await prisma.note.update({ where: { id }, data: { title, content } });
    res.json(note);
  });

  r.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.note.delete({ where: { id } });
    res.status(204).end();
  });

  return r;
}
