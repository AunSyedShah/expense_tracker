const categories = [
    "Groceries", "Meals Out / Delivery", "Coffee", "Snacks", "Transportation / Gas",
    "Parking", "Household Stuff", "Entertainment", "Clothes / Shoes", "Rent / Housing",
    "Utilities", "Cell Phone", "Credit Cards", "Medical / Dental / Rx",
    "Subscriptions", "Random Crap", "Retail Therapy"
];

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tracker-body");
    const grandTotalElement = document.getElementById("grand-total");

    // Load saved data from LocalStorage
    const savedData = JSON.parse(localStorage.getItem("spendingTracker")) || {};

    categories.forEach(category => {
        const row = document.createElement("tr");
        let totalCell = document.createElement("td");
        totalCell.classList.add("weekly-total");
        totalCell.textContent = "$0.00";

        row.innerHTML = `<td>${category}</td>` + 
            Array.from({ length: 7 }, (_, dayIndex) => {
                const value = savedData[category]?.[dayIndex] || "";
                return `<td><input type="number" min="0" value="${value}" data-category="${category}" data-day="${dayIndex}"></td>`;
            }).join("") + totalCell.outerHTML;

        tableBody.appendChild(row);
    });

    updateWeeklyTotals();
    updateGrandTotal();

    // Add event listener to inputs
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", function () {
            saveData();
            updateWeeklyTotals();
            updateGrandTotal();
        });
    });
});

function saveData() {
    let data = {};

    document.querySelectorAll("input[type='number']").forEach(input => {
        const category = input.dataset.category;
        const dayIndex = input.dataset.day;
        if (!data[category]) data[category] = [];
        data[category][dayIndex] = parseFloat(input.value) || 0;
    });

    localStorage.setItem("spendingTracker", JSON.stringify(data));
}

function updateWeeklyTotals() {
    document.querySelectorAll("tr").forEach(row => {
        let total = 0;
        row.querySelectorAll("input[type='number']").forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        const totalCell = row.querySelector(".weekly-total");
        if (totalCell) totalCell.textContent = `$${total.toFixed(2)}`;
    });
}

function updateGrandTotal() {
    let grandTotal = 0;
    document.querySelectorAll(".weekly-total").forEach(cell => {
        grandTotal += parseFloat(cell.textContent.replace("$", "")) || 0;
    });
    document.getElementById("grand-total").textContent = `$${grandTotal.toFixed(2)}`;
}

function resetTracker() {
    localStorage.removeItem("spendingTracker");
    document.querySelectorAll("input[type='number']").forEach(input => input.value = "");
    document.querySelectorAll(".weekly-total").forEach(cell => cell.textContent = "$0.00");
    document.getElementById("grand-total").textContent = "$0.00";
}
