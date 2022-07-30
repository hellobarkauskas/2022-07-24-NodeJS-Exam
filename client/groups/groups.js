import { MAIN_URL } from '../config.js';

const groupsList = document.getElementById('my-groups');
const groupsSelect = document.getElementById('groups-option');

const fetchMyGroups = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${MAIN_URL}/accounts`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    const myGroups = await response.json();

    myGroups.forEach(myGroup => {
        const group = document.createElement('div');
        groupsList.append(group);
        const showId = document.createElement('a');
        showId.classList.add('for-bills');
        const groupName = document.createElement('p');

        showId.innerHTML = `ID: ${myGroup.group_id}`;
        groupName.innerHTML = `Group of ${myGroup.group_name}`;
        showId.value = myGroup.group_id;

        showId.addEventListener('click', () => {
            const groupId = showId.value;
            console.log(groupId);
        });
        
        group.append(
            showId,
            groupName
        );
    });
};

const fetchGroups = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${MAIN_URL}/groups`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    const groupsList = await response.json();

    groupsList.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        groupsSelect.append(option);
    });
};

const addGroupToList = async (groupId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${MAIN_URL}/accounts/${Number(groupId)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_id: Number(groupId) })
    });

    const data = await response.json();
};

document.getElementById('add-group-to-list').addEventListener('click', () => {
    const groupId = groupsSelect.value;
    addGroupToList(Number(groupId));
});

fetchMyGroups();
fetchGroups();