document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    const notification = document.getElementById('notification');
    const scanAmiiboButton = document.getElementById('scanAmiibo');
    const clearLocalDataButton = document.getElementById("clearLocalData");
    const toggleAmiiboButton = document.getElementById("toggleAmiibo");
    const amiiboText = document.getElementById("amiiboText");
    const toggleFriendRequestsButton = document.getElementById("toggleFriendRequests");

    let newVillagers = [];
    let bells = 0;
    let currVillager = {}
    let amiiboEnabled = true;
    let friendRequestsEnabled = true;

    // Initialize the app
    init();

    function init() {
        tabs.forEach(tab => tab.addEventListener('click', switchTab));
        loadStartTime();
        setInterval(checkForNewFriendRequest, 5000); // Check every minute
        scanAmiiboButton.addEventListener('click', scanAmiibo);
        tempFriends = localStorage.getItem('villagerFriends');
        tempBells = localStorage.getItem('bellBalance');
        if (tempFriends != null) {
            console.log(tempFriends)
            tempFriends = JSON.parse(localStorage.getItem('villagerFriends'));
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
        if (tempBells == null) {
            tempBells = bells
            localStorage.setItem('bellBalance', bells.toString())
        } else {
            bells = parseInt(localStorage.getItem('bellBalance'));
        }
        if (localStorage.getItem("amiiboToggle") == null) {
            localStorage.setItem("amiiboToggle", amiiboEnabled);
        } else {
            amiiboEnabled = localStorage.getItem("amiiboToggle");
        }
        if (localStorage.getItem("frenToggle") == null) {
            localStorage.setItem("frenToggle", friendRequestsEnabled);
        } else {
            friendRequestsEnabled = localStorage.getItem("frenToggle");
        }
        
    }

    function switchTab(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);

        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    }

    function loadStartTime() {
        let startTime = localStorage.getItem('nooktactsStartTime');
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem('nooktactsStartTime', startTime);
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function checkForNewFriendRequest() {
        if (friendRequestsEnabled == true) {
            const elapsedTime = Date.now() - localStorage.getItem('nooktactsStartTime');
            if (elapsedTime > 5000) { // more than 1 minute has passed
                showNotification('You have a new friend request!');
                villager = {};
                tempVillagers = localStorage.getItem('availableVillagers');
                if (tempVillagers == null) {
                    newVillagers = villagers;
                    ranNum = getRandomInt(newVillagers.length);
                    villager = newVillagers[ranNum];
                    addFriendRequest(villager);
                    newVillagers.splice(ranNum, 1);
                    tempVillagers = newVillagers
                } else {
                    tempVillagers = JSON.parse(localStorage.getItem('availableVillagers'));
                    console.log(tempVillagers)
                    newVillagers = tempVillagers
                    ranNum = getRandomInt(newVillagers.length);
                    villager = newVillagers[ranNum];
                    addFriendRequest(villager);
                    newVillagers.splice(ranNum, 1);
                    tempVillagers = newVillagers
                }
                localStorage.setItem('availableVillagers', JSON.stringify(tempVillagers));
            }
        }
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    }

    function updateBellsCount() {
        document.getElementById('bellsCount').textContent = bells;
        localStorage.setItem('bellBalance', bells.toString())
    }

    function addFriendRequest(villagerReq) {
        const friendRequestsSection = document.getElementById('friendRequests');
        const villagerContainer = document.createElement('div');
        bells += getRandomInt(250); // Example amount of bells
        updateBellsCount();
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
            tempContacts = JSON.parse(localStorage.getItem('villagerFriends'));
            if (tempContacts) {
                tempContacts.push(villagerCon);
            } else {
                tempContacts = [];
                tempContacts.push(villagerCon);
            }
            localStorage.setItem('villagerFriends', JSON.stringify(tempContacts));
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
        localStorage.clear();
        showNotification("Local data cleared. Page will be refreshed shortly.");
        location.reload();

    });

    toggleAmiiboButton.addEventListener("click", () => {
        amiiboEnabled = !amiiboEnabled;
        showNotification(`Amiibo integration ${amiiboEnabled ? "enabled" : "disabled"}`);
        localStorage.setItem("amiiboToggle", amiiboEnabled);
    });

    toggleFriendRequestsButton.addEventListener("click", () => {
        friendRequestsEnabled = !friendRequestsEnabled;
        showNotification(`Friend requests ${friendRequestsEnabled ? "enabled" : "disabled"}`);
        localStorage.setItem("frenToggle", friendRequestsEnabled)
    });

    async function scanAmiibo() {
        if (!amiiboEnabled) {
            showNotification("Amiibo integration is disabled");
            return;
        } else {
            try {
                const ndef = new NDEFReader();
                amiiboText.textContent = "Scanning Amiibo...";
                await ndef.scan();
                ndef.onreading = event => {
                    navigator.vibrate(500)
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        if (record.recordType === "text") {
                            const villagerName = decoder.decode(record.data);
                            addVillagerContact(villagerName);
                            showNotification(`Amiibo scanned! Added ${villagerName} to your contacts.`);
                        }
                    amiiboText.textContent = (record + ", " + record.recordType);
                    }
                };
            } catch (error) {
                showNotification(`Error scanning Amiibo: ${error}`);
            }
        }
    }
});
