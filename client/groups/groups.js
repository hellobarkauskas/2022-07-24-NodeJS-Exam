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
        group.classList.add('client');
        groupsList.append(group);
        const showId = document.createElement('p');
        const groupName = document.createElement('a');

        showId.innerHTML = myGroup.group_id;
        groupName.innerHTML = myGroup.group_name;
        groupName.value = myGroup.group_id;
        
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