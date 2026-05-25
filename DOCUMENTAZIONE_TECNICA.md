# Documentazione Tecnica: Gestionale React-Axios

Questo documento fornisce una panoramica dettagliata dell'architettura del progetto, della struttura delle cartelle e del funzionamento dei singoli componenti. Il progetto è stato progettato seguendo i principi di modularità, riutilizzabilità e separazione delle responsabilità.

---

## 1. Architettura del Progetto
Il progetto segue una struttura a strati (Layered Architecture):

- **API Layer**: Gestione della comunicazione HTTP.
- **Service Layer**: Logica di interazione con i dati e simulazione della latenza.
- **Helper Layer**: Funzioni di utilità logica e formattazione.
- **Component Layer**: Interfaccia utente divisa in componenti comuni (generici) e specifici per entità (Utenti).
- **Type Layer**: Definizioni TypeScript per la sicurezza del codice.

---

## 2. Struttura delle Cartelle e File

### `/src/api/`
- **`apiClient.ts`**: Contiene l'istanza configurata di **Axios**. Definisce la `baseURL` (http://localhost:3000) e gli intercettori globali per la gestione centralizzata degli errori. È il punto unico di uscita per tutte le chiamate verso il server.

### `/src/services/`
- **`userService.ts`**: Contiene le chiamate asincrone specifiche per l'entità User (`getAll`, `getById`, `create`, `update`, `delete`). Utilizza l'helper di simulazione per aggiungere un ritardo artificiale, rendendo i loader visibili anche con un server locale velocissimo.

### `/src/helpers/`
- **`apiHelper.ts`**: Un modulo generico che fornisce la funzione `simulateRequest`. È fondamentale per testare gli stati di caricamento (loading) in fase di sviluppo.
- **`userHelper.ts`**: Contiene logica di business pura per gli utenti, come la formattazione del nome completo (`getFullName`), il filtraggio della lista e la logica di paginazione.

### `/src/types/`
- **`user.ts`**: Definisce le interfacce TypeScript (`User`, `UserCreateInput`, `ApiStatus`, `UserFilterType`). Garantisce che ogni dato manipolato nell'app rispetti la struttura prevista dal database.

---

## 3. Componenti Comuni (Generici e Riutilizzabili)
Questi componenti si trovano in `/src/components/common/` e sono stati progettati per essere indipendenti dal tipo di dato trattato (Generics).

1.  **`DataTable.tsx`**:
    - **Cosa fa**: Renderizza una tabella moderna e reattiva.
    - **Dettagli**: Riceve un array di dati di tipo `<T>` e una configurazione di colonne. Permette di definire come renderizzare ogni singola cella tramite una funzione `render` (es. per mostrare badge o icone). Supporta il click sulla riga e una colonna "Azioni" personalizzabile.
2.  **`FilterSelector.tsx`**:
    - **Cosa fa**: Barra di pulsanti per il filtraggio.
    - **Dettagli**: È generico. Accetta un array di opzioni `{label, value}` e gestisce lo stato del filtro attivo con uno stile moderno (Light Theme).
3.  **`Modal.tsx`**:
    - **Cosa fa**: Finestra di dialogo sovrapposta (Overlay).
    - **Dettagli**: Utilizzata per conferme critiche (come l'eliminazione). Include animazioni CSS (fade-in, slide-up) e supporta diversi tipi di pulsanti (es. `danger` per il rosso).
4.  **`StatusWrapper.tsx`**:
    - **Cosa fa**: Gestore degli stati dell'interfaccia.
    - **Dettagli**: Avvolge un contenuto e mostra automaticamente un Loader (spinner), un messaggio di errore o un messaggio di "lista vuota" in base allo stato della chiamata API.

---

## 4. Componenti Utente (Specifici)
Si trovano in `/src/components/users/` e orchestrano i componenti comuni per l'entità "Utente".

1.  **`UserList.tsx`**:
    - Il cuore dell'applicazione. Gestisce lo stato della lista, i filtri, la paginazione e la modale di eliminazione. Configura le colonne da passare alla `DataTable`.
2.  **`UserDetail.tsx`**:
    - Mostra il profilo completo di un singolo utente in una visualizzazione a card dopo aver cliccato su una riga della tabella.
3.  **`UserCreate.tsx`**:
    - Form per l'inserimento. Gestisce i limiti di caratteri (`maxLength`) e la pulizia dei dati prima dell'invio.
4.  **`UserEdit.tsx`**:
    - Simile alla creazione, ma esegue una `getById` per pre-popolare i campi e una chiamata `PATCH` per aggiornare l'utente esistente.

---

## 5. Styling e Tematizzazione
- **`App.css`**: Contiene tutte le variabili CSS (`:root`) per il **Light Theme**. Centralizza colori, ombre e spaziature. Le animazioni per le modali e i loader sono definite qui tramite `@keyframes`.
- **Responsive Design**: L'uso di Flexbox e Grid (specialmente nei form e nelle card) garantisce che l'app sia fruibile su diverse risoluzioni, con un contenitore massimo di 1400px per le tabelle larghe.
