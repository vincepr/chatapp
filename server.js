
// example from: https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/nodejs-socketio-chat/

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require ("socket.io")(server)
var port = process.env.PORT || 8080


server.listen(port, function () {
console.log('hosting on Port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    // Die variable "socket" repräsentiert die aktuelle Web Sockets
    // Verbindung zu jeweiligen Browser client.
      
    // Kennzeichen, ob der Benutzer sich angemeldet hat 
    var addedUser = false;
    
    // Funktion, die darauf reagiert, wenn sich der Benutzer anmeldet
    socket.on('add user', function (username) {
    // Benutzername wird in der aktuellen Socket-Verbindung gespeichert
    socket.username = username;
    addedUser = true;
        
    // Dem Client wird die "login"-Nachricht geschickt, damit er weiß,
    // dass er erfolgreich angemeldet wurde.
    socket.emit('login');
        
    // Alle Clients informieren, dass ein neuer Benutzer da ist.
    socket.broadcast.emit('user joined', socket.username);
    });
    
    // Funktion, die darauf reagiert, wenn ein Benutzer eine Nachricht schickt
    socket.on('new message', function (data) {
        // Sende die Nachricht an alle Clients
        socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
        });
    });
    
    // Funktion, die darauf reagiert, wenn sich ein Benutzer abmeldet.
    // Benutzer müssen sich nicht explizit abmelden. "disconnect"
    // tritt auch auf wenn der Benutzer den Client einfach schließt.
    socket.on('disconnect', function () {
        if (addedUser) {
        // Alle über den Abgang des Benutzers informieren
        socket.broadcast.emit('user left', socket.username);
        }
    });
});