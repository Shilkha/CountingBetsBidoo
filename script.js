// id table taken from bidoo auction page
const table = document.getElementById('DStorico');
// Where to put the dynamic table
const boxContentDiv = document.getElementById('boxcontent');

let sortOrder = 'asc'; // 'asc' for ascending order, 'desc' for descending order

// Store the initial values
let initialValue = getPrice();

// Create a new table to display the current values
const currentValueTable = document.createElement('table');
const tbody = document.createElement('tbody');

// Apply CSS styling to the table
currentValueTable.style.borderCollapse = 'collapse';
currentValueTable.style.width = '100%';
currentValueTable.style.fontFamily = 'Arial, sans-serif';
currentValueTable.style.fontSize = '14px';

// Apply CSS styling to the table cells
const tableCells = currentValueTable.getElementsByTagName('td');
for (let i = 0; i < tableCells.length; i++) {
    tableCells[i].style.border = '1px solid #ddd';
    tableCells[i].style.padding = '10px';
    tableCells[i].style.textAlign = 'center';
}

// Apply CSS styling to the table header cells
const tableHeaders = currentValueTable.getElementsByTagName('th');
for (let j = 0; j < tableHeaders.length; j++) {
    tableHeaders[j].style.border = '1px solid #ddd';
    tableHeaders[j].style.padding = '10px';
    tableHeaders[j].style.backgroundColor = '#f2f2f2';
    tableHeaders[j].style.fontWeight = 'bold';
}

// Apply CSS styling to the table rows
const tableRows = currentValueTable.getElementsByTagName('tr');
for (let k = 0; k < tableRows.length; k++) {
    if (k % 2 === 0) {
        tableRows[k].style.backgroundColor = '#f9f9f9';
    }
}

// Create a header row
const headerRow = document.createElement('tr');
const headers = ['Price', 'Mode', 'Time', 'User', 'Bet Number'];

// Apply CSS styling to the table header row
headerRow.style.backgroundColor = '#f2f2f2';
headerRow.style.fontWeight = 'bold';
headerRow.style.borderColor = '#000000';

// Add the header cells to the header row
for (const headerText of headers) {
    const headerCell = document.createElement('th');
    headerCell.style.border = '1px solid #ddd';
    headerCell.style.padding = '10px';

    if (headerText === 'Time') {
        const timeButton = document.createElement('button');
        timeButton.textContent = headerText;
        timeButton.style.border = 'none';
        timeButton.style.background = 'none';
        timeButton.style.color = 'blue';
        timeButton.style.textDecoration = 'underline';
        timeButton.style.cursor = 'pointer';

        headerCell.appendChild(timeButton);
    } else {
        headerCell.textContent = headerText;
    }

    headerRow.appendChild(headerCell);
}

// Append the header row to the table body
tbody.appendChild(headerRow);
headerRow.children[2].addEventListener('click', function () {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    sortRows();
});

// Helper function to update the row with current values
function updateRow(currentPrice, currentMode, currentTime, currentUser, userRow) {
    const valueCell = userRow.getElementsByTagName('td')[0];
    const modeCell = userRow.getElementsByTagName('td')[1];
    const timeCell = userRow.getElementsByTagName('td')[2];
    const userChecksCell = userRow.getElementsByTagName('td')[4];

    updateCellValue(valueCell, currentPrice);
    updateCellValue(modeCell, currentMode);
    updateCellValue(timeCell, currentTime);

    let userChecks = parseInt(userChecksCell.textContent);
    if (!isNaN(userChecks)) {
        userChecks++;
    } else {
        userChecks = 1;
    }
    updateCellValue(userChecksCell, String(userChecks));
    sortRows();
}

function sortRows() {
    const rows = tbody.getElementsByTagName('tr');
    const rowsArray = Array.from(rows);

    rowsArray.sort(compareTime);

    // Clear the existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append the sorted rows
    for (const row of rowsArray) {
        tbody.appendChild(row);
    }
}

// Helper function to compare the time values in ascending or descending order
function compareTime(a, b) {
    const timeAElement = a.getElementsByTagName('td')[2];
    const timeBElement = b.getElementsByTagName('td')[2];

    // Check if the td elements exist
    if (timeAElement && timeBElement) {
        const timeA = timeAElement.textContent.trim();
        const timeB = timeBElement.textContent.trim();

        if (sortOrder === 'asc') {
            return timeA.localeCompare(timeB);
        } else {
            return timeB.localeCompare(timeA);
        }
    }

    return 0;
}

// Function to check if the initial table is already populated
function isTablePopulated() {
    const rows = table.getElementsByTagName('tr');
    return rows.length > 1; // Assuming the first row is the header row
}

// Check if the initial table is already populated
if (isTablePopulated()) {
    const rows = table.getElementsByTagName('tr');

    // Skip the header row and start from the second row
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');

        // Retrieve the initial values from the row
        const initialValue = cells[0].textContent.trim();
        const initialMode = cells[1].textContent.trim();
        const initialTime = cells[2].textContent.trim();
        const initialUser = cells[3].textContent.trim();

        // Search for the row with the current user in the dynamic table
        const dynamicRows = tbody.getElementsByTagName('tr');
        let userRow = null;
        for (let j = 0; j < dynamicRows.length; j++) {
            const userCell = dynamicRows[j].getElementsByTagName('td')[3];
            if (userCell && userCell.textContent.trim() === initialUser) {
                userRow = dynamicRows[j];
                break;
            }
        }

        if (userRow !== null) {
            updateRow(initialValue, initialMode, initialTime, initialUser, userRow);
        } else {
            // Create a new row for the current values in the dynamic table
            const newRow = createRow(initialValue, initialMode, initialTime, initialUser);

            tbody.appendChild(newRow);
            sortRows();
        }
    }
}

// Append the new table to the document body
boxContentDiv.insertBefore(currentValueTable, boxContentDiv.firstChild);
currentValueTable.appendChild(tbody);

// Create a new MutationObserver instance
const observer = new MutationObserver(function () {
    let userCell;
    let userChecksCell;
    let timeCell;
    let modeCell;
    let valueCell;
// Retrieve the current values
    const currentPrice = getPrice();
    const currentMode = getMode();
    const currentTime = getTime();
    const currentUser = getUser();

    // Compare the current value with the initial value
    if (currentPrice !== initialValue) {

        // Search for the row with the current user
        const rows = tbody.getElementsByTagName('tr');
        let userRow = null;
        for (let i = 0; i < rows.length; i++) {
            userCell = rows[i].getElementsByTagName('td')[3];
            if (userCell && userCell.textContent.trim() === currentUser) {
                userRow = rows[i];
                break;
            }
        }

        if (userRow !== null) {
            // Update the existing row with the current values
            valueCell = userRow.getElementsByTagName('td')[0];
            modeCell = userRow.getElementsByTagName('td')[1];
            timeCell = userRow.getElementsByTagName('td')[2];
            userChecksCell = userRow.getElementsByTagName('td')[4];

            valueCell.textContent = currentPrice;
            modeCell.textContent = currentMode;
            timeCell.textContent = currentTime;

            let userChecks = parseInt(userChecksCell.textContent);
            if (!isNaN(userChecks)) {
                userChecks++;
            } else {
                userChecks = 1;
            }
            userChecksCell.textContent = String(userChecks);
            sortRows();
        } else {
            // Create a new row for the current values
            const newRow = document.createElement('tr');
            valueCell = document.createElement('td');
            modeCell = document.createElement('td');
            timeCell = document.createElement('td');
            userCell = document.createElement('td');
            userChecksCell = document.createElement('td');

            updateCellValue(valueCell, currentPrice);
            updateCellValue(modeCell, currentMode);
            updateCellValue(timeCell, currentTime);
            updateCellValue(userCell, currentUser);
            updateCellValue(userChecksCell, "1");

            newRow.appendChild(valueCell);
            newRow.appendChild(modeCell);
            newRow.appendChild(timeCell);
            newRow.appendChild(userCell);
            newRow.appendChild(userChecksCell);

            tbody.appendChild(newRow);
            sortRows();
        }

        // Update the initial values
        initialValue = currentPrice;
    } else {
        // The value has not changed.
    }
});

// Start observing changes in the table
observer.observe(table, {childList: true, subtree: true});

// Function to retrieve the first cell value of the second row
function getPrice() {
    return getCellValue(1, 0);
}

// Function to retrieve the second cell value of the second row
function getMode() {
    return getCellValue(1, 1);
}

// Function to retrieve the third cell value of the second row
function getTime() {
    return getCellValue(1, 2);
}

// Function to retrieve the fourth cell value of the second row
function getUser() {
    return getCellValue(1, 3);
}

// Helper function to create a new table cell
function createTableCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

// Function to create a new row with the current values
function createRow(currentPrice, currentMode, currentTime, currentUser) {
    const newRow = document.createElement('tr');
    newRow.appendChild(createTableCell(currentPrice));
    newRow.appendChild(createTableCell(currentMode));
    newRow.appendChild(createTableCell(currentTime));
    newRow.appendChild(createTableCell(currentUser));
    newRow.appendChild(createTableCell('1'));
    return newRow;
}

// Function to retrieve the cell value of a specific row and column index
function getCellValue(rowIndex, columnIndex) {
    const row = table.getElementsByTagName('tr')[rowIndex];

    // Check if the row exists and has the specified column index
    if (row && row.cells.length > columnIndex) {
        return row.cells[columnIndex].textContent.trim();
    }

    return null;
}

function updateCellValue(cell, value) {
    cell.textContent = value;
}