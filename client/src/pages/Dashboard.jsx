import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getNotes, createNote, updateNote, deleteNote,
         getTasks, createTask, patchTask, deleteTask } from "../api";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState({ title:"", content:"" });
  const [newTask, setNewTask] = useState({ title:"", dueDate:"" });

  const load = async () => {
    try {
      const [n,t] = await Promise.all([getNotes(), getTasks()]);
      setNotes(n.data); setTasks(t.data);
    } catch { /* likely 401 before login */ }
  };

  useEffect(()=>{ load(); },[]);

  const addNote = async () => {
    if(!newNote.title && !newNote.content) return;
    await createNote(newNote); setNewNote({title:"",content:""}); load();
  };
  const saveNote = async (n) => { await updateNote(n.id, { title:n.title, content:n.content }); load(); };
  const removeNote = async (id) => { await deleteNote(id); load(); };

  const addTask = async () => {
    if(!newTask.title) return;
    const payload = { title:newTask.title };
    if(newTask.dueDate) payload.dueDate = newTask.dueDate;
    await createTask(payload); setNewTask({ title:"", dueDate:"" }); load();
  };
  const toggleTask = async (t) => { await patchTask(t.id, { completed: !t.completed }); load(); };
  const removeTask = async (id) => { await deleteTask(id); load(); };

  return (
    <div style={{ display:"grid", gap:24 }}>
      <section>
        <h2>Notes</h2>
        <div style={{ display:"grid", gap:8, marginBottom:8 }}>
          <input placeholder="Title" value={newNote.title} onChange={e=>setNewNote(v=>({...v,title:e.target.value}))}/>
          <textarea placeholder="Markdown content" rows={4}
            value={newNote.content} onChange={e=>setNewNote(v=>({...v,content:e.target.value}))}/>
          <button onClick={addNote}>Add Note</button>
        </div>
        <div style={{ display:"grid", gap:12 }}>
          {notes.map(n=>(
            <div key={n.id} style={{ border:"1px solid #ccc", padding:8 }}>
              <input value={n.title} onChange={e=>setNotes(notes.map(x=>x.id===n.id?{...x,title:e.target.value}:x))}/>
              <button onClick={()=>saveNote(notes.find(x=>x.id===n.id))}>Save</button>
              <button onClick={()=>removeNote(n.id)}>Delete</button>
              <ReactMarkdown>{n.content}</ReactMarkdown>
              <textarea rows={3}
                value={n.content}
                onChange={e=>setNotes(notes.map(x=>x.id===n.id?{...x,content:e.target.value}:x))}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Tasks</h2>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
          <input placeholder="Task title" value={newTask.title} onChange={e=>setNewTask(v=>({...v,title:e.target.value}))}/>
          <input type="datetime-local" value={newTask.dueDate} onChange={e=>setNewTask(v=>({...v,dueDate:e.target.value}))}/>
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul style={{ display:"grid", gap:8, listStyle:"none", padding:0 }}>
          {tasks.map(t=>(
            <li key={t.id} style={{ border:"1px solid #ccc", padding:8, display:"flex", gap:8, alignItems:"center" }}>
              <input type="checkbox" checked={t.completed} onChange={()=>toggleTask(t)} />
              <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>{t.title}</span>
              <small>{t.dueDate ? new Date(t.dueDate).toLocaleString() : ""}</small>
              <button onClick={()=>removeTask(t.id)} style={{ marginLeft:"auto" }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
