const BASE_URL = "http://localhost:5000";
// LOGIN
function login(event) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("userId", data.userId);
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed");
        }
    });
}

// SUBMIT COMPLAINT
function submitComplaint() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const userId = localStorage.getItem("userId");

    fetch(BASE_URL + "/submit-complaint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, userId })
    })
    .then(res => res.json())
    .then(data => {
        alert("Complaint Submitted!");
    });
}
//LOAD COMPLAINT
function loadComplaints() {
    const userId = localStorage.getItem("userId");

    fetch(BASE_URL + "/my-complaints?userId=" + userId)
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("complaintsList");
        list.innerHTML = "";

        data.forEach(c => {
            let badgeClass = "";

            if (c.status === "pending") badgeClass = "pending";
            else if (c.status === "in progress") badgeClass = "inprogress";
            else badgeClass = "resolved";

            list.innerHTML += `
                <div>
                    <h3>${c.title}</h3>
                    <p>${c.description}</p>
                    <span class="badge ${badgeClass}">${c.status}</span>
                    <hr>
                </div>
            `;
        });
    });
}