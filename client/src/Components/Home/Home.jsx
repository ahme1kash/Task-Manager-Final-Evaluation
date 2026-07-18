import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Home.css";
import API_BASE_URL from "../../config/api.js";

const columns = [
  { title: "Backlog", status: "Backlog", moveLabel: "BACKLOG" },
  { title: "To do", status: "To do", moveLabel: "TO-DO" },
  { title: "In progress", status: "In Progress", moveLabel: "PROGRESS" },
  { title: "Done", status: "Done", moveLabel: "DONE" },
];

const priorityMeta = {
  "HIGH PRIORITY": { className: "high", label: "HIGH PRIORITY" },
  "MODERATE PRIORITY": { className: "moderate", label: "MODERATE PRIORITY" },
  "LOW PRIORITY": { className: "low", label: "LOW PRIORITY" },
};

const emptyForm = {
  task_title: "",
  task_priority: "HIGH PRIORITY",
  assigned_to_email: "",
  due_date: "",
  task_steps: [],
};

const getToken = () => localStorage.getItem("Token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  authorization: `Bearer ${getToken()}`,
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatHeaderDate = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const normalizeDateInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDateInputLabel = (date) => {
  if (!date) return "Select Due Date";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildCalendarDays = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

const getInitials = (email) => {
  if (!email) return "";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
};

const Chevron = ({ open = false }) => (
  <span className={`chevron-icon ${open ? "open" : ""}`} aria-hidden="true"></span>
);

const DroppableColumn = ({ column, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
    data: { type: "column", status: column.status },
  });

  return (
    <article className={`task-column ${isOver ? "drag-over" : ""}`} ref={setNodeRef}>
      {children}
    </article>
  );
};

const SortableTaskCard = ({ task, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""}`}
      ref={setNodeRef}
      style={style}
    >
      <button className="drag-handle" type="button" {...attributes} {...listeners}>
        ⋮⋮
      </button>
      {children}
    </div>
  );
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [boardUsers, setBoardUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("week");
  const [uiState, setUiState] = useState({
    filterOpen: false,
    expandedTasks: {},
    openMenuId: null,
  });
  const [modalState, setModalState] = useState({
    taskModalOpen: false,
    editingTask: null,
    deleteTask: null,
    addPeopleOpen: false,
    addedEmail: "",
    assigneeOpen: false,
  });
  const [taskForm, setTaskForm] = useState(emptyForm);
  const [newBoardEmail, setNewBoardEmail] = useState("");
  const [calendarState, setCalendarState] = useState({
    open: false,
    viewDate: new Date(),
  });
  const [activeTaskId, setActiveTaskId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const userName = localStorage.getItem("UserName") || "Kumar";

  const groupedTasks = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.status] = tasks
        .filter((task) => task.task_status === column.status)
        .sort((a, b) => (a.task_order || 0) - (b.task_order || 0));
      return acc;
    }, {});
  }, [tasks]);

  const activeTask = useMemo(
    () => tasks.find((task) => task._id === activeTaskId),
    [activeTaskId, tasks]
  );

  const loadTasks = async (selectedFilter = filter) => {
    setLoading(true);
    try {
      const endpoint = selectedFilter
        ? `${API_BASE_URL}/api/search?filter=${selectedFilter}`
        : `${API_BASE_URL}/api/tasks/readTask`;
      const response = await axios.get(endpoint, { headers: getHeaders() });
      setTasks(response.data.filtered_tasks || response.data.tasks || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load tasks", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const loadBoardUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/onboard/getAll`, {
        headers: getHeaders(),
      });
      setBoardUsers(response.data.getAllUsers || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadBoardUsers();
  }, []);

  const openCreateTask = () => {
    setTaskForm(emptyForm);
    setCalendarState({ open: false, viewDate: new Date() });
    setModalState((current) => ({ ...current, editingTask: null, taskModalOpen: true }));
  };

  const openEditTask = (task) => {
    setTaskForm({
      task_title: task.task_title || "",
      task_priority: task.task_priority || "HIGH PRIORITY",
      assigned_to_email: task.assigned_to_email || "",
      due_date: normalizeDateInput(task.due_date),
      task_steps: task.task_steps?.length ? task.task_steps : [],
    });
    setUiState((current) => ({ ...current, openMenuId: null }));
    setCalendarState({
      open: false,
      viewDate: task.due_date ? new Date(task.due_date) : new Date(),
    });
    setModalState((current) => ({ ...current, editingTask: task, taskModalOpen: true }));
  };

  const closeTaskModal = () => {
    setTaskForm(emptyForm);
    setCalendarState({ open: false, viewDate: new Date() });
    setModalState((current) => ({
      ...current,
      taskModalOpen: false,
      editingTask: null,
      assigneeOpen: false,
    }));
  };

  const saveTask = async (e) => {
    e.preventDefault();

    if (!taskForm.task_title.trim()) {
      toast.error("Task title is required", { position: "top-center" });
      return;
    }

    if (!taskForm.task_steps.length) {
      toast.error("Add at least one checklist item", { position: "top-center" });
      return;
    }

    if (taskForm.task_steps.some((step) => !step.description.trim())) {
      toast.error("Checklist items cannot be empty", { position: "top-center" });
      return;
    }

    const payload = {
      ...taskForm,
      task_title: taskForm.task_title.trim(),
      task_steps: taskForm.task_steps.map((step) => ({
        description: step.description.trim(),
        done: Boolean(step.done),
      })),
    };

    if (!payload.assigned_to_email) {
      delete payload.assigned_to_email;
    }
    if (!payload.due_date) {
      delete payload.due_date;
    }

    try {
      if (modalState.editingTask) {
        await axios.put(`${API_BASE_URL}/api/tasks/updateTask/${modalState.editingTask._id}`, payload, {
          headers: getHeaders(),
        });
        toast.success("Task updated", { position: "top-center" });
      } else {
        await axios.post(`${API_BASE_URL}/api/tasks/createTask`, payload, {
          headers: getHeaders(),
        });
        toast.success("Task created", { position: "top-center" });
      }
      closeTaskModal();
      loadTasks();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to save task", {
        position: "top-center",
      });
    }
  };

  const updateTaskStatus = async (task, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/tasks/updateTaskStatus/${task._id}`,
        { task_status: status },
        { headers: getHeaders() }
      );
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id ? { ...item, task_status: status } : item
        )
      );
      toast.success("Status updated", { position: "top-center" });
    } catch (err) {
      console.log(err);
      toast.error("Failed to update task status", { position: "top-center" });
    }
  };

  const persistTaskSteps = async (task, task_steps) => {
    const payload = {
      task_title: task.task_title,
      task_priority: task.task_priority,
      task_steps,
      assigned_to_email: task.assigned_to_email,
      due_date: task.due_date,
    };

    try {
      await axios.put(`${API_BASE_URL}/api/tasks/updateTask/${task._id}`, payload, {
        headers: getHeaders(),
      });
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item._id === task._id ? { ...item, task_steps } : item))
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to update checklist", { position: "top-center" });
    }
  };

  const toggleTaskStep = (task, index) => {
    const task_steps = task.task_steps.map((step, stepIndex) =>
      stepIndex === index ? { ...step, done: !step.done } : step
    );
    persistTaskSteps(task, task_steps);
  };

  const confirmDeleteTask = async () => {
    if (!modalState.deleteTask) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/deleteTask/${modalState.deleteTask._id}`, {
        headers: getHeaders(),
      });
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== modalState.deleteTask._id));
      setModalState((current) => ({ ...current, deleteTask: null }));
      toast.success("Task deleted", { position: "top-center" });
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete task", { position: "top-center" });
    }
  };

  const shareTask = async (task) => {
    const url = `${window.location.origin}/?task=${task._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied", { position: "top-center" });
    } catch (err) {
      console.log(err);
      toast.error("Failed to copy link", { position: "top-center" });
    }
    setUiState((current) => ({ ...current, openMenuId: null }));
  };

  const addChecklistItem = () => {
    setTaskForm((currentForm) => ({
      ...currentForm,
      task_steps: [...currentForm.task_steps, { description: "", done: false }],
    }));
  };

  const updateChecklistItem = (index, key, value) => {
    setTaskForm((currentForm) => ({
      ...currentForm,
      task_steps: currentForm.task_steps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, [key]: value } : step
      ),
    }));
  };

  const removeChecklistItem = (index) => {
    setTaskForm((currentForm) => ({
      ...currentForm,
      task_steps: currentForm.task_steps.filter((_, stepIndex) => stepIndex !== index),
    }));
  };

  const addBoardUser = async (e) => {
    e.preventDefault();
    const email = newBoardEmail.trim();

    if (!email) {
      toast.error("Email is required", { position: "top-center" });
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/onboard/addUser`,
        { email },
        { headers: getHeaders() }
      );
      setNewBoardEmail("");
      setModalState((current) => ({
        ...current,
        addPeopleOpen: false,
        addedEmail: email,
      }));
      loadBoardUsers();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add user", {
        position: "top-center",
      });
    }
  };

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter);
    setUiState((current) => ({ ...current, filterOpen: false }));
    loadTasks(nextFilter);
  };

  const collapseColumnTasks = (status) => {
    const taskIds = groupedTasks[status]?.map((task) => task._id) || [];

    setUiState((current) => {
      const nextExpandedTasks = { ...current.expandedTasks };
      taskIds.forEach((taskId) => {
        delete nextExpandedTasks[taskId];
      });
      return { ...current, expandedTasks: nextExpandedTasks };
    });

    if (taskIds.includes(uiState.openMenuId)) {
      setUiState((current) => ({ ...current, openMenuId: null }));
    }
  };

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarState.viewDate),
    [calendarState.viewDate]
  );

  const changeCalendarMonth = (offset) => {
    setCalendarState((current) => {
      const nextDate = new Date(current.viewDate);
      nextDate.setMonth(nextDate.getMonth() + offset);
      return { ...current, viewDate: nextDate };
    });
  };

  const selectCalendarDate = (date) => {
    setTaskForm((current) => ({ ...current, due_date: toDateInputValue(date) }));
    setCalendarState((current) => ({ ...current, open: false, viewDate: date }));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTaskId(null);
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    if (!activeTask) return;

    const overColumn = columns.find((column) => column.status === over.id);
    const overTask = tasks.find((task) => task._id === over.id);
    const targetStatus = overColumn?.status || overTask?.task_status;

    if (!targetStatus) return;

    const sourceTasks = groupedTasks[activeTask.task_status] || [];
    const targetTasks = (groupedTasks[targetStatus] || []).filter(
      (task) => task._id !== activeTask._id
    );
    const overIndex = overTask
      ? targetTasks.findIndex((task) => task._id === overTask._id)
      : targetTasks.length;
    const targetIndex = overIndex >= 0 ? overIndex : targetTasks.length;

    let nextTasks;
    if (activeTask.task_status === targetStatus) {
      const oldIndex = sourceTasks.findIndex((task) => task._id === activeTask._id);
      const newIndex = sourceTasks.findIndex((task) => task._id === over.id);
      const reorderedColumn =
        newIndex >= 0
          ? arrayMove(sourceTasks, oldIndex, newIndex)
          : [
              ...sourceTasks.filter((task) => task._id !== activeTask._id),
              activeTask,
            ];
      const normalizedColumn = reorderedColumn.map((task, index) => ({
        ...task,
        task_order: index,
      }));

      nextTasks = tasks.map((task) =>
        task.task_status === targetStatus
          ? normalizedColumn.find((item) => item._id === task._id) || task
          : task
      );
    } else {
      const movedTask = { ...activeTask, task_status: targetStatus, task_order: targetIndex };
      const reorderedTarget = [...targetTasks];
      reorderedTarget.splice(targetIndex, 0, movedTask);
      const normalizedTarget = reorderedTarget.map((task, index) => ({
        ...task,
        task_status: targetStatus,
        task_order: index,
      }));

      nextTasks = tasks
        .filter((task) => task._id !== activeTask._id)
        .map((task) => normalizedTarget.find((item) => item._id === task._id) || task)
        .concat(normalizedTarget.filter((task) => task._id === activeTask._id));
    }

    const previousTasks = tasks;
    setTasks(nextTasks);

    try {
      await axios.put(
        `${API_BASE_URL}/api/tasks/moveTask/${activeTask._id}`,
        { task_status: targetStatus, task_order: targetIndex },
        { headers: getHeaders() }
      );
      toast.success("Task moved", { position: "top-center" });
      loadTasks();
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404 && activeTask.task_status !== targetStatus) {
        try {
          await axios.put(
            `${API_BASE_URL}/api/tasks/updateTaskStatus/${activeTask._id}`,
            { task_status: targetStatus },
            { headers: getHeaders() }
          );
          toast.success("Task moved", { position: "top-center" });
          loadTasks();
          return;
        } catch (fallbackErr) {
          console.log(fallbackErr);
        }
      }
      setTasks(previousTasks);
      toast.error(err.response?.data?.message || "Failed to move task", {
        position: "top-center",
      });
    }
  };

  const renderDragPreview = (task) => {
    if (!task) return null;
    const priority = priorityMeta[task.task_priority] || priorityMeta["LOW PRIORITY"];
    const completedCount = task.task_steps?.filter((step) => step.done).length || 0;
    const totalCount = task.task_steps?.length || 0;

    return (
      <div className="task-card drag-preview-card">
        <div className="task-card-top">
          <div className="priority-line">
            <span className={`priority-dot ${priority.className}`}></span>
            <span>{priority.label}</span>
            {task.assigned_to_email && (
              <span className="assignee-chip">{getInitials(task.assigned_to_email)}</span>
            )}
          </div>
        </div>
        <h4>{task.task_title}</h4>
        <div className="checklist-header">
          <span>
            Checklist ({completedCount}/{totalCount})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <h2>Welcome! {userName}</h2>
          <div className="board-title-row">
            <h1>Board</h1>
            <button
              className="add-people-btn"
              onClick={() => setModalState((current) => ({ ...current, addPeopleOpen: true }))}
            >
              <span>👥</span> Add People
            </button>
          </div>
        </div>
        <div className="home-date-filter">
          <p>{formatHeaderDate()}</p>
          <button
            className="filter-btn"
            onClick={() =>
              setUiState((current) => ({ ...current, filterOpen: !current.filterOpen }))
            }
          >
            <span>{filter === "today" ? "Today" : filter === "month" ? "This Month" : "This week"}</span>
            <Chevron open={uiState.filterOpen} />
          </button>
          {uiState.filterOpen && (
            <div className="filter-menu">
              <button onClick={() => changeFilter("today")}>Today</button>
              <button onClick={() => changeFilter("week")}>This Week</button>
              <button onClick={() => changeFilter("month")}>This Month</button>
              <button onClick={() => changeFilter("")}>All Tasks</button>
            </div>
          )}
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveTaskId(active.id)}
        onDragCancel={() => setActiveTaskId(null)}
        onDragEnd={handleDragEnd}
      >
        <section className="board-scroll">
          {columns.map((column) => (
          <DroppableColumn column={column} key={column.status}>
            <div className="column-header">
              <h3>{column.title}</h3>
              <div className="column-actions">
                {column.status === "To do" && (
                  <button className="column-icon-btn" onClick={openCreateTask} title="Add task">
                    +
                  </button>
                )}
                <button
                  className="column-collapse-btn"
                  onClick={() => collapseColumnTasks(column.status)}
                  aria-label={`Collapse all open ${column.title} cards`}
                  title={`Collapse all open ${column.title} cards`}
                >
                  <span></span>
                </button>
              </div>
            </div>

            <div className="task-list">
              {loading ? (
                <p className="board-message">Loading tasks...</p>
              ) : groupedTasks[column.status]?.length ? (
                <SortableContext
                  items={groupedTasks[column.status].map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {groupedTasks[column.status].map((task) => {
                  const completedCount = task.task_steps?.filter((step) => step.done).length || 0;
                  const totalCount = task.task_steps?.length || 0;
                  const isExpanded = uiState.expandedTasks[task._id];
                  const priority = priorityMeta[task.task_priority] || priorityMeta["LOW PRIORITY"];
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.task_status !== "Done";

                  return (
                    <SortableTaskCard task={task} key={task._id}>
                      <div className="task-card-top">
                        <div className="priority-line">
                          <span className={`priority-dot ${priority.className}`}></span>
                          <span>{priority.label}</span>
                          {task.assigned_to_email && (
                            <span className="assignee-chip">{getInitials(task.assigned_to_email)}</span>
                          )}
                        </div>
                        <div className="card-top-actions">
                          <button
                            type="button"
                            className="share-link-btn"
                            onClick={() => shareTask(task)}
                            aria-label="Copy read-only share link"
                            title="Copy read-only share link"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.6.5 1.3.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.8C7.4 9.3 6.7 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.7 0 1.4-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-2.9-3-2.9Z" />
                            </svg>
                          </button>
                          <button
                            className="card-menu-btn"
                            onClick={() =>
                              setUiState((current) => ({
                                ...current,
                                openMenuId: current.openMenuId === task._id ? null : task._id,
                              }))
                            }
                          >
                            ...
                          </button>
                        </div>
                        {uiState.openMenuId === task._id && (
                          <div className="card-menu">
                            <button onClick={() => openEditTask(task)}>Edit</button>
                            <button onClick={() => shareTask(task)}>Share</button>
                            <button
                              className="danger"
                              onClick={() =>
                                setModalState((current) => ({ ...current, deleteTask: task }))
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <h4>{task.task_title}</h4>

                      <div className="checklist-header">
                        <span>
                          Checklist ({completedCount}/{totalCount})
                        </span>
                        <button
                          className="collapse-btn"
                          onClick={() =>
                            setUiState((current) => ({
                              ...current,
                              expandedTasks: {
                                ...current.expandedTasks,
                                [task._id]: !current.expandedTasks[task._id],
                              },
                            }))
                          }
                        >
                          <Chevron open={isExpanded} />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="checklist-items">
                          {task.task_steps?.map((step, index) => (
                            <label
                              className={`checklist-item ${step.done ? "completed" : ""}`}
                              key={`${task._id}-${index}`}
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(step.done)}
                                onChange={() => toggleTaskStep(task, index)}
                              />
                              <span>{step.description}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      <div className="task-card-footer">
                        {task.due_date && (
                          <span className={`due-chip ${isOverdue ? "overdue" : ""}`}>
                            {formatDate(task.due_date)}
                          </span>
                        )}
                        <div className="status-buttons">
                          {columns
                            .filter((statusColumn) => statusColumn.status !== task.task_status)
                            .map((statusColumn) => (
                              <button
                                key={statusColumn.status}
                                onClick={() => updateTaskStatus(task, statusColumn.status)}
                              >
                                {statusColumn.moveLabel}
                              </button>
                            ))}
                        </div>
                      </div>
                    </SortableTaskCard>
                  );
                })}
                </SortableContext>
              ) : (
                <p className="board-message">No tasks</p>
              )}
            </div>
          </DroppableColumn>
          ))}
        </section>
        <DragOverlay>{renderDragPreview(activeTask)}</DragOverlay>
      </DndContext>

      {modalState.taskModalOpen && (
        <div className="modal-backdrop">
          <form className="task-modal" onSubmit={saveTask}>
            <label className="field-label">
              Title <span>*</span>
              <input
                value={taskForm.task_title}
                onChange={(e) => setTaskForm({ ...taskForm, task_title: e.target.value })}
                placeholder="Enter Task Title"
              />
            </label>

            <div className="priority-picker">
              <span>
                Select Priority <strong>*</strong>
              </span>
              {Object.keys(priorityMeta).map((priority) => (
                <button
                  type="button"
                  className={taskForm.task_priority === priority ? "selected" : ""}
                  key={priority}
                  onClick={() => setTaskForm({ ...taskForm, task_priority: priority })}
                >
                  <span className={`priority-dot ${priorityMeta[priority].className}`}></span>
                  {priority}
                </button>
              ))}
            </div>

            <div className="assignee-field">
              <span>Assign to</span>
              <button
                type="button"
                onClick={() =>
                  setModalState((current) => ({
                    ...current,
                    assigneeOpen: !current.assigneeOpen,
                  }))
                }
              >
                <span>{taskForm.assigned_to_email || "Add a assignee"}</span>
                <Chevron open={modalState.assigneeOpen} />
              </button>
              {modalState.assigneeOpen && (
                <div className="assignee-menu">
                  {boardUsers.length ? (
                    boardUsers.map((user) => (
                      <div className="assignee-row" key={user._id || user.email}>
                        <span className="assignee-avatar">{getInitials(user.email)}</span>
                        <span>{user.email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setTaskForm({ ...taskForm, assigned_to_email: user.email });
                            setModalState((current) => ({ ...current, assigneeOpen: false }));
                          }}
                        >
                          Assign
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No people added</p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-checklist-title">
              Checklist ({taskForm.task_steps.filter((step) => step.done).length}/
              {taskForm.task_steps.length}) <span>*</span>
            </div>
            <div className="modal-checklist-list">
              {taskForm.task_steps.map((step, index) => (
                <div className={`modal-checklist-item ${step.done ? "completed" : ""}`} key={index}>
                  <input
                    type="checkbox"
                    checked={Boolean(step.done)}
                    onChange={(e) => updateChecklistItem(index, "done", e.target.checked)}
                  />
                  <input
                    value={step.description}
                    placeholder="Add a task"
                    onChange={(e) => updateChecklistItem(index, "description", e.target.value)}
                  />
                  <button type="button" onClick={() => removeChecklistItem(index)}>
                    🗑
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="add-new-task-btn" onClick={addChecklistItem}>
              + Add New
            </button>

            <div className="task-modal-footer">
              <div className="date-picker-wrap">
                <button
                  type="button"
                  className="date-picker-trigger"
                  onClick={() =>
                    setCalendarState((current) => ({ ...current, open: !current.open }))
                  }
                >
                  {formatDateInputLabel(taskForm.due_date)}
                </button>
                {calendarState.open && (
                  <div className="calendar-popover">
                    <div className="calendar-header">
                      <button type="button" onClick={() => changeCalendarMonth(-1)}>
                        ↑
                      </button>
                      <strong>
                        {calendarState.viewDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>
                      <button type="button" onClick={() => changeCalendarMonth(1)}>
                        ↓
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                    <div className="calendar-grid">
                      {calendarDays.map((date) => {
                        const dateValue = toDateInputValue(date);
                        const isSelected = taskForm.due_date === dateValue;
                        const isMuted = date.getMonth() !== calendarState.viewDate.getMonth();
                        return (
                          <button
                            type="button"
                            key={dateValue}
                            className={`${isSelected ? "selected" : ""} ${isMuted ? "muted" : ""}`}
                            onClick={() => selectCalendarDate(date)}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    <div className="calendar-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setTaskForm((current) => ({ ...current, due_date: "" }));
                          setCalendarState((current) => ({ ...current, open: false }));
                        }}
                      >
                        Clear
                      </button>
                      <button type="button" onClick={() => selectCalendarDate(new Date())}>
                        Today
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="task-modal-actions">
                <button type="button" className="cancel-btn" onClick={closeTaskModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {modalState.deleteTask && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <h3>Are you sure you want to Delete?</h3>
            <button className="save-btn" onClick={confirmDeleteTask}>
              Yes, Delete
            </button>
            <button
              className="cancel-btn"
              onClick={() => setModalState((current) => ({ ...current, deleteTask: null }))}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {modalState.addPeopleOpen && (
        <div className="modal-backdrop">
          <form className="people-modal" onSubmit={addBoardUser}>
            <h3>Add people to the board</h3>
            <input
              type="email"
              value={newBoardEmail}
              placeholder="Enter the email"
              onChange={(e) => setNewBoardEmail(e.target.value)}
            />
            <div className="people-modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setModalState((current) => ({ ...current, addPeopleOpen: false }))}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Add Email
              </button>
            </div>
          </form>
        </div>
      )}

      {modalState.addedEmail && (
        <div className="modal-backdrop">
          <div className="people-success-modal">
            <h3>{modalState.addedEmail} added to board</h3>
            <button
              className="save-btn"
              onClick={() => setModalState((current) => ({ ...current, addedEmail: "" }))}
            >
              Okay, got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
