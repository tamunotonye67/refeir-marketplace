import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, SquadTask } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireStaffRole, requireSuperAdmin } from '../middleware/auth.js';

export const tasksRouter = Router();

// 1. GET /api/tasks (Fetch all squad tasks)
tasksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const division = req.query.division as string;

    if (adminDb) {
      let queryRef: any = adminDb.collection('squad_tasks').orderBy('created_at', 'desc');
      if (division && division !== 'ALL') {
        queryRef = adminDb.collection('squad_tasks').where('division', '==', division);
      }
      const snap = await queryRef.get();
      if (!snap.empty) {
        const tasks = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        return res.json({ success: true, count: tasks.length, data: tasks });
      }
    }

    let list = memoryStore.tasks;
    if (division && division !== 'ALL') {
      list = list.filter(t => t.division === division);
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/tasks (Create / Announce Squad Mission)
tasksRouter.post(
  '/',
  requireStaffRole(['MANAGER', 'SQUAD_LEAD']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, division, bounty, points, frequency, description, requirements, submission_format, deadline, is_pinned } = req.body;

      if (!title || !division || !description) {
        return res.status(400).json({ success: false, error: 'Title, division, and description are required.' });
      }

      const newTask: SquadTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        division,
        bounty: bounty || 'Milestone Credit',
        points: Number(points) || 25,
        frequency: frequency || 'SPRINT',
        description: description.trim(),
        requirements: Array.isArray(requirements) ? requirements : [requirements || 'Complete according to specification'],
        submission_format: submission_format || 'URL link to deliverable / GitHub / Figma / Drive',
        deadline: deadline || undefined,
        is_active: true,
        is_pinned: Boolean(is_pinned),
        created_at: new Date().toISOString()
      };

      memoryStore.tasks.unshift(newTask);

      if (adminDb) {
        await adminDb.collection('squad_tasks').doc(newTask.id).set(newTask, { merge: true });
      }

      res.status(201).json({
        success: true,
        message: 'Squad task announced successfully!',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. PATCH /api/tasks/:id/toggle (Toggle active status)
tasksRouter.patch(
  '/:id/toggle',
  requireStaffRole(['MANAGER', 'SQUAD_LEAD']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const task = memoryStore.tasks.find(t => t.id === id);

      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found.' });
      }

      task.is_active = !task.is_active;

      if (adminDb) {
        await adminDb.collection('squad_tasks').doc(id).set({ is_active: task.is_active }, { merge: true });
      }

      res.json({
        success: true,
        message: `Task is now ${task.is_active ? 'ACTIVE' : 'ARCHIVED'}.`,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }
);

// 4. DELETE /api/tasks/:id (Delete squad mission - Super Admin only)
tasksRouter.delete('/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    memoryStore.tasks = memoryStore.tasks.filter(t => t.id !== id);

    if (adminDb) {
      await adminDb.collection('squad_tasks').doc(id).delete();
    }

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
});
