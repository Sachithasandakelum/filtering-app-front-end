const txtSearchElm = document.querySelector("#txt-search");
const tblCustomersElm = document.querySelector("#tbl-customers");
const loaderElm = document.querySelector("#loader");
const btnModeElm = document.querySelector("#btn-mode");
const API_BASE_URL = 'http://localhost:8080';

let abortController = null;
let sort = "id,asc";
let q = '';

loadAllCustomers();



function loadAllCustomers(query){
    q=query ?? q;
    loaderElm.classList.remove('d-none')
    if(abortController){
        abortController.abort("Request aborted");
    }

    abortController = new AbortController();
    const signal = abortController.signal;
    const queryString = `sort=${sort}&page=1&size=50&q=${q}`;
    fetch(`${API_BASE_URL}/customers?${queryString}`,{signal})
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

tblCustomersElm.querySelector('thead').addEventListener('click',(e)=>{
    if(e.target?.tagName === 'TH'){
        const thElm = e.target;
        const colName = (thElm.innerText.trim().toLowerCase().split(' ').join('_'));
        tblCustomersElm.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'))

        thElm.classList.add('sorted');
        if(thElm.classList.contains('order-down')){
            thElm.classList.remove('order-down');
            thElm.classList.add('order-up');
            sort = `${colName},desc`
        }else {
            thElm.classList.remove('order-up');
            thElm.classList.add('order-down');
            sort = `${colName},asc`
        }

        loadAllCustomers();
    }
});

btnModeElm.addEventListener('click',()=>{
   if(btnModeElm.classList.contains('bi-moon-fill')){
       btnModeElm.classList.remove('bi-moon-fill');
       btnModeElm.classList.add('bi-sun-fill');
       document.querySelector('html').setAttribute('data-bs-theme','light');
   }else {
       btnModeElm.classList.remove('bi-sun-fill');
       btnModeElm.classList.add('bi-moon-fill');
       document.querySelector('html').setAttribute('data-bs-theme','dark');
   }
});
