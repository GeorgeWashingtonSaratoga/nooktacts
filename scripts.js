document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    const notification = document.getElementById('notification');
    const scanAmiiboButton = document.getElementById('scanAmiibo');
    const localStorageKey = 'nooktactsStartTime';
    const villagerFriends = 'villagerFriends';
    newVillagers = villagers;
    let bells = 0;
    let currVillager = {}

    // Initialize the app
    init();

    function init() {
        tabs.forEach(tab => tab.addEventListener('click', switchTab));
        loadStartTime();
        setInterval(checkForNewFriendRequest, 60000); // Check every minute
    }

    function switchTab(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);

        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    }

    function loadStartTime() {
        let startTime = localStorage.getItem(localStorageKey);
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem(localStorageKey, startTime);
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function checkForNewFriendRequest() {
        const elapsedTime = Date.now() - localStorage.getItem(localStorageKey);
        if (elapsedTime > 60000) { // more than 1 minute has passed
            showNotification('You have a new friend request!');
            bells += getRandomInt(250); // Example amount of bells
            updateBellsCount();
            villager = {};
            ranNum = getRandomInt(newVillagers.length);
            villager = newVillagers[ranNum];
            addFriendRequest(villager);
            newVillagers.splice(ranNum, 1);
        }
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    function updateBellsCount() {
        document.getElementById('bellsCount').textContent = bells;
    }

    function addFriendRequest(villagerReq) {
        const friendRequestsSection = document.getElementById('friendRequests');
        const villagerContainer = document.createElement('div');
        villagerContainer.id = villagerReq.name;
        currVillager = villagerReq;
        villagerContainer.innerHTML = `
            <img src="${villagerReq.icon}" alt="${villagerReq.name}">
            <p>${villagerReq.name}</p>
            <button onclick="acceptFriendRequest('${villagerReq.name}')">Accept</button>
        `;
        friendRequestsSection.appendChild(villagerContainer);
    }

    window.acceptFriendRequest = function(name) {
        addVillagerContact(name);
        const villagerRequest = document.getElementById(name);
        villagerRequest.remove();
    }

    function addVillagerContact(nameCon) {
        villagerCon = currVillager;
        console.log(nameCon)
        console.log(villagers)
        console.log(villagerCon)
        if (villagerCon) {
            const contactsSection = document.getElementById('contactsList');
            const villagerContainer = document.createElement('div');
            villagerContainer.innerHTML = `
            <img src="${villagerCon.icon}" alt="${nameCon}">
            <p>${nameCon}</p>
            `;
            contactsSection.appendChild(villagerContainer);
        } else {
            console.log("Find command did not work")
            const contactsSection = document.getElementById('contactsList');
            const villagerContainer = document.createElement('div');
            villagerContainer.innerHTML = `
            <img src="pfpNotFound.jpeg" alt="${nameCon}">
            <p>${nameCon}</p>
            `;
            contactsSection.appendChild(villagerContainer);
        }
        currVillager = {};
    }
});
