var selectedUser = null;

const createForm = document.querySelector("#create_form");
const createId = document.querySelector("#create_id");
const createName = document.querySelector("#create_name");
const createAge = document.querySelector("#create_age");

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(createId.value, createName.value, createAge.value);
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
        console.log(data.error);
        updateStatus(data.error);
      } else {
        console.log(data);
        createId.value = "";
        createName.value = "";
        createAge.value = "";
        updateStatus(`User ${data.name} created successfully`);
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
        updateStatus(`User with id ${id} deleted successfully`);
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
        updateStatus(`User ${data.name} updated successfully`);
        updateTable();
      }
    })
    .catch((err) => console.log(err));
}

function updateStatus(message) {
    const statusText = document.getElementById("status_text");
    if (statusText === null) {
        statusText.style.display = "none";
    } else {
        statusText.style.display = "block";
        statusText.innerHTML = message;
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
                            <td style="text-align:center;">
                                <button class="btn btn-danger" onclick="selectUser('${user.id}')">Update</button>
                                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
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
        <td style="width:100px;"><input type="text" id="update_id" value="${id}"></td>
        <td><input type="text" id="update_name" value="${selectedUserRow.children[1].innerHTML}"></td>
        <td><input type="text" id="update_age" value="${selectedUserRow.children[2].innerHTML}"></td>
        <td>
            <button class="btn btn-danger" onclick="updateUser('${id}', {id: '${id}', name: document.querySelector('#update_name').value, age: document.querySelector('#update_age').value})">Update</button>
        </td>
    `;
};

updateTable();
