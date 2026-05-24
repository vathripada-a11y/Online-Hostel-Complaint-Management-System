const BASE_URL = "http://localhost:3000";

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(BASE_URL + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      if (data.role === "student") {
        window.location.href = "dashboard.html";
      } else if (data.role === "warden") {
        window.location.href = "../warden_login.html";
      } else if (data.role === "admin") {
        window.location.href = "/admin.html";
      }
    } else {
      alert(data.message);
    }
  });
}

// SUBMIT COMPLAINT
function submitComplaint() {
  const type = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  fetch(BASE_URL + "/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, description })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Complaint submitted successfully!")
    } else {
      alert(data.message)
    }
  });
}

// LOAD COMPLAINTS
function loadComplaints() {
  fetch(BASE_URL + "/api/complaints/my-complaints", {
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      alert("Please login first!")
      window.location.href = "studentlogin.html"
      return
    }

    const list = document.getElementById("complaintsList");
    list.innerHTML = "";

    if (data.complaints.length === 0) {
      list.innerHTML = "<p>No complaints submitted yet!</p>"
      return
    }

    data.complaints.forEach(c => {
      let badgeClass = c.status === "pending" ? "pending" :
                       c.status === "in_progress" ? "inprogress" : "resolved";

     list.innerHTML += `
  <div class="complaint-card">
          <h3>${c.type}</h3>
          <p>${c.description}</p>
          <span class="badge ${badgeClass}">${c.status.replace('_', ' ')}</span>
          <p style="font-size:12px; color:#999; margin-top:8px;">
            ${new Date(c.created_at).toLocaleDateString()}
          </p>
          
        </div>
      `;
    });
  });
}