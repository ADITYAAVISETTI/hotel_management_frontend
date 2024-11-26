document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('auth-token');

  if (!authToken) {
    window.location.href = "../index.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const areaSelect = document.getElementById('area');
  const locationSelect = document.getElementById('Location');
  const hotelSelect = document.getElementById('hotel_name');
  const roomSelect = document.getElementById('room_name');

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
    const selectedLocation = locationSelect.value;
    fetchRoomsByHotelAndLocation(selectedLocation, selectedHotel);
  });

  roomSelect.addEventListener('change', () => {
    const selectedRoom = roomSelect.value;
    const selectedHotel = hotelSelect.value;
    const selectedLocation = locationSelect.value;
    getPriceForSelectedRoom(selectedLocation,selectedHotel, selectedRoom);
    console.log(`Selected Room: ${selectedRoom}`);
  });
});


const displayBookingForm = () => {
  const hotelForm = document.getElementById('create');
  const hotelTable = document.getElementById('bookList');

  hotelForm.style.display = 'block';
  hotelTable.style.display = 'none';
}

const displayListRooms = () => {
  const hotelForm = document.getElementById('create');
  const hotelTable = document.getElementById('bookList');

  hotelForm.style.display = 'none';
  hotelTable.style.display = 'block';
}


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
  const locationSelect = document.getElementById('Location');
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

async function fetchRoomsByHotelAndLocation(location, hotelName) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/rooms/${location}/${hotelName}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      populateRoomDropdown(data);
    } else {
      console.error('Error: Invalid room data received from the API.');
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
  }
}

function populateRoomDropdown(rooms) {
  const roomSelect = document.getElementById('room_name');
  roomSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Select Room';
  roomSelect.add(defaultOption);

  rooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room.roomType;
    option.text = `${room.roomType}`;
    roomSelect.add(option);
  });
}

// async function fetchPrice(location, hotelName, room) {
//   try {
//     const response = await fetch(`http://127.0.0.1:3000/rooms/${location}/${hotelName}/${room}`);
//     const data = await response.text();

//     if (data) {
//       return data; 
//     } else {
//       console.error('Error: Invalid data received from the API.');
//       return null; 
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return null;
//   }
// }

async function fetchPrice(location, hotelName, roomType) {
  console.log('Fetching price for:', location, hotelName, roomType);

  try {
      const response = await fetch(`http://127.0.0.1:3000/rooms/${location}/${hotelName}/${roomType}`);

      if (!response.ok) {
          throw new Error(`Error fetching room price: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched Price:', data.price);
      // return data.price;
      return data;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}



async function getPriceForSelectedRoom(location, hotelName, room) {
  const priceDiv = document.getElementById('Price');

  const roomPrice = await fetchPrice(location, hotelName, room);
  console.log("roommmm",roomPrice);

  if (roomPrice !== null) {
    priceDiv.textContent = `${roomPrice}`;
  } else {
    console.error('Error fetching room price.');
    priceDiv.textContent = 'Price: N/A';
  }
}

// async function displayBookingList() {
//   const dataTable = document.getElementById('booking-list');
//   dataTable.innerHTML = '';

//   const name = localStorage.getItem('username');
//   console.log(name);

//   try {
//     const response = await fetch(`http://127.0.0.1:3000/bookings/${name}`);
//     const data = await response.json(); // Parse the response as JSON

//     if (Array.isArray(data) && data.length > 0) {
//       data.forEach(booking => {
//         const row = dataTable.insertRow();
//         row.innerHTML = `<tr>
//           <td>${booking.hotelName}</td>
//           <td>${booking.roomType}</td>
//           <td>${booking.Price}</td>
//           <td>${booking.location}</td>
//           <td>${booking.area}</td>
//           <td class="functions" id="Actions">
//             <button class="delete" onclick="deleteBooking('${booking._id}');">Cancel</button>
//           </td>
//         </tr>`;
//         console.log("aaaa",booking._id)
//       });
//     } else {
//       console.log("No bookings found");
//     }
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// }

// Ensure the `deleteBooking` function is globally accessible
// async function deleteBooking(bookingId) {
//   try {
//     // Send DELETE request to the server
//     const response = await fetch(`http://127.0.0.1:3000/bookings/${bookingId}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       console.log("Booking deleted successfully");
//       // Remove the row corresponding to the booking
//       const row = document.querySelector(`button[data-id="${bookingId}"]`).closest('tr');
//       if (row) {
//         row.remove();
//       }
//     } else {
//       console.error("Failed to delete booking");
//     }
//   } catch (error) {
//     console.error("Error deleting booking:", error);
//   }
// }

async function displayBookingList() {
  const dataTable = document.getElementById('booking-list');
  dataTable.innerHTML = '';

  const name = localStorage.getItem('username');
  console.log("User:", name);

  try {
    const response = await fetch(`http://127.0.0.1:3000/bookings/${name}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(booking => {
        const row = dataTable.insertRow();
        row.innerHTML = `
          <td>${booking.hotelName}</td>
          <td>${booking.roomType}</td>
          <td>${booking.Price}</td>
          <td>${booking.location}</td>
          <td>${booking.area}</td>
          <td class="functions" id="Actions">
            <button class="delete" data-id="${booking._id}">Cancel</button>
          </td>
        `;

        // Attach event listener for the delete button
        const deleteButton = row.querySelector('.delete');
        deleteButton.addEventListener('click', () => deleteBooking(booking._id));
      });
    } else {
      console.log("No bookings found");
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Call the function to display bookings on page load
displayBookingList();


async function deleteBooking(BookingId) {
    
  const confirmation = window.confirm('Are you sure you want to delete this ');

  if (confirmation) {
      try {
          const response = await fetch(`http://127.0.0.1:3000/bookings/${BookingId}`, {
              method: 'DELETE',
          });

          if (response.status === 200) {
            displayBookingList();
          } else {
              console.error('Failed to delete booking');
          }
      } catch (error) {
          console.error(error);
      }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('create-form');
  createForm.addEventListener('submit', handleBookingCreation);
});

async function handleBookingCreation(event) {
  event.preventDefault();

  const name = localStorage.getItem('username');
  console.log(name);

  const areaSelect = document.getElementById('area');
  const locationSelect = document.getElementById('Location');
  const hotelSelect = document.getElementById('hotel_name');
  const roomSelect = document.getElementById('room_name');
  

  const selectedArea = areaSelect.value;
  const selectedLocation = locationSelect.value;
  const selectedHotel = hotelSelect.value;
  const selectedRoom = roomSelect.value;
  const priceDiv = document.getElementById('Price').textContent;

  console.log(selectedArea, selectedLocation,selectedHotel, selectedRoom, priceDiv);

  try {
    const response = await fetch('http://127.0.0.1:3000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name,
        area: selectedArea,
        location: selectedLocation,
        hotelName: selectedHotel,
        roomType: selectedRoom,
        Price: priceDiv,
      }),
    });

    const data = await response.json();
    displayBookingList();
  } catch (error) {
    console.error('Error creating booking:', error);
  }
}

displayBookingList();
