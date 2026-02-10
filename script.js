// ==========================================
// 1. DATA MANAGEMENT & INITIALIZATION
// ==========================================
let tasks = JSON.parse(localStorage.getItem('taskFlowData')) || [];
let historyData = JSON.parse(localStorage.getItem('taskFlowHistory')) || [];
let editIndex = -1; 
let selectedTaskIndex = null;

// Simpan data ke memori browser
function saveToLocalStorage() {
    localStorage.setItem('taskFlowData', JSON.stringify(tasks));
    localStorage.setItem('taskFlowHistory', JSON.stringify(historyData));
}

// ==========================================
// 2. NAVIGATION & UI LOGIC
// ==========================================

// Berpindah antar panel (Dashboard, List, Form, History)
function showPanel(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active-nav'));
    const navId = 'nav-' + (panelId === 'taskform' ? 'taskform' : panelId);
    const activeLi = document.getElementById(navId);
    if (activeLi) activeLi.classList.add('active-nav');
    
    // Tutup sidebar otomatis pada mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('overlay').classList.remove('active');
    }
}

// Buka/Tutup Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    }
}

// ==========================================
// 3. CORE CRUD LOGIC (Create, Read, Update, Delete)
// ==========================================

// Reset form untuk input tugas baru
function prepareAddTask() {
    editIndex = -1;
    document.getElementById('formTitle').innerText = "Add New Task";
    document.getElementById('txtTitle').value = "";
    document.getElementById('txtDescription').value = "";
    document.getElementById('txtDeadline').value = "";
    document.getElementById('cbPriority').value = "Normal";
    showPanel('taskform');
}

// Simpan tugas (Baru atau Hasil Edit)
function saveTask() {
    const title = document.getElementById('txtTitle').value.trim();
    const desc = document.getElementById('txtDescription').value.trim();
    const deadline = document.getElementById('txtDeadline').value;
    const priority = document.getElementById('cbPriority').value;

    if (!title || !deadline) {
        alert("Please fill in all required fields!");
        return;
    }

    if (editIndex === -1) {
        // Tambah Baru
        const newTask = { id: Date.now(), title, desc, deadline, priority, status: 'Pending' };
        tasks.push(newTask);
        addToHistory("Creating new task: " + title);
    } else {
        // Update yang ada
        tasks[editIndex] = { ...tasks[editIndex], title, desc, deadline, priority };
        addToHistory("Updating assignments: " + title);
        editIndex = -1;
    }

    saveToLocalStorage();
    renderAll();
    showPanel('tasklist');
}

// Tampilkan data ke tabel
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = "";
    const keyword = document.getElementById('searchField').value.toLowerCase();
    selectedTaskIndex = null;

    tasks.forEach((task, index) => {
        if(task.title.toLowerCase().includes(keyword)) {
            const tr = document.createElement('tr');
            tr.onclick = () => {
                document.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
                tr.classList.add('selected-row');
                selectedTaskIndex = index;
            };

            let pColor = task.priority === 'Urgent' ? 'red' : (task.priority === 'Normal' ? '#2f4157' : 'green');

            tr.innerHTML = `
                <td><strong>${task.title}</strong></td>
                <td>${task.desc}</td>
                <td>${task.deadline}</td>
                <td><span style="color:${pColor};">${task.priority}</span></td>
                <td>${task.status}</td>`;
            tbody.appendChild(tr);
        }
    });
}

// Edit tugas yang dipilih
function editTask() {
    if (selectedTaskIndex === null) return alert("Select a task row first.");
    const task = tasks[selectedTaskIndex];
    document.getElementById('txtTitle').value = task.title;
    document.getElementById('txtDescription').value = task.desc;
    document.getElementById('txtDeadline').value = task.deadline;
    document.getElementById('cbPriority').value = task.priority;
    editIndex = selectedTaskIndex;
    document.getElementById('formTitle').innerText = "Edit Tugas";
    showPanel('taskform');
}

// Hapus tugas
function deleteTask() {
    if (selectedTaskIndex === null) return alert("Select a task row first.");
    if(confirm("Are you sure?")) {
        const removed = tasks.splice(selectedTaskIndex, 1);
        addToHistory("Deleting task: " + removed[0].title);
        saveToLocalStorage();
        renderAll();
    }
}

// Tandai Selesai
function completeTask() {
    if (selectedTaskIndex === null) return alert("Select a task row first.");
    tasks[selectedTaskIndex].status = "Completed";
    addToHistory("Marking task as completed: " + tasks[selectedTaskIndex].title);
    saveToLocalStorage();
    renderAll();
}

// ==========================================
// 4. UTILS & SUPPORTING FUNCTIONS
// ==========================================

function renderAll() {
    renderTable();
    updateStats();
}

function updateStats() {
    document.getElementById('totalTasks').innerText = tasks.length;
    document.getElementById('completedTasks').innerText = tasks.filter(t => t.status === 'Completed').length;
}

function addToHistory(actionText) {
    const time = new Date().toLocaleTimeString();
    historyData.unshift({ time, action: actionText });
    if(historyData.length > 20) historyData.pop();
    saveToLocalStorage();
    renderHistory();
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    if(!tbody) return;
    tbody.innerHTML = historyData.map(h => `<tr><td>${h.time}</td><td>${h.action}</td></tr>`).join('');
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString('en-US', options);
}

// --- SORTING ---
function toggleSortMenu() { document.getElementById("sortDropdown").classList.toggle("show"); }

function sortByPriority() {
    const map = { 'Urgent': 1, 'Normal': 2, 'Non Urgent': 3 };
    tasks.sort((a, b) => map[a.priority] - map[b.priority]);
    renderTable();
}

function sortByDeadline() {
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    renderTable();
}

function searchTasks() { renderTable(); }

function clearForm() { showPanel('tasklist'); }

// Jalankan saat startup
updateDate();
renderAll();
renderHistory();