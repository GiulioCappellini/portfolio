const importantDates = [];
let lastCalendarArg = null;

export function createCalendar() {
    const currentMonth = document.querySelector(".currentMonth");
    const prevButton = document.querySelector(".prevButton");
    const nextButton = document.querySelector(".nextButton");
    const days = document.querySelector(".days");
    const numbers = document.querySelector(".numbers");

    const date = new Date();

    const arg = {
        date,
        year: date.getFullYear(),
        month: date.getMonth(),
        currentMonth,
        days,
        numbers
    };
    configCalendar(arg);

    prevButton.addEventListener("click", () => {
        if (arg.month === 0) {
            arg.month = 11;
            arg.year -= 1;
        } else {arg.month -= 1};
        configCalendar(arg);
    });

    nextButton.addEventListener("click", () => {
        if (arg.month === 11) {
            arg.month = 0;
            arg.year += 1;
        } else {arg.month += 1};
        configCalendar(arg);
    });
};

function configCalendar(arg) {
    let {
        date,
        year,
        month,
        currentMonth,
        days,
        numbers
    } = arg;

    let existDays = document.querySelectorAll(".days *");
    let existNumbers = document.querySelectorAll(".numbers *");
    if (existDays || existNumbers) {
        existDays.forEach((day) => {day.remove()});
        existNumbers.forEach((num) => {num.remove()});
    };

    const allMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    currentMonth.innerText = `${allMonths[month]} ${year}`;

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayIsVisible = today.getFullYear() === year && today.getMonth() === month;

    let nextMonthDay = 1;

    for (let i = 0; i < 49; i++) {
        let cell = document.createElement("span");
        if (i < 7) {
            cell.classList.add("dayCell", "cell");
            cell.innerText = weekDays[i];
            days.append(cell);
        } else {
            const slot = i - 7;

            cell.classList.add("numberCell", "cell");
            if (slot < firstDay) {
                cell.innerText = String(lastDayPrevMonth - firstDay + 1 + slot);
                cell.classList.add("prevDay");
            } else if (slot < firstDay + daysInMonth) {
                const dayNum = slot - firstDay + 1;
                cell.innerText = String(dayNum);
                if (todayIsVisible && dayNum === today.getDate()) {
                    cell.classList.add("today");
                };
            } else {
                cell.innerText = String(nextMonthDay);
                cell.classList.add("nextDay");
                nextMonthDay++;
            };
            numbers.append(cell);
        };
    };

    markImportantDateCellsForView(year, month, numbers);
    lastCalendarArg = arg;
    refreshClosestEventPanel();
};

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

function nextYearlyOccurrenceFromToday(imp) {
    const today0 = startOfToday();
    const anchor = new Date(imp.year, imp.month, imp.day);
    anchor.setHours(0, 0, 0, 0);
    if (anchor > today0) {return null};

    const y = today0.getFullYear();
    let candidate = new Date(y, imp.month, imp.day);
    candidate.setHours(0, 0, 0, 0);
    if (candidate < today0) {
        candidate = new Date(y + 1, imp.month, imp.day);
        candidate.setHours(0, 0, 0, 0);
    };
    return candidate;
};

function getNextClosestImportantOccurrence() {
    let best = null;
    let bestEntry = null;

    for (const imp of importantDates) {
        const when = nextYearlyOccurrenceFromToday(imp);
        if (!when) {continue};
        if (!best || when.getTime() < best.getTime()) {
            best = when;
            bestEntry = imp;
        };
    };

    return best && bestEntry ? { date: best, entry: bestEntry } : null;
};

function formatDateBR(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

function refreshClosestEventPanel() {
    const dateEl = document.querySelector(".closestEventDate");
    const descP = document.querySelector(".closestEvent .description p");
    if (!dateEl) {return};

    const next = getNextClosestImportantOccurrence();
    if (!next) {
        dateEl.textContent = "";
        if (descP) {descP.textContent = ""};
        return;
    };

    dateEl.textContent = formatDateBR(next.date);
    if (descP) {descP.textContent = next.entry.text};
};

window.toggleDescription = function (event) {
    const expandMore = "../images_videos/images/forStyle/expandMore.png";
    const expandLess = "../images_videos/images/forStyle/expandLess.png";

    const btn = event.target.closest(".toggleDescription");
    if (!btn) {return};
    const eventRoot = btn.closest(".event");
    const description = eventRoot && eventRoot.querySelector(".description");
    const img = btn.querySelector("img");
    if (!description || !img) {return};

    if (img.src.includes("expandMore.png")) {
        img.src = expandLess;
        description.style.display = "block";
    } else {
        img.src = expandMore;
        description.style.display = "none";
    };
};

export function addImportantDate(day, month, year, text) {
    const entry = {
        day: parseInt(String(day).trim(), 10),
        month: parseInt(String(month).trim(), 10) - 1,
        year: parseInt(String(year).trim(), 10),
        text: String(text).trim()
    };
    importantDates.push(entry);
    if (lastCalendarArg) {
        configCalendar(lastCalendarArg);
    } else {refreshClosestEventPanel()};

    addToListOfImportantDates(day, month, year, text);
    return entry;
};

function markImportantDateCellsForView(viewYear, viewMonth, numbersEl) {
    const startOfTodayVal = startOfToday();

    for (const imp of importantDates) {
        const anchor = new Date(imp.year, imp.month, imp.day);
        anchor.setHours(0, 0, 0, 0);
        if (anchor > startOfTodayVal || imp.month !== viewMonth) {continue};

        const cells = numbersEl.querySelectorAll(".numberCell");
        for (const cell of cells) {
            if (cell.classList.contains("prevDay") || cell.classList.contains("nextDay")) {continue};
            const n = parseInt(cell.textContent.trim(), 10);
            if (n === imp.day) {
                cell.classList.add("importantDate");
                cell.classList.remove("futureDate");
            };
        };
    };

    for (const imp of importantDates) {
        const anchor = new Date(imp.year, imp.month, imp.day);
        anchor.setHours(0, 0, 0, 0);
        if (anchor <= startOfTodayVal || imp.month !== viewMonth || viewYear !== imp.year) {continue};

        const cells = numbersEl.querySelectorAll(".numberCell");
        for (const cell of cells) {
            if (cell.classList.contains("prevDay") || cell.classList.contains("nextDay")) {continue};
            const n = parseInt(cell.textContent.trim(), 10);
            if (n === imp.day && !cell.classList.contains("importantDate")) {cell.classList.add("futureDate")};
        };
    };
};

function addToListOfImportantDates(day, month, year, text) {
    const listOfDatesUl = document.querySelector(".listOfDates > ul");
    const event = document.querySelector(".event");
    const newLi = document.createElement("li");

    listOfDatesUl.append(newLi);
    newLi.append(event.cloneNode(true));
    
    const closestEventDate = newLi.querySelector(".closestEventDate");
    const description = newLi.querySelector(".description");

    closestEventDate.innerText = `${day}/${month}/${year}`;
    description.innerText = text;
};
