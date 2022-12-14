
const form = document.querySelector('form')
const search = document.getElementById('search')
const main = document.querySelector('main')

// Get reqquest to Github Users API using Axios
const APIURL = 'https://api.github.com/users/'
async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)
        createUserCard(data)
        getRepos(username)
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard('User Not Found')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch (err) {
        createErrorCard('Problem fetching repos')
    }
}


// Creating a User Card in case of successful response
function createUserCard(user) {
    const cardHTML = `
    <div
            class="card flex flex-col items-center justify-center p-8 mx-6 my-6 bg-slate-700 rounded-2xl shadow-lg md:flex md:flex-row md:max-w-[800px]">
            <img src="${user.avatar_url}" alt=""
                class="avatar rounded-full border-4 border-blue-800 shadow-xl transition-colors duration-300 h-[150px] w-[150px] hover:shadow-blue-500 hover:border-hidden">
            <div class="userinfo md:ml-8">
                <h2 class="text-3xl font-bold my-2 underline decoration-sky-300 hover:decoration-wavy">${user['login']}</h2>
                <p class="text-gray-300">${user.bio}</p>

                <ul class="text-gray-400 flex justify-between p-0 mt-3">
                    <li class="flex items-center">${user['followers']}<strong class="text-sky-400 text-sm ml-2">Followers</strong></li>
                    <li class="flex items-center">${user['following']}<strong class="text-sky-400 text-sm ml-2">Following</strong></li>
                    <li class="flex items-center">${user['public_repos']}<strong class="text-sky-400 text-sm ml-2">Repos</strong></li>
                </ul>

                <div id="repos" class="mt-4"></div>
        </div>
    `
    main.innerHTML = cardHTML
}

// function to create custom error card in case of error
function createErrorCard(msg) {
    const errorHTML = `
        <div class='flex items-center justify-center p-8 mx-6 my-6 bg-slate-700 rounded-2xl shadow-lg md:flex md:flex-row md:max-w-[800px]'>
            <h1 class="font-bold text-2xl line-through">${msg}</h1>
        </div>
    `

    main.innerHTML = errorHTML
}


function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')
    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('text-slate-100', 'bg-blue-700', 'py-1', 'px-4', 'mr-2', 'mb-2', 'rounded-md', 'inline-block', 'hover:bg-blue-600')
            repoEl.href = repo.html_url;
            repoEl.target = '_blank';
            repoEl.innerText = repo.name;
            reposEl.appendChild(repoEl);
        })
}

// Handling Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value
    if (user) {
        getUser(user)
        search.value = ''
    }
})
