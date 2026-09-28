let data = JSON.parse(localStorage.getItem("attendance")) || [];

const form = document.getElementById("attendanceForm");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const editId = document.getElementById("editId");

const search = document.getElementById("search");
const filter = document.getElementById("filter");
const viewDate = document.getElementById("viewDate");

function today() {
    return new Date().toISOString().split("T")[0];
}

dateInput.value = today();
viewDate.value = today();

function save() {
    localStorage.setItem("attendance", JSON.stringify(data));
}

function showData() {
    let text = search.value.toLowerCase();
    let selectedStatus = filter.value;
    let selectedDate = viewDate.value;

    let records = data.filter(x =>
        (x.name.toLowerCase().includes(text) ||
        x.roll.toLowerCase().includes(text)) &&
        (selectedStatus === "All" || x.status === selectedStatus) &&
        (!selectedDate || x.date === selectedDate)
    );

    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    records.forEach((x, i) => {
        let all = data.filter(a => a.roll === x.roll);
        let present = all.filter(a => a.status === "Present").length;
        let percent = Math.round((present / all.length) * 100);

        table.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${x.name}</td>
                <td>${x.roll}</td>
                <td>${x.date}</td>
                <td class="${x.status.toLowerCase()}">${x.status}</td>
                <td>${percent}%</td>
                <td>
                    <button class="edit" onclick="editRecord(${x.id})">Edit</button>
                    <button class="delete" onclick="deleteRecord(${x.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("empty").style.display =
        records.length ? "none" : "block";

    updateSummary();
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = nameInput.value.trim();
    let roll = rollInput.value.trim();
    let date = dateInput.value;
    let status = statusInput.value;

    if (!name || !roll || !date || !status) {
        alert("Please fill all fields.");
        return;
    }

    if (editId.value) {
        let record = data.find(x => x.id == editId.value);

        record.name = name;
        record.roll = roll;
        record.date = date;
        record.status = status;

        editId.value = "";
        document.getElementById("submitBtn").textContent = "Add Student";
    } else {
        data.push({
            id: Date.now(),
            name: name,
            roll: roll,
            date: date,
            status: status
        });
    }

    save();
    form.reset();

    dateInput.value = today();

    showData();
});

function editRecord(id) {
    let x = data.find(a => a.id === id);

    nameInput.value = x.name;
    rollInput.value = x.roll;
    dateInput.value = x.date;
    statusInput.value = x.status;
    editId.value = x.id;

    document.getElementById("submitBtn").textContent = "Update Student";

    window.scrollTo(0, 0);
}

function deleteRecord(id) {
    if (confirm("Delete this attendance record?")) {
        data = data.filter(x => x.id !== id);
        save();
        showData();
    }
}

function updateSummary() {
    let selectedDate = viewDate.value;

    let records = data.filter(x =>
        !selectedDate || x.date === selectedDate
    );

    let p = records.filter(x => x.status === "Present").length;
    let a = records.filter(x => x.status === "Absent").length;

    document.getElementById("total").textContent = records.length;
    document.getElementById("present").textContent = p;
    document.getElementById("absent").textContent = a;

    let percent = records.length
        ? Math.round((p / records.length) * 100)
        : 0;

    document.getElementById("percentage").textContent =
        percent + "%";
}

search.addEventListener("input", showData);
filter.addEventListener("change", showData);
viewDate.addEventListener("change", showData);

showData();