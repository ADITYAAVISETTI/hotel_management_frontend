document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('auth-token');

    if (!authToken) {
        window.location.href = "../index.html";
    }
});

const displayRoomForm = ()=>{
    const roomForm = document.getElementById('roomForm');
    const roomTable = document.getElementById('roomTable');

    roomForm.style.display ='block';
    roomTable.style.display = 'none'; 
}
const displayListRooms = ()=>{
    const roomForm = document.getElementById('roomForm');
    const roomTable = document.getElementById('roomTable');

    roomForm.style.display ='none';
    roomTable.style.display = 'block'; 
}

document.addEventListener('DOMContentLoaded', () => {
    const areaSelect = document.getElementById('city_name');
    const locationSelect = document.getElementById('location_name');
    const hotelSelect = document.getElementById('hotel_name');
  
    areaSelect.addEventListener('change', () => {
      const selectedArea = areaSelect.value;
      fetchLocationsByArea(selectedArea);
    });
  
    locationSelect.addEventListener('change', () => {
      const selectedLocation = locationSelect.value;
      const selectedArea = areaSelect.value;
      fetchHotelNames(selectedLocation, selectedArea);
    });
  
    hotelSelect.addEventListener('change', () => {
      const selectedHotel = hotelSelect.value;
    console.log(selectedHotel);
    });
  
});

async function fetchLocationsByArea(area) {
    try {
      const response = await fetch(`http://127.0.0.1:3000/hotel/search/${area}`);
      const data = await response.json();
      console.log(data);
  
      if (Array.isArray(data)) {
        const locations = data.map(hotel => hotel.Location);
        populateLocationDropdown(locations);
      } else {
        console.error('Error: Invalid location data received from the API.');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }
  
  function populateLocationDropdown(locations) {
    const locationSelect = document.getElementById('location_name');
    locationSelect.innerHTML = '';
  
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select Location';
    locationSelect.add(defaultOption);
  
    const uniqueLocations = [...new Set(locations)];
  
    uniqueLocations.forEach(locationName => {
      const option = document.createElement('option');
      option.value = locationName;
      option.text = locationName;
      locationSelect.add(option);
    });
  }

  async function fetchHotelNames(location, area) {
    try {
      const response = await fetch(`http://127.0.0.1:3000/hotel/search/${area}/${location}`);
      const data = await response.json();
  
      if (Array.isArray(data)) {
        const hotelNames = data.map(hotel => hotel.Name_of_the_Hotel);
        populateHotelDropdown(hotelNames);
      } else {
        console.error('Error: Invalid hotel data received from the API.');
      }
    } catch (error) {
      console.error('Error fetching hotel names:', error);
    }
  }
  
  function populateHotelDropdown(hotelNames) {
    const hotelSelect = document.getElementById('hotel_name');
    hotelSelect.innerHTML = '';
  
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select Hotel';
    hotelSelect.add(defaultOption);
  
    hotelNames.forEach(hotelName => {
      const option = document.createElement('option');
      option.value = hotelName;
      option.text = hotelName;
      hotelSelect.add(option);
    });
  }
function loadRoomData() {
    fetch('http://127.0.0.1:3000/rooms')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const roomData = document.getElementById('roomData');
            roomData.innerHTML = '';

            data.forEach(room => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.area}</td>
                    <td>${room.location}</td>
                    <td>${room.hotelName}</td>
                    <td>${room.roomType}</td>
                    <td>${room.capacity}</td>
                    <td>${room.bedConfiguration}</td>
                    <td>${room.price}</td>
                    <td>${room.discount || ''}</td>
                    <td>
                        <button class="edit-button" onclick="editRoomData('${room._id}')">Edit</button>
                        <button class="delete-button" onclick="deleteRoomData('${room._id}')">Delete</button>
                    </td>
                `;
                row.dataset.id = room._id; // Store booking ID in dataset
                roomData.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching room data:', error);
        });
}

window.addEventListener('load', loadRoomData);

document.getElementById('roomForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        area: document.getElementById('city_name').value,
        location: document.getElementById('location_name').value,
        hotelName: document.getElementById('hotel_name').value,
        roomType: document.getElementById('room_type').value,
        capacity: document.getElementById('capacity').value,
        bedConfiguration: document.getElementById('bed_type').value,
        price: document.getElementById('price').value,
        discount: document.getElementById('discount').value,
    };

    const roomIdElement = document.getElementById('roomId');
    const roomId = roomIdElement ? roomIdElement.value : null;

    try {
        if (roomId) {
            await updateRoomData(formData, roomId);
        } else {
            await addRoomData(formData);
        }

        // Reset the form
        this.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

async function editRoomData(roomId){
    displayRoomForm()
    const roomToEdit = document.querySelector(`[data-id="${roomId}"]`);

    if (roomToEdit) {
        await fetchLocationsByArea(roomToEdit.querySelector('td:nth-child(1)').textContent);
        await fetchHotelNames(roomToEdit.querySelector('td:nth-child(2)').textContent,roomToEdit.querySelector('td:nth-child(1)').textContent);

        document.getElementById('roomId').value = roomId;
        document.getElementById('city_name').value = roomToEdit.querySelector('td:nth-child(1)').textContent;
        document.getElementById('location_name').value = roomToEdit.querySelector('td:nth-child(2)').textContent;
        document.getElementById('hotel_name').value = roomToEdit.querySelector('td:nth-child(3)').textContent;
        document.getElementById('room_type').value = roomToEdit.querySelector('td:nth-child(4)').textContent;
        document.getElementById('capacity').value = roomToEdit.querySelector('td:nth-child(5)').textContent;
        document.getElementById('bed_type').value = roomToEdit.querySelector('td:nth-child(6)').textContent;
        document.getElementById('price').value = roomToEdit.querySelector('td:nth-child(7)').textContent;
        document.getElementById('discount').value = roomToEdit.querySelector('td:nth-child(8)').textContent;
    }
}

async function updateRoomData(updatedRoom, roomId) {
    if (!roomId) {
        console.error('Room ID is missing. Cannot update.');
        return;
    }

    const response = await fetch(`http://127.0.0.1:3000/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    loadRoomData();
    // Additional actions if needed
}

async function addRoomData(room) {
    const response = await fetch('http://127.0.0.1:3000/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    loadRoomData();
    // Additional actions if needed
}

function deleteRoomData(roomId) {
    let confirmDelete = window.confirm("Are you sure want to delete ?");
    if (confirmDelete) {
        fetch(`http://127.0.0.1:3000/rooms/${roomId}`, { method: 'DELETE' })
            .then(() => {
                loadRoomData();
            })
            .catch(error => {
                console.error("Error in deleting data:", error);
            });
    }
}

function populateForm(row) {
    const form = document.getElementById('roomForm');
    form.reset();

    for (const key in row.children) {
        if (row.children[key].hasAttribute('data-key')) {
            const field = row.children[key].getAttribute('data-key');
            form[field].value = row.children[key].textContent;
        }
    }

    document.getElementById('roomId').value = row.dataset.id;
}

loadRoomData();
