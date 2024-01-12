const txtSearchElm = document.querySelector("#txt-search");
const tblCustomersElm = document.querySelector("#tbl-customers");
const loaderElm = document.querySelector("#loader");
const API_BASE_URL = 'http://localhost:8080';

let abortController = null;

loadAllCustomers();



function loadAllCustomers(query){
    loaderElm.classList.remove('d-none')
    if(abortController){
        abortController.abort("Request aborted");
    }

    abortController = new AbortController();
    const signal = abortController.signal;
    fetch(`${API_BASE_URL}/customers?page=1&size=50&q=${query ?? ''}`,{signal})
        .then(req => req.json())
        .then(customerList => {
            abortController=null;
            tblCustomersElm.querySelectorAll("tbody tr").forEach(tr=>tr.remove());
            customerList.forEach(c => addNewRow(c))
            loaderElm.classList.add('d-none');
            if(!customerList.length){
                addNewRow(null);
            }
            });
}

function addNewRow(customer){
    const trElm = document.createElement("tr");
    tblCustomersElm.querySelector('tbody').append(trElm);
    if(customer){
        trElm.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.firstName}</td>
        <td>${customer.lastName}</td>
        <td>${customer.contact}</td>
        <td>${customer.country}</td>
    `
    } else {
        trElm.innerHTML=`
            <td colspan="5">
                We're sorry. We cannot find any matches for your search term.
            </td>
        `
    }

}

txtSearchElm.addEventListener('input',()=>{
    loadAllCustomers(txtSearchElm.value.trim());
});

tblCustomersElm.querySelectorAll('thead th').forEach(th=>{
    th.addEventListener('mouseenter',(e )=>{
       th.classList.add('col-hover');
       const colindex = Array.from(th.parentElement.children).indexOf(th);
       tblCustomersElm.querySelectorAll(`tbody tr td:nth-child(${colindex+1})`)
           .forEach(td => td.classList.add('col-hover'));
    });

    th.addEventListener('mouseleave',(e )=>{
        th.classList.remove('col-hover');
        const colindex = Array.from(th.parentElement.children).indexOf(th);
        tblCustomersElm.querySelectorAll(`tbody tr td:nth-child(${colindex+1})`)
            .forEach(td => td.classList.remove('col-hover'));
    });
});
