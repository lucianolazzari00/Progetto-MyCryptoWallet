# ProgettoRCLTW
Web App | MyCryptoWallet

progetto realizzato per i corsi di Linguaggi e Tecnologie per il web e Reti di calcolatori, approfondendo la parte di frontend per il corso di LTW e backend per RC.

il frontend è realizzato in HTML,CSS,JS e VUEJS, ed è contenuto nella cartella static.
Per il backend è stata realizzata una infrastruttura conteinerizzata orchestrata con docker-compose, in particolare abbiamo 4 container:
-Nginx (fornisce i contenuti statici del frontend e agisce da reverse proxy nei confronti delle istanze node)
-Node (istanza di nodejs che fornisce servizi RESTful)
-MongoDB (database in cui sono salvati i dati di autenticazione degli utenti e le sessioni)
-CouchDB (db in cui sono salvati i dati degli utenti)

per avviare l'applicazione:

0) posizionarsi nella cartella /backend/.docker
1) buildare le immagini docker con il comando: $docker-compose build
2) avviare i container docker con: $docker-compose up
3) connettersi all'indirizzo: localhost:8080

per chiudere l'applicazione:
$docker-compose down
