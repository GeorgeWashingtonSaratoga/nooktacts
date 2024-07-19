document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    const notification = document.getElementById('notification');
    const scanAmiiboButton = document.getElementById('scanAmiibo');
    const clearLocalDataButton = document.getElementById("clearLocalData");
    const localStorageKey = 'nooktactsStartTime';
    const villagerFriends = 'villagerFriends';
    const availVillagers = 'availableVillagers';
    const balance = 'bellBalance';
    newVillagers = [];
    let bells = 0;
    let currVillager = {}

    // Initialize the app
    init();

    function init() {
        tabs.forEach(tab => tab.addEventListener('click', switchTab));
        loadStartTime();
        setInterval(checkForNewFriendRequest, 5000); // Check every minute
        tempFriends = localStorage.getItem(villagerFriends);
        if (tempFriends != null) {
            console.log(tempFriends)
            tempFriends = JSON.parse(localStorage.getItem(villagerFriends));
            for (var i = 0; i < tempFriends.length; i ++) {
                tempFren = tempFriends[i]
                const contactsSection = document.getElementById('contactsList');
                const villagerContainer = document.createElement('div');
                villagerContainer.innerHTML = `
                <img src="${tempFren.icon}" alt="${tempFren.name}">
                <p>${tempFren.name}</p>
                `;
                contactsSection.appendChild(villagerContainer);
                console.log(tempFren.name)
            }
        }
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
        if (elapsedTime > 5000) { // more than 1 minute has passed
            showNotification('You have a new friend request!');
            bells += getRandomInt(250); // Example amount of bells
            updateBellsCount();
            villager = {};
            tempVillagers = localStorage.getItem(availVillagers);
            if (tempVillagers == null) {
                newVillagers = villagers;
                ranNum = getRandomInt(newVillagers.length);
                villager = newVillagers[ranNum];
                addFriendRequest(villager);
                newVillagers.splice(ranNum, 1);
                tempVillagers = newVillagers
            } else {
                tempVillagers = JSON.parse(localStorage.getItem(availVillagers));
                console.log(tempVillagers)
                newVillagers = tempVillagers
                ranNum = getRandomInt(newVillagers.length);
                villager = newVillagers[ranNum];
                addFriendRequest(villager);
                newVillagers.splice(ranNum, 1);
                tempVillagers = newVillagers
            }
            localStorage.setItem(availVillagers, JSON.stringify(tempVillagers));
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
        if (villagerCon) {
            const contactsSection = document.getElementById('contactsList');
            const villagerContainer = document.createElement('div');
            villagerContainer.innerHTML = `
            <img src="${villagerCon.icon}" alt="${nameCon}">
            <p>${nameCon}</p>
            `;
            contactsSection.appendChild(villagerContainer);
            tempContacts = JSON.parse(localStorage.getItem(villagerFriends));
            if (tempContacts) {
                tempContacts.push(villagerCon);
            } else {
                tempContacts = [];
                tempContacts.push(villagerCon);
            }
            localStorage.setItem(villagerFriends, JSON.stringify(tempContacts));
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
    clearLocalDataButton.addEventListener("click", () => {
        console.log(localStorage.getItem(localStorageKey));
        console.log(localStorage.getItem(villagerFriends));
        console.log(localStorage.getItem(availVillagers));
        localStorage.clear();
        showNotification("Local data cleared. Please refresh your page.");
        console.log(localStorage.getItem(localStorageKey));
        console.log(localStorage.getItem(villagerFriends));
        console.log(localStorage.getItem(availVillagers));
    });
});
