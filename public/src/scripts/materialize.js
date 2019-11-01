document.addEventListener("DOMContentLoaded",()=>{
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    var elems = document.querySelectorAll('.autocomplete');
     M.Autocomplete.init(elems);

     var elems = document.querySelectorAll('select');
     M.FormSelect.init(elems);
});