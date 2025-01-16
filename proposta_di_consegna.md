# Proposta di Consegna

## Descrizione
In questo progetto abbiamo sviluppato un'applicazione web per la gestione e la visualizzazione di giochi. Gli utenti possono esplorare una lista di giochi, visualizzare i dettagli di ciascun gioco e registrarsi per un account.

## API
Ho utilizzato l'API di [RAWG](https://rawg.io/) per recuperare informazioni sui giochi.
Supabase (https://supabase.com/) per la gestione dei dati.

## Stile
Ho utilizzato Tailwind CSS per lo styling, creando un design responsive e moderno.

## Pagine
- **Pagina 1** - Pagina dettaglio di un gioco
- **Pagina 2** - Home page con lista prodotti
- **Pagina 3** - Pagina di login
- **Pagina 4** - Pagina di Profilo
- **Pagina 5** - Pagina di registrazione
- **Pagina 6** - Pagina di creazione di una lista di giochi

## User Interactions
- Utente non autenticato può scrollare sui giochi in piattaforma
- Utente non autenticato può filtrare per nome del gioco
- Utente non autenticato può registrarsi con email e password in piattaforma
- Utente non autenticato può accedere alla pagina di login
- Utente non autenticato può accedere alla pagina di registrazione
- Utente non autenticato può visionare il dettaglio di un gioco
- Utente autenticato può creare una lista di giochi favoriti
- Utente autenticato può modificare la propria lista di giochi favoriti
- Utente autenticato può modificare la propria password
- Utente autenticato può modificare la propria email
- Utente autenticato può mettere un gioco in lista di preferiti
- Utente autenticato può rimuovere un gioco dalla lista di preferiti
- Utente autenticato può lasciare un commento su un gioco
- Utente autenticato può visionare i propri commenti nella pagina profilo


## Context
Ho utilizzato React Context per gestire lo stato dell'applicazione, inclusi i dati sui giochi, le informazioni dell'utente e le preferenze di visualizzazione. Il contesto ci permette di condividere lo stato tra i vari componenti senza dover passare le props manualmente.