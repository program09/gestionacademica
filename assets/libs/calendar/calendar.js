class FullCalendarManager {
    constructor({content = 'calendar', slot ='00:15:00', start = '07:00:00', end = '20:00:00', hiddenDays = []}) {
        this.calendarEl = document.getElementById(content);
        if (!this.calendarEl) {
            console.error("No se encontró el elemento del calendario");
            return;
        }
        this.slot = slot;
        this.start = start;
        this.end = end;
        this.hiddenDays = hiddenDays;
        this.selectedEvent = null;
        this.onEdit = null;
        this.onDelete = null;
        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            locale: "es",
            height: "auto",
            initialView: "timeGridWeek",
            headerToolbar: { left: "", center: "", right: "" },
            slotDuration: this.slot,
            firstDay: 1,
            hiddenDays: this.hiddenDays,
            slotMinTime: this.start,
            slotMaxTime: this.end,
            slotLabelFormat: { hour: "numeric", minute: "2-digit", meridiem: "short" },
            dayHeaderFormat: { weekday: "short" },
            allDaySlot: false,
            events: [],
            eventClick: (info) => {
                this.selectedEvent = info.event;
                this.mostrarContextMenu(info.jsEvent);
            },
            eventContent: function (arg) {
                let event = arg.event;
                let startTime = event.start ? event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "";
                let endTime = event.end ? event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "";
                let section = event.extendedProps.section || "2";
                let level = event.extendedProps.level || "4";
                let content = document.createElement("div");
                content.innerHTML = `
                    <div class="fc-event-duration">${startTime} - ${endTime}</div>
                    <div class="fc-event-title">${event.title}</div>
                    <div class=" d-inline-block mt-2 gap-2">
                        <div class="fc-event-section"><span class="badge bg-primary">${level} - ${section}</span></div>
                    </div>
                `;
                return { domNodes: [content] };
            },
        });
        this.calendar.render();
    }

    // Cargar eventos al calendario
    setEvents(eventos) {
        if (!Array.isArray(eventos)) {
            console.error("Los eventos deben ser un array");
            return;
        }
        this.calendar.removeAllEvents();
        this.calendar.addEventSource(eventos);
    }

    // Limpiar los eventos
    clearEvents(){this.calendar.removeAllEvents();}

    // Agregar evento al calendario
    addEvent(evento) {
        if (!evento || typeof evento !== "object") {
            console.error("El evento debe ser un objeto válido");
            return;
        }
        this.calendar.addEvent(evento);
    }

    // Modificar evento por ID
    updateEvent({id, data}) {
        let evento = this.calendar.getEventById(id);
        if (evento) {evento.remove();}
        else {console.warn("No se encontró el evento con ID:", id, "Creando uno nuevo.");}
        this.addEvent({ id: id, ...data });
    }
    
    // Eliminar evento por ID
    eliminarEvento(id) {
        let evento = this.calendar.getEventById(id);
        evento.remove();
    }

    setupActions(onEdit = null, onDelete = null) {
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    // Mostrar menú de acciones
    mostrarContextMenu(jsEvent) {
        this.eliminarContextMenu();
        let contextMenu = document.createElement("div");
        contextMenu.classList.add("context-menu");
        contextMenu.classList.add("dropdown");
        contextMenu.style.position = "absolute";
        contextMenu.style.zIndex = "9999";
        contextMenu.style.background = "#fff";
        contextMenu.style.padding = "10px";
        contextMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        contextMenu.style.borderRadius = "10px";
        contextMenu.style.minWidth = "150px";

        contextMenu.innerHTML = `
            <ul style="list-style: none; margin: 0; padding: 0;">
                <li class="dropdown-item"><a href="#" id="editEvent" style="text-decoration: none; color: #007bff; display: block; padding: 8px;">✏️ Editar Evento</a></li>
                <li class="dropdown-item"><a href="#" id="deleteEvent" style="text-decoration: none; color: #dc3545; display: block; padding: 8px;">🗑️ Eliminar Evento</a></li>
            </ul>
        `;

        document.body.appendChild(contextMenu);
        let x = jsEvent.pageX;
        let y = jsEvent.pageY;
        const menuWidth = 190;
        const menuHeight = 110;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        if (x + menuWidth > windowWidth) {contextMenu.style.left = `${x - menuWidth}px`;}
        else {contextMenu.style.left = `${x}px`;}
        if (y + menuHeight > windowHeight) {contextMenu.style.top = `${y - menuHeight}px`;}
        else {contextMenu.style.top = `${y}px`;}
        document.getElementById("editEvent").addEventListener("click", (e) => {
            e.preventDefault();
            if (this.selectedEvent && typeof this.onEdit === "function") {this.onEdit(this.selectedEvent.id);}
            this.eliminarContextMenu();
        });
        document.getElementById("deleteEvent").addEventListener("click", (e) => {
            e.preventDefault();
            if (this.selectedEvent && typeof this.onDelete === "function") {this.onDelete(this.selectedEvent.id);}
            this.eliminarContextMenu();
        });
        setTimeout(() => {document.addEventListener("click", (event) => {if (!contextMenu.contains(event.target) && !event.target.closest(".fc-event")) {this.eliminarContextMenu();}},{ once: true });}, 50);
    }

    // Eliminar menú contextual
    eliminarContextMenu() {
        let existingMenu = document.querySelector(".context-menu");
        if (existingMenu) {existingMenu.remove();}
    }
}


const calendario = new FullCalendarManager({
    content:"calendar",
    slot: '00:15:00',
    start: '07:00:00',
    end: '20:00:00',
    hiddenDays: [0]
});

calendario.setEvents([
    { id: "1", title: "Matemáticas", startTime: "08:00:00", endTime: "09:30:00", section: 'B', level: 'gsgs', color: "#ff5722", daysOfWeek: [3] },
    { id: "2", title: "Comunicación", startTime: "09:30:00", endTime: "11:00:00", color: "#4caf50", daysOfWeek: [2] },
    { id: "3", title: "Reunión", startTime: "10:00:00", endTime: "11:00:00", color: "#ff5722", daysOfWeek: [4] },
    { id: "4", title: "Clase de Matemáticas", startTime: "07:00:00", endTime: "13:30:00", section: 'B', level: 'gsgs', color: "#4caf50", daysOfWeek: [6] }
]);

calendario.addEvent({ id: "5", title: "Consulta médica", startTime: "14:00:00", endTime: "15:00:00", color: "#2196f3" ,daysOfWeek: [2] });

calendario.updateEvent({
    id:1,
    data:{ 
        title: "Nueva Reunión",
        startTime: "14:00:00",
        endTime: "15:30:00",
        level: 'up',
        section: 'ap',
        color: "#0000ff",
        daysOfWeek: [5]
    }
});

calendario.setupActions(
    (rowId) => {
        console.log(`Editar evento con ID: ${rowId}`);
        openModal("modalId");
        $("button.submit.saved").hide();
        $("button.submit.updated").show();
    },
    (rowId) => {
        console.log(`Eliminar evento con ID: ${rowId}`);
        calendario.eliminarEvento(rowId);
    }
);

