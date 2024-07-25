const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0 //this will deny caching in browser
    }
    )
}

const map = L.map("map").setView([ 19.02953930237392, 73.016792740629 ], 16); //here we have passed 16 as zoom 

L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: "Taqi's Map"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([ latitude, longitude ]);
    if (markers[ id ]) {
        markers[ id ].setLatLng([ latitude, longitude ]);
    } else {
        markers[ id ] = L.marker([ latitude, longitude ]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    if (markers[ id ]) {
        map.removeLayer(marker[ id ]);
        delete markers[ id ];
    }
})