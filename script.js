document.addEventListener('DOMContentLoaded', () => {
    const app = {
        isAdmin: false,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        events: {},

        init() {
            this.setupMonthSelector();
            this.setupColorPickers();
            this.setupAdminLogin();
            this.renderCalendar();
        },

        setupMonthSelector() {
            const selector = document.getElementById('month-selector');
            const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            months.forEach((month, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = month;
                selector.appendChild(option);
            });
            selector.value = this.currentMonth;
            selector.addEventListener('change', (e) => {
                this.currentMonth = parseInt(e.target.value);
                this.renderCalendar();
            });
        },

        setupColorPickers() {
            document.getElementById('bg-color').addEventListener('change', (e) => {
                document.body.style.backgroundColor = e.target.value;
            });
            document.getElementById('font-color').addEventListener('change', (e) => {
                document.body.style.color = e.target.value;
            });
        },

        setupAdminLogin() {
            document.getElementById('login-btn').addEventListener('click', () => {
                const password = document.getElementById('admin-password').value;
                if (password === 'admin123') { // 這裡設置管理員密碼
                    this.isAdmin = true;
                    alert('管理員登入成功！');
                    this.renderCalendar();
                } else {
                    alert('密碼錯誤！');
                }
            });
        },

        renderCalendar() {
            const calendar = document.getElementById('calendar');
            calendar.innerHTML = '';
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                dayElement.innerHTML = `<strong>${i}</strong>`;
                
                const dateKey = `${this.currentYear}-${this.currentMonth + 1}-${i}`;
                if (this.events[dateKey]) {
                    this.events[dateKey].forEach((event, index) => {
                        const eventElement = document.createElement('div');
                        eventElement.classList.add('event');
                        eventElement.innerHTML = `<span class="event-time">${event.time}</span>: ${event.description}`;
                        
                        if (this.isAdmin) {
                            eventElement.onclick = () => this.editEvent(dateKey, index);
                            eventElement.oncontextmenu = (e) => {
                                e.preventDefault();
                                this.deleteEvent(dateKey, index);
                            };
                        }
                        
                        dayElement.appendChild(eventElement);
                    });
                }

                if (this.isAdmin) {
                    const addButton = document.createElement('button');
                    addButton.textContent = '+';
                    addButton.onclick = () => this.addEvent(dateKey);
                    dayElement.appendChild(addButton);
                }

                calendar.appendChild(dayElement);
            }
        },

        addEvent(date) {
            const time = prompt('請輸入事件時間 (24小時制，例如: 14:30):');
            const description = prompt('請輸入事件描述:');
            if (time && description) {
                if (!this.events[date]) {
                    this.events[date] = [];
                }
                this.events[date].push({ time, description });
                this.renderCalendar();
            }
        },

        editEvent(date, index) {
            const event = this.events[date][index];
            const newTime = prompt('請輸入新的事件時間:', event.time);
            const newDescription = prompt('請輸入新的事件描述:', event.description);
            
            if (newTime && newDescription) {
                this.events[date][index] = { time: newTime, description: newDescription };
                this.renderCalendar();
            }
        },

        deleteEvent(date, index) {
            if (confirm('確定要刪除這個事件嗎？')) {
                this.events[date].splice(index, 1);
                if (this.events[date].length === 0) {
                    delete this.events[date];
                }
                this.renderCalendar();
            }
        }
    };

    app.init();
});
