document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('auth-token');
  
    if (!authToken) {
      window.location.href = "../index.html";
    }
});

const bookingForm = document.getElementById('booking-form');
const tableBody = document.getElementById('table-body');
let editingId = null;

const displayHotelForm = () => {
    const hotelForm = document.getElementById('form-container');
    const hotelTable = document.getElementById('bookings-list');

    hotelForm.style.display ='block';
    hotelTable.style.display = 'none'; 
}

const displayListHotels = () => {
    const hotelForm = document.getElementById('form-container');
    const hotelTable = document.getElementById('bookings-list');

    hotelForm.style.display ='none';
    hotelTable.style.display = 'block'; 
}

// Function to fetch and display bookings as a table
async function fetchBookings() {
    try {
        const response = await fetch('http://127.0.0.1:3000/hotel');
        if (response.status === 200) {
            const data = await response.json();

            tableBody.innerHTML = ''; // Clear previous data

            data.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.Name_of_the_Hotel}</td>
                    <td>${booking.area}</td>
                    <td>${booking.Amenties}</td>
                    <td>${booking.Location}</td>
                    <td>
                        <button onclick="editBooking('${booking._id}')">Edit</button>
                        <button onclick="deleteBooking('${booking._id}')">Delete</button>
                    </td>
                `;
                row.dataset.id = booking._id; // Store booking ID in dataset
                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch bookings');
        }
    } catch (error) {
        console.error(error);
    }
}

// Initial fetch of bookings
fetchBookings();

// Function to handle form submission (Create and Update)
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const area = document.getElementById('area').value;
    const amenities = document.getElementById('amenities').value;
    const location = document.getElementById('location').value;

    try {
        const url = editingId ? `http://127.0.0.1:3000/hotel/${editingId}` : 'http://127.0.0.1:3000/hotel';
        const method = editingId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name_of_the_Hotel: name,
                area: area,
                Amenties: amenities,
                Location: location,
            }),
        });

        if (response.status === 201 || response.status === 200) {
            fetchBookings();
            displayListHotels();
            editingId = null;
            bookingForm.reset();
        } else {
            console.error('Failed to create/update booking');
        }
    } catch (error) {
        console.error(error);
    }
});

// Function to edit a booking
function editBooking(id) {
    displayHotelForm();
    editingId = id;
    const bookingToEdit = document.querySelector(`[data-id="${id}"]`);

    if (bookingToEdit) {
        document.getElementById('name').value = bookingToEdit.querySelector('td:nth-child(1)').textContent;
        document.getElementById('area').value = bookingToEdit.querySelector('td:nth-child(2)').textContent;
        document.getElementById('amenities').value = bookingToEdit.querySelector('td:nth-child(3)').textContent;
        document.getElementById('location').value = bookingToEdit.querySelector('td:nth-child(4)').textContent;
    }
}

async function deleteBooking(id) {
    
    const confirmation = window.confirm('Are you sure you want to delete this ');

    if (confirmation) {
        try {
            const response = await fetch(`http://127.0.0.1:3000/hotel/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                fetchBookings();
            } else {
                console.error('Failed to delete booking');
            }
        } catch (error) {
            console.error(error);
        }
    }
}
