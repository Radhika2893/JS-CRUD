let users = JSON.parse(localStorage.getItem("persondata")) || [];
let editingUserId = null;
let filteredUsers = null;

function addOrUpdateUser() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();

  if (!name || !age) {
    alert("Please enter both name and age.");
    return;
  }

  if (editingUserId === null) {
    const id = Date.now();
    users.push({ id, name, age: parseInt(age) });
  } else {
    const user = users.find(u => u.id === editingUserId);
    if (user) {
      user.name = name;
      user.age = parseInt(age);
    }
    editingUserId = null;
    document.getElementById("submitBtn").textContent = "Add User";
  }

  localStorage.setItem("persondata", JSON.stringify(users));
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  filteredUsers = null;
  displayUsers();
  displayArray();
}

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (user) {
    document.getElementById("name").value = user.name;
    document.getElementById("age").value = user.age;
    editingUserId = id;
    document.getElementById("submitBtn").textContent = "Update User";
  }
}

function deleteUser(id) {
  users = users.filter(user => user.id !== id);
  localStorage.setItem("persondata", JSON.stringify(users));
  editingUserId = null;
  document.getElementById("submitBtn").textContent = "Add User";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  filteredUsers = null;
  displayUsers();
  displayArray();
}

function displayArray() {
  const simplified = users.map(u => ({ name: u.name, age: u.age }));
  document.getElementById("arrayData").textContent = JSON.stringify(simplified, null, 2);
}

function displayUsers() {
  const list = document.getElementById("userList");
  list.innerHTML = "";

  const toDisplay = filteredUsers || [...users];

  toDisplay.forEach(user => {
    const div = document.createElement("div");
    div.innerHTML = `Name: ${user.name}, Age: ${user.age}
      <button onclick="editUser(${user.id})">Edit</button>
      <button onclick="deleteUser(${user.id})">Delete</button>`;
    list.appendChild(div);
  });
}

function toggleFilterInput() {
  const type = document.getElementById("filterBy").value;
  const input = document.getElementById("filterInput");

  input.style.display = type ? "inline-block" : "none";
  input.placeholder = `Enter ${type}`;
  input.value = "";
}

function filterUsers() {
  const filterType = document.getElementById("filterBy").value;
  const query = document.getElementById("filterInput").value.trim().toLowerCase();

  if (!filterType || query === "") {
    alert("Please select filter type and enter a value.");
    return;
  }

  if (filterType === "name") {
    filteredUsers = users
      .filter(user => user.name.toLowerCase().startsWith(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  } else if (filterType === "age") {
    const ageNum = parseInt(query);
    if (isNaN(ageNum)) {
      alert("Please enter a valid number for age.");
      return;
    }

    filteredUsers = users
      .filter(user => user.age >= ageNum)
      .sort((a, b) => a.age - b.age);
  }

  displayUsers();
}

function clearFilter() {
  filteredUsers = null;
  document.getElementById("filterBy").value = "";
  document.getElementById("filterInput").value = "";
  document.getElementById("filterInput").style.display = "none";
  displayUsers();
}

function sortUsers() {
  const sortType = document.getElementById("filterBy").value;

  if (!sortType) {
    alert("Please select 'Name' or 'Age' to sort by.");
    return;
  }

  let listToSort = filteredUsers || [...users];

  if (sortType === "name") {
    listToSort.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "age") {
    listToSort.sort((a, b) => a.age - b.age);
  }

  filteredUsers = listToSort;
  displayUsers();
}