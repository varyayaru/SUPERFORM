const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

const form = document.querySelector('form')
const newLabel = document.createElement('label')
newLabel.setAttribute('for', 'age')
newLabel.innerText = 'Age'
const newInput = document.createElement('input')
newInput.id = 'age'
newInput.type = 'number'
newInput.className = 'age'
const addButton = document.querySelector('.add');
form.insertBefore(newInput, addButton);
form.insertBefore(newLabel, newInput)

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
        userCard.remove()
        delete storage[userEmail]
        localStorage.setItem('users', JSON.stringify(storage))
    })
    const changeEmail = changeBtn.dataset.changeUserEmail
    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )

        const newName = document.querySelector('#name')
        const newSecondName = document.querySelector('#secondName')
        const newEmail = document.querySelector('#email')
        const newAge = document.querySelector('#age')
        newName.value = storage[changeEmail].name
        newSecondName.value = storage[changeEmail].secondName
        newEmail.value = storage[changeEmail].email
        newAge.value = storage[changeEmail].age
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({
    name, secondName, email, age,
}) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p class="email">${email}</p>
                <p> ${age}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newAge = document.querySelector('#age')

    const users = document.querySelector('.users')
    console.log(typeof newAge.value)
    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
        || !newAge.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newAge)
        return
    }
    Object.keys(storage).forEach((email) => {
        if (newEmail.value === email) {
            delete storage[email]
            const deleteDiv = document.querySelector(`[data-user="${email}"]`)
            deleteDiv.remove()
        }
    })

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        age: newAge.value,
    }

    storage[newEmail.value] = data

    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    userCard.dataset.name = newName.value
    userCard.dataset.secondName = newSecondName.value
    userCard.dataset.age = newAge.value
    const userCardObject = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        age: newAge.value,
    }
    userCard.innerHTML = createCard(userCardObject)
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newAge)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
