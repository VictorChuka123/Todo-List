document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.querySelector('.js-Task-input');
  const taskDate = document.querySelector('.js-task-date');
  const taskList = document.getElementById('tasksList');
  const addTaskBtn = document.getElementById('addTaskBtn');

  let tasks = [];

  // Load tasks from localStorage
  function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
    renderTasks();
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Show a temporary message
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
    setTimeout(() => msg.remove(), 3000);
  }

  // Render the list of tasks
  function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'text-gray-500 text-center py-8';
      emptyMsg.textContent = 'No tasks yet. Add one to get started!';
      taskList.appendChild(emptyMsg);
      return;
    }

    tasks.forEach(task => {
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
      taskList.appendChild(item);
    });
  }

  // Add a new task
  function addTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value;

    if (!text) {
      showMessage('Please enter a task description', 'error');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: text,
      date: date,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    taskDate.value = '';
    showMessage('Task added successfully', 'success');
  }

  // Delete a task
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    showMessage('Task deleted', 'info');
  }

  // Toggle task completion
  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  // Event Listeners
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }

  // Initial load
  loadTasks();
});
