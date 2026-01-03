function auraApp() {
    return {
        currentTab: 'dashboard',
        
        // Stats State
        totalFocusMinutes: 0,
        
        // Timer State
        timerMode: 'Focus',
        secondsLeft: 1500,
        timerMax: 1500,
        isRunning: false,
        tInt: null,
        
        // Habits State
        habits: [],
        newHabit: '',

        // Todos State
        todos: [],
        newTask: { title: '', priority: 'med', due: '' },

        // Notes State
        notes: [],
        activeNote: null,
        searchQuery: '',

        // Matrix State
        gridSchedule: {},
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        allHours: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'],

        initApp() {
            const saved = localStorage.getItem('aura_pro_v2');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.habits = parsed.habits || [];
                this.todos = parsed.todos || [];
                this.notes = parsed.notes || [];
                this.gridSchedule = parsed.gridSchedule || {};
                this.totalFocusMinutes = parsed.totalFocusMinutes || 0;
            } else {
                this.notes = [{ title: 'Welcome to AURA', body: 'Start typing your thoughts...' }];
            }
            
            if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
            
            if ("Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        },

        save() {
            localStorage.setItem('aura_pro_v2', JSON.stringify({
                habits: this.habits,
                todos: this.todos,
                notes: this.notes,
                gridSchedule: this.gridSchedule,
                totalFocusMinutes: this.totalFocusMinutes
            }));
        },

        // --- UI HELPERS ---
        get greeting() {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning';
            if (hour < 18) return 'Good Afternoon';
            return 'Good Evening';
        },

        // --- STATS LOGIC ---
        get completionRate() {
            if (this.todos.length === 0) return 0;
            const done = this.todos.filter(t => t.done).length;
            return Math.round((done / this.todos.length) * 100);
        },

        get habitSuccessRate() {
            if (this.habits.length === 0) return 0;
            let totalChecks = 0;
            let totalSlots = this.habits.length * 7;
            this.habits.forEach(h => {
                totalChecks += h.history.filter(x => x).length;
            });
            return Math.round((totalChecks / totalSlots) * 100);
        },

        get bestStreak() {
            if (this.habits.length === 0) return 0;
            return Math.max(...this.habits.map(h => h.streak));
        },

        get weeklyChartData() {
            const days = [0, 1, 2, 3, 4, 5, 6];
            return days.map(dayIdx => {
                let count = 0;
                this.habits.forEach(h => {
                    if (h.history[dayIdx]) count++;
                });
                const max = this.habits.length || 1; 
                return Math.round((count / max) * 100);
            });
        },

        exportData() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('aura_pro_v2'));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "aura_backup.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },

        // Timer Logic
        setTimerMode(mode, mins) {
            this.timerMode = mode;
            this.secondsLeft = mins * 60;
            this.timerMax = mins * 60;
            this.isRunning = false;
            clearInterval(this.tInt);
        },

        toggleTimer() {
            if (this.isRunning) {
                clearInterval(this.tInt);
                this.isRunning = false;
            } else {
                this.isRunning = true;
                this.tInt = setInterval(() => {
                    if (this.secondsLeft > 0) {
                        this.secondsLeft--;
                    } else { 
                        this.timerFinished();
                    }
                }, 1000);
            }
        },

        timerFinished() {
            if (this.timerMode === 'Focus') {
                this.totalFocusMinutes += (this.timerMax / 60);
                this.save();
            }
            this.resetTimer();
            new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3').play();
            if (Notification.permission === "granted") {
                new Notification("AURA Focus", { body: "Time is up! Take a break.", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968204.png" });
            }
        },

        resetTimer() {
            clearInterval(this.tInt);
            this.isRunning = false;
            this.secondsLeft = this.timerMax;
        },

        formatTime(s) {
            return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
        },
        
        get progressRing() {
            const circumference = 2 * Math.PI * 45; 
            return circumference - ((this.secondsLeft / this.timerMax) * circumference);
        },

        // Habit Logic
        addHabit() {
            if (this.newHabit.trim()) {
                this.habits.push({ title: this.newHabit, streak: 0, history: [false, false, false, false, false, false, false] });
                this.newHabit = '';
                this.save();
            }
        },

        toggleHabit(hIdx, dIdx) {
            this.habits[hIdx].history[dIdx] = !this.habits[hIdx].history[dIdx];
            this.habits[hIdx].streak = this.habits[hIdx].history.filter(x => x).length;
            this.save();
        },
        
        deleteHabit(index) {
            if(confirm('Delete this habit?')) {
                this.habits.splice(index, 1);
                this.save();
            }
        },

        // Planner Logic
        addTodo() {
            if (this.newTask.title.trim()) {
                this.todos.push({ ...this.newTask, done: false, id: Date.now() });
                this.newTask = { title: '', priority: 'med', due: '' };
                this.save();
            }
        },
        
        toggleTodo(id) {
            const t = this.todos.find(x => x.id === id);
            if (t) t.done = !t.done;
            this.save();
        },
        
        deleteTodo(id) {
            this.todos = this.todos.filter(x => x.id !== id);
            this.save();
        },

        // Note Logic
        addNote() {
            const newNote = { title: 'Untitled Note', body: '', id: Date.now() };
            this.notes.unshift(newNote);
            this.activeNote = newNote.id;
            this.save();
        },
        
        getActiveNote() {
            return this.notes.find(n => n.id === this.activeNote);
        },
        
        updateNote() {
            this.save();
        },
        
        deleteNote(id) {
            if(confirm('Delete note?')) {
                this.notes = this.notes.filter(n => n.id !== id);
                if (this.activeNote === id) this.activeNote = null;
                this.save();
            }
        },

        // Matrix Logic
        addGridTask(day, time) {
            const val = prompt(`Add task for ${day} at ${time}:`);
            if (val) {
                const k = `${day}-${time}`;
                if (!this.gridSchedule[k]) this.gridSchedule[k] = [];
                this.gridSchedule[k].push(val);
                this.save();
            }
        },
        
        removeGridTask(day, time, index) {
            const k = `${day}-${time}`;
            if (this.gridSchedule[k]) {
                this.gridSchedule[k].splice(index, 1);
                if (this.gridSchedule[k].length === 0) delete this.gridSchedule[k];
                this.save();
            }
        },

        getGridTasks(day, time) {
            return this.gridSchedule[`${day}-${time}`] || [];
        }
    }
}