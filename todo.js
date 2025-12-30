document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SELECT DOM ELEMENTS
  // ==========================================
  // We select all the HTML elements we need to interact with.
  const taskInput = document.querySelector('.js-Task-input');
  const taskDate = document.querySelector('.js-task-date');
  const taskList = document.getElementById('tasksList');
  const addTaskBtn = document.getElementById('addTaskBtn');

  // ==========================================
  // 2. STATE VARIABLES
  // ==========================================
  // This array will hold all our task objects.
  let tasks = [];

  // ==========================================
  // 3. EVENT LISTENERS
  // ==========================================
  // We listen for user actions like clicking the "Add Task" button or pressing "Enter".
  
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }

  // ==========================================
  // 4. FUNCTIONS
  // ==========================================

  // --- Core Functions ---

  // Add a new task to the list
  function addTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value;

    if (!text) {
      showMessage('Please enter a task description', 'error');
      return;
    }

    const newTask = {
      id: Date.now(), // Unique ID based on current time
      text: text,
      date: date,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Clear inputs
    taskInput.value = '';
    taskDate.value = '';
    showMessage('Task added successfully', 'success');
  }

  // Render the list of tasks to the screen
  function renderTasks() {
    taskList.innerHTML = ''; // Clear current list

    if (tasks.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'text-gray-500 text-center py-8';
      emptyMsg.textContent = 'No tasks yet. Add one to get started!';
      taskList.appendChild(emptyMsg);
      return;
    }

    tasks.forEach(task => {
      const item = createTaskElement(task);
      taskList.appendChild(item);
    });
  }

  // Helper to create the HTML for a single task
  function createTaskElement(task) {
    const item = document.createElement('div');
    item.className = `task-item flex items-center justify-between gap-4 py-2 ${task.completed ? 'opacity-50' : ''}`;
    
    const left = document.createElement('div');
    left.className = 'task-left flex items-center gap-3 cursor-pointer';
    left.onclick = () => toggleTask(task.id);

    // Checkbox visual
    const checkbox = document.createElement('div');
    checkbox.className = `w-5 h-5 border-2 rounded flex items-center justify-center ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`;
    if (task.completed) {
        checkbox.innerHTML = '<span class="text-white text-xs">✓</span>';
    }

    const info = document.createElement('div');
    const title = document.createElement('div');
    title.textContent = task.text;
    if (task.completed) title.className = 'line-through text-gray-500';
    
    const due = document.createElement('div');
    due.className = 'text-sm text-gray-500';
    due.textContent = task.date;

    info.appendChild(title);
    if (task.date) info.appendChild(due);

    left.appendChild(checkbox);
    left.appendChild(info);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete-task text-red-500 hover:text-red-700 font-medium';
    del.textContent = 'Delete';
    del.onclick = (e) => {
      e.stopPropagation(); // Prevent toggling when deleting
      deleteTask(task.id);
    };

    item.appendChild(left);
    item.appendChild(del);
    return item;
  }

  // --- Data Persistence ---

  // Load tasks from browser's localStorage
  function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
    renderTasks();
  }

  // Save current tasks to browser's localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // --- Task Actions ---

  // Delete a specific task by ID
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    showMessage('Task deleted', 'info');
  }

  // Toggle the completed status of a task
  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  // --- UI Helpers ---

  // Show a temporary status message
  function showMessage(message, type = 'info') {
    const existing = document.querySelector('.task-message');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'task-message px-2 py-1';
    msg.textContent = message;
    
    if (type === 'error') msg.classList.add('text-red-500');
    else msg.classList.add('text-green-600');
    
    // Insert before the task list
    if (taskList && taskList.parentNode) {
        taskList.parentNode.insertBefore(msg, taskList);
    }
    
    // Remove after 3 seconds
    setTimeout(() => msg.remove(), 3000);
  }

  // ==========================================
  // 5. INITIALIZATION
  // ==========================================
  // Start the app!
  loadTasks();
});
