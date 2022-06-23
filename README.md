# ProgettoRCLTW
Web App | MyCryptoWallet


# Scopo del Progetto
MyCryptoWallet è una web app che fornisce una serie di tools per il tracking degli investimenti degli utenti in criptovalute, con statistiche, grafici, e informazioni in tempo reale.
L'app ha 4 sezioni:
- DASHBOARD: la schermata principale con tutte le informazioni piu rilevanti (profitti, perdite, valore degli asset, variazioni del valore nel tempo...). L'utente può inserire/rimuovere le criptovalute che ha acquistato/venduto
- GAS TRACKER: permette di vedere in tempo reale il costo del gas sulla rete ethereum
- CALENDAR: permette ,attraverso l'integrazione con Google Calendar, di visualizzare i prossimi impegni che l'utente ha impostato sul calendario google.(Utile per gli utenti che vogliono investire periodicamente, e vogliono impostare dei promemoria)
- ROI CALCULATOR: permette di calcolare il ritorno che l'utente si aspetta dai suoi investimenti
# Architettura e tecnologie
![alt text](./DiagrammaMCW.png)
il diagramma riporta l'architettura e le tecnologie utilizzate.
Per motivi grafici non è stato riportato nel diagramma che i container parlano tra di loro sulla rete virtuale di docker "app-network" attraverso il protocollo http(non è necessario https visto che si tratta di una rete privata),l'unica eccezione è il sistema asincrono per l'invio delle mail che parla il protocollo amqp
# Requisiti
Le specifiche di progetto sono state rispettate:
1 - ciao
2 - ciao
3 - ciao
4 - ciao
5 - ciao
# Istruzioni per l'installazione
```
npm install
```
# Istruzioni per il test
```
npm test
```
# ApiDoc


