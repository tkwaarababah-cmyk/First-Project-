console.log("JavaScript is working!");

const API_URL = "http://localhost:3000/api/expenses";



// ==============================
// SERVER ERROR HANDLING
// ==============================
 
let serverOfflineAlert = false;
 
function showServerError() {
    if (!serverOfflineAlert) {
        serverOfflineAlert = true;
        alert("⚠️ Server is offline!\n\nPlease make sure the backend server is running on http://localhost:3000\n\nCommand: node server.js");
        
        // إعادة محاولة الاتصال كل 5 ثواني
        setTimeout(() => {
            serverOfflineAlert = false;
        }, 5000);
    }
}
 
// ==============================
// CHECK SERVER CONNECTION
// ==============================
 
async function checkServerConnection() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        
        if (response.ok) {
            console.log("✅ Server is online");
            return true;
        }
    } catch (error) {
        console.warn("❌ Server is offline:", error.message);
        return false;
    }
}
 

// ==============================
// 1. FETCH EXPENSES - GET
// ==============================

async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// ==============================
// 2. CALCULATE STATISTICS
// ==============================

function calculateStats(expenses) {
    if (expenses.length === 0) {
        return {
            total: 0,
            count: 0,
            highest: 0
        };
    }

    const total = expenses.reduce((sum, exp) => {
        return sum + parseFloat(exp.amount);
    }, 0);

    const count = expenses.length;

    const highest = Math.max(
        ...expenses.map(exp => parseFloat(exp.amount))
    );

    return {
        total: total.toFixed(2),
        count: count,
        highest: highest.toFixed(2)
    };
}

// ==============================
// 3. FILTER EXPENSES
// ==============================

function filterExpenses(expenses, category) {
    if (category === "All") {
        return expenses;
    }
    return expenses.filter(expense => expense.category === category);
}

// ==============================
// 4. DISPLAY EXPENSES - الجدول
// ==============================

function displayExpenses(expenses) {
    const tableBody = document.getElementById("expensesList");

    if (!tableBody) {
        console.error("Table body element (expensesList) not found!");
        return;
    }

    tableBody.innerHTML = "";

    if (expenses.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No expenses found.
                </td>
            </tr>
        `;
        return;
    }

    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${expense.title}</td>
            <td>${parseFloat(expense.amount).toFixed(2)} JD</td>
            <td><span class="badge bg-info">${expense.category}</span></td>
            <td>${expense.date}</td>
            <td>
                <button 
                    class="btn btn-sm btn-warning" 
                    onclick="editExpense(${expense.id})"
                    title="Edit"
                >
                    ✏️ Edit
                </button>
                <button 
                    class="btn btn-sm btn-danger" 
                    onclick="confirmDelete(${expense.id})"
                    title="Delete"
                >
                    🗑️ Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// ==============================
// 5. ADD EXPENSE - POST
// ==============================

async function addExpense(expense) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add expense");
        }

        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ==============================
// 6. UPDATE EXPENSE - PUT
// ==============================

async function updateExpense(id, expense) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update expense");
        }

        return data;

    } catch (error) {
        console.error("Error:", error);
        alert("Update Error: " + error.message);
        return null;
    }
}

// ==============================
// 7. DELETE EXPENSE - DELETE
// ==============================

async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete expense');
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.message };
    }
}

// ==============================
// 8. CONFIRM DELETE
// ==============================

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        performDelete(id);
    }
}

// ==============================
// 9. PERFORM DELETE
// ==============================

async function performDelete(id) {
    const result = await deleteExpense(id);

    if (result.success) {
        alert('✅ Expense deleted successfully!');
        loadData();
    } else {
        alert('❌ Error: ' + result.error);
    }
}

// ==============================
// 10. EDIT EXPENSE
// ==============================

async function editExpense(id) {
    try {
        // GET EXPENSE BY ID
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Expense not found");
        }

        const expense = await response.json();

        // ASK FOR NEW TITLE
        const title = prompt("Enter title:", expense.title);
        if (title === null) return;

        // ASK FOR NEW AMOUNT
        const amount = prompt("Enter amount:", expense.amount);
        if (amount === null) return;

        // ASK FOR NEW CATEGORY
        const category = prompt("Enter category:", expense.category);
        if (category === null) return;

        // ASK FOR NEW DATE
        const date = prompt("Enter date (YYYY-MM-DD):", expense.date);
        if (date === null) return;

        // VALIDATION
        if (!title.trim()) {
            alert("Title cannot be empty.");
            return;
        }

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Amount must be greater than 0.");
            return;
        }

        if (!category) {
            alert("Category is required.");
            return;
        }

        if (!date) {
            alert("Date is required.");
            return;
        }

        // CREATE UPDATED EXPENSE OBJECT
        const updatedExpense = {
            title: title.trim(),
            amount: parsedAmount,
            category: category,
            date: date
        };

        // PUT REQUEST
        const result = await updateExpense(id, updatedExpense);

        // RESULT
        if (result) {
            alert("✅ Expense updated successfully!");
            loadData();
        } else {
            alert("❌ Failed to update expense.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
}

// ==============================
// 11. FORM SUBMIT - ADD EXPENSE
// ==============================

document.getElementById("expenseForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // GET FORM VALUES
    const title = document.getElementById("title").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    // VALIDATION
    if (!title) {
        alert("Please enter a title.");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    if (!category) {
        alert("Please select a category.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

    // CREATE EXPENSE OBJECT
    const expense = {
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    // DISABLE SUBMIT BUTTON
    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // POST REQUEST
    const result = await addExpense(expense);

    // RE-ENABLE SUBMIT BUTTON
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit New Expense";

    // RESULT
    if (result.success) {
        alert("✅ Expense added successfully!");
        document.getElementById("expenseForm").reset();
        loadData();
    } else {
        alert("❌ Error: " + result.error);
    }
});

// ==============================
// 12. LOAD DATA (GET + DISPLAY)
// ==============================

async function loadData() {
    // GET ALL EXPENSES
    const expenses = await fetchExpenses();

    // CALCULATE STATISTICS
    const stats = calculateStats(expenses);

    // UPDATE TOTAL
    document.getElementById("total").textContent = stats.total + " JD";

    // UPDATE COUNT
    document.getElementById("count").textContent = stats.count;

    // UPDATE HIGHEST
    document.getElementById("highest").textContent = stats.highest + " JD";

    // GET FILTER VALUE
    const categoryFilter = document.getElementById("categoryFilter");
    const category = categoryFilter ? categoryFilter.value : "All";

    // FILTER EXPENSES
    const filteredExpenses = filterExpenses(expenses, category);

    // DISPLAY TABLE
    displayExpenses(filteredExpenses);
}

// ==============================
// 13. INITIALIZE
// ==============================

document.addEventListener('DOMContentLoaded', function () {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = today;
    }

    // Add category filter listener
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", loadData);
    }

    // Load data on page open
    loadData();
});

// ==============================
// 14. AUTO REFRESH EVERY 5 SECONDS
// ==============================

setInterval(loadData, 5000);





const darkModeBtn =
    document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }

});