document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById("tableBody");
    const sortButton = document.getElementById("sortButton");
    const pageButtonsContainer = document.getElementById("pageButtonsContainer");

    let currentPage = 1;
    let posts = [];
    const postsPerPage = 10;

    // Запрос на все посты с сервера
    async function fetchPosts() {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
        const data = await response.json();
        posts = data;
        renderPosts();
        renderPageButtons();
    }

    // Запрос на сервер с id поста для отображения деталей
    async function fetchPostsDetails(postId) {
        const existingDetails = document.querySelector(".details");
        if (existingDetails) {
            existingDetails.remove();
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const data = await response.json();
        const details = document.createElement("div");
        details.classList.add("details");

        const header = document.createElement("h2");
        header.textContent = 'Детали поста:'
        details.appendChild(header);

        const userIdRow = document.createElement("p");
        const userIdRowStrong = document.createElement("strong");
        userIdRowStrong.textContent = 'ID Пользователя: ';
        userIdRow.appendChild(userIdRowStrong);
        userIdRow.appendChild(document.createTextNode(`${data.userId}`))
        details.appendChild(userIdRow);

        const IdRow = document.createElement("p");
        const IdRowStrong = document.createElement("strong");
        IdRowStrong.textContent = 'ID: ';
        IdRow.appendChild(IdRowStrong);
        IdRow.appendChild(document.createTextNode(`${data.id}`))
        details.appendChild(IdRow);

        const titleRow = document.createElement("p");
        const titleRowStrong = document.createElement("strong");
        titleRowStrong.textContent = 'title: ';
        titleRow.appendChild(titleRowStrong);
        titleRow.appendChild(document.createTextNode(`${data.title}`))
        details.appendChild(titleRow);

        const bodyRow = document.createElement("p");
        const bodyRowStrong = document.createElement("strong");
        bodyRowStrong.textContent = 'body: ';
        bodyRow.appendChild(bodyRowStrong);
        bodyRow.appendChild(document.createTextNode(`${data.body}`))
        details.appendChild(bodyRow);

        document.body.appendChild(details);
    }

    // рендер постов с присваиванием слушателей для title
    function renderPosts() {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const currentPagePosts = posts.slice(startIndex, endIndex);

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        currentPagePosts.forEach(post => {
            const row = document.createElement("tr");

            const userIdCell = document.createElement("td");
            userIdCell.textContent = post.userId;
            row.appendChild(userIdCell);

            const idCell = document.createElement("td");
            idCell.textContent = post.id;
            row.appendChild(idCell)

            const titleCell = document.createElement("td");
            titleCell.textContent = post.title;
            titleCell.classList.add("postTitle");
            titleCell.addEventListener("click", () => {
                const postId = titleCell.parentElement.querySelector("td:nth-child(2)").textContent;
                fetchPostsDetails(postId);
            });
            row.appendChild(titleCell);

            tableBody.appendChild(row);
        })
    }

    // рендер кнопок страниц для пагинации
    function renderPageButtons() {
        while (pageButtonsContainer.firstChild) {
            pageButtonsContainer.removeChild(pageButtonsContainer.firstChild)
        }

        const totalpages = Math.ceil(posts.length / postsPerPage);
        for (let i = 1; i <= totalpages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                renderPosts();
            })
            pageButtonsContainer.appendChild(button);
        }
    }

    // Сортировка по userId, хотя там и так всё отсортировано
    sortButton.addEventListener("click", () => {
        posts.sort((a, b) => a.userId - b.userId);
        renderPosts();
    });

    fetchPosts();
});