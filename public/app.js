var selectedUser = {};

const statusText = document.querySelector("#status_text");

const createForm = document.querySelector("#create_form");
const createId = document.querySelector("#create_id");
const createName = document.querySelector("#create_name");
const createAge = document.querySelector("#create_age");

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userDetails = {
    id: createId.value,
    name: createName.value,
    age: createAge.value,
  };
  fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error)
        updateStatus(data.error);
      } else {
        createId.value = "";
        createName.value = "";
        createAge.value = "";
        updateStatus(data.message);
        updateTable();
      }
    })
    .catch((err) => console.log(err));
});

function deleteUser(id) {
  fetch("/api/users/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        updateStatus(data.error);
      } else {
        console.log(data);
        updateStatus(data.message);
        updateTable();
      }
    })
    .catch((err) => console.log(err));
}

function updateUser(replaceid , userDetails) {
  fetch("/api/users/" + replaceid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        updateStatus(data.error);
      } else {
        console.log(data);
        updateStatus();
        updateTable();
      }
    })
    .catch((err) => console.log(err));
}

function updateStatus(message) {
  if (!message) {
    statusText.innerHTML = "";
    statusText.style.display = "none";
  } else {
    statusText.innerHTML = `<p>${message}</p>`;
    statusText.style.display = "block";
    statusText.style.width = "fit-content";
    statusText.style.backgroundColor = "rgba(255,0,0,0.2)";
  }
}

const UsersTable = document.querySelector("#users_table");
UsersTable.innerHTML = `
    <tr>
        <td colspan="4">
            <center>
                <img src="https://media2.giphy.com/media/IgQ8E05Dpg2ze/giphy.gif" alt="loading..." style="width:25px; transform: translateY(0%) scale(10); margin-top:10px;">
            </center>
        </td>
    </tr>
`;

async function fetchUser(id) {
  return fetch("/api/users/" + id)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        return data;
      }
    })
    .catch((err) => console.log(err));
}

const showDetails = document.querySelector("#show_details");

function closeDetails() {
  showDetails.innerHTML = "";
  showDetails.style.display = "none";
}

async function showDetailsUser(id) {
  selectedUser = await fetchUser(id);
  const selectedUserRow = document.querySelector(`tr[data-id="${id}"]`);
  showDetails.innerHTML = `
  <a href="#" class="close" onclick="closeDetails()" style="float:right; margin-top:0px;">&times;</a>
    <tr>
        <td> User ID: ${selectedUser.id} <br></td>
        <td> User Name: ${selectedUser.name} <br></td>
        <td> User Age: ${selectedUser.age} <br></td>
        <td> User Created At: ${selectedUser.date} <br></td>
        <td> User _ID: ${selectedUser._id} <br></td>
    </tr>
  `;
  selectedUserRow.style.backgroundColor = "rgb(255, 255, 255, 0.2)";
  // reset all other rows
  const allRows = document.querySelectorAll("tr");
  allRows.forEach((row) => {  
    if (row.dataset.id != id) {
      row.style.backgroundColor = "";
    }
  });
  showDetails.style.display = "block";

}

const updateTable = () => {
  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        if (data.length > 0) {
          data.sort((a, b) => a.id - b.id); //sort by id
          UsersTable.innerHTML = `
                <td style="width:35px;">ID</td>
                <td>Name</td>
                <td>Age</td>
                <td style="width:180px;">Quick Access</td>
                `;
          data.forEach((user) => {
            UsersTable.innerHTML += `
                        <tr id="${user.id}" data-id="${user.id}">
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.age}</td>
                            <td>
                                <button class="btn btn-danger" onclick="selectUser('${user.id}')">Update</button>
                                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
                                <button class="btn btn-danger" onclick="showDetailsUser('${user.id}')">Show Details</button>
                            </td>
                        </tr>
                    `;
          });
        }
      }
    })
    .catch((err) => console.log(err));
};

const selectUser = (id) => {
  selectedUser = id;
  const selectedUserRow = document.querySelector(`tr[data-id="${id}"]`);
  selectedUserRow.innerHTML = `
        <td style="width:100px;"><input type="text" id="update_id" value="${id}" style="margin-bottom:0px;"></td>
        <td><input type="text" id="update_name" value="${selectedUserRow.children[1].innerHTML}" style="margin-bottom:0px;"></td>
        <td><input type="text" id="update_age" value="${selectedUserRow.children[2].innerHTML}" style="margin-bottom:0px;"></td>
        <td>
            <button class="btn btn-danger" onclick="updateUser('${id}', {id: '${id}', name: document.querySelector('#update_name').value, age: document.querySelector('#update_age').value})">Confirm</button>
            <button class="btn btn-danger" onclick="updateTable()">Cancel</button>
        </td>
    `;
};

updateTable();