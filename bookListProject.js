let titleElem = document.getElementById("title")
let authorElem= document.getElementById("author")
let yearElem = document.getElementById("year")
let btnElem = document.getElementById("btn")
let tbodyElem = document.getElementById("book-list")

window.onload = async function () {
    console.log("page loaded");
    const response = await fetch(
        'http://localhost:3000/api/books'
    );

    const books = await response.json();

    books.forEach(book => {
        addListItem(
            book._id,
            book.title,
            book.author,
            book.year
        );
    });
};

let editMode = false;
let editId = null;

function addListItem(id,title,author,year) {

    let trValue = document.createElement("tr")
    let titleValue = document.createElement("td")
    let authorValue = document.createElement("td")
    let yearValue = document.createElement("td")

    let optionsTd = document.createElement("td")

    let btnEdit = document.createElement("button")
    let btnDelete = document.createElement("button")

    titleValue.textContent = title
    authorValue.textContent = author
    yearValue.textContent = year

    btnEdit.textContent = "Edit"
    btnDelete.textContent = "Delete"

    btnEdit.className = "btn btn-primary btn-sm mr-2"
    btnDelete.className = "btn btn-danger btn-sm"

    btnEdit.addEventListener("click", function () {

        titleElem.value = title;
        authorElem.value = author;
        yearElem.value = year;

        editMode = true;
        editId = id;

        btnElem.value = "Update Book";
    });

    btnDelete.addEventListener("click", async function () {

        await fetch(`http://localhost:3000/api/books/${id}`, {
            method: "DELETE"
        });

        trValue.remove();
    });

    trValue.append(titleValue)
    trValue.append(authorValue)
    trValue.append(yearValue)
    trValue.append(optionsTd)

    optionsTd.append(btnEdit)
    optionsTd.append(btnDelete)

    tbodyElem.append(trValue)
}

async function addBook(event) {

    event.preventDefault();

    const title = titleElem.value;
    const author = authorElem.value;
    const year = yearElem.value;

    if (editMode) {

        const response = await fetch(
            `http://localhost:3000/api/books/${editId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    author,
                    year
                })
            }
        );

        const updatedBook = await response.json();

        // reload ساده (حرفه‌ای‌تر بعداً بهترش می‌کنیم)
        location.reload();

        editMode = false;
        editId = null;
        return;
    }

    const response = await fetch(
        'http://localhost:3000/api/new-book',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author,
                year
            })
        }
    );

    const book = await response.json();

    addListItem(
        book._id,
        book.title,
        book.author,
        book.year
    );

    titleElem.value = '';
    authorElem.value = '';
    yearElem.value = '';
}



btnElem.addEventListener("click",addBook)
