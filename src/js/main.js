const txtSearchElm = document.querySelector("#txt-search");
const tblCustomersElm = document.querySelector("#tbl-customers");
const API_BASE_URL = 'http://localhost:8080';

loadAllCustomers();

function loadAllCustomers(query){
    fetch(`${API_BASE_URL}/customers?page=1&size=50&q=${query ?? ''}`)
        .then(req => req.json())
        .then(customerList => {
            tblCustomersElm.querySelectorAll("tbody tr").forEach(tr=>tr.remove());
            customerList.forEach(c => addNewRow(c))
            });
}

function addNewRow(customer){
    const trElm = document.createElement("tr");
    tblCustomersElm.querySelector('tbody').append(trElm);
    trElm.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.firstName}</td>
        <td>${customer.lastName}</td>
        <td>${customer.contact}</td>
        <td>${customer.country}</td>
    `
}

txtSearchElm.addEventListener('input',()=>{
    loadAllCustomers(txtSearchElm.value.trim());
})
