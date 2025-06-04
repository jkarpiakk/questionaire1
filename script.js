// Skrypt obsługujący nawigację między ekranami, synchronizację suwaka VAS i generowanie pliku CSV
document.addEventListener('DOMContentLoaded', function() {
  // Elementy interfejsu
  const welcomeScreen = document.getElementById('welcomeScreen');
  const instructionScreen = document.getElementById('instructionScreen');
  const questionsScreen = document.getElementById('questionsScreen');
  const btnStart = document.getElementById('btnStart');
  const btnBegin = document.getElementById('btnBegin');
  const btnFinish = document.getElementById('btnFinish');
  const form = document.getElementById('surveyForm');
  const vasInput = document.getElementById('vas');
  const vasValueSpan = document.getElementById('vasValue');
  const vasManualInput = document.getElementById('vasManual');
  const firstNameInput = document.getElementById('firstName');

  // Zapobiegaj domyślnej akcji formularza (przeładowaniu strony przy wciśnięciu Enter)
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  // Synchronizacja: przy zmianie suwaka aktualizuj wartość wyświetlaną i pole numeryczne
  vasInput.addEventListener('input', function() {
    vasValueSpan.textContent = vasInput.value;
    vasManualInput.value = vasInput.value;
  });

  // Synchronizacja: przy wpisaniu liczby ręcznie ustaw suwak i wyświetlaną wartość
  vasManualInput.addEventListener('input', function() {
    let val = Number(vasManualInput.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 100) val = 100;
    vasManualInput.value = val;
    vasInput.value = val;
    vasValueSpan.textContent = val;
  });

  // Przejście z ekranu powitalnego do instrukcji
  btnStart.addEventListener('click', function() {
    welcomeScreen.classList.remove('active');
    instructionScreen.classList.add('active');
    window.scrollTo(0, 0);
  });

  // Przejście z ekranu instrukcji do pytań
  btnBegin.addEventListener('click', function() {
    instructionScreen.classList.remove('active');
    questionsScreen.classList.add('active');
    window.scrollTo(0, 0);
  });

  // Zakończenie kwestionariusza: wygenerowanie CSV, zapis i reset aplikacji
  btnFinish.addEventListener('click', function() {
    // Pobranie wartości z formularza
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const pesel = form.pesel.value.trim();

    // Pobranie odpowiedzi na 5 pytań (wartości zaznaczonych opcji radiowych)
    const answers = [];
    for (let i = 1; i <= 5; i++) {
      const checkedOption = form.querySelector('input[name="q' + i + '"]:checked');
      answers.push(checkedOption ? checkedOption.value : "");
    }

    // Wartość suwaka EQ VAS
    const vas = form.vas.value;

    // Przygotowanie zawartości CSV (z nagłówkiem)
    const quote = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const header = [
      "Imię",
      "Nazwisko",
      "PESEL",
      "Poruszanie się",
      "Samoobsługa",
      "Zwykłe czynności",
      "Ból/dyskomfort",
      "Niepokój/przygnębienie",
      "EQ VAS"
    ].map(quote).join(",");
    const dataRow = [firstName, lastName, pesel, ...answers, vas].map(quote).join(",");
    const csvContent = "\uFEFF" + header + "\r\n" + dataRow + "\r\n";

    // Utworzenie obiektu Blob i wywołanie pobierania pliku
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = (firstName && lastName) ? `${firstName}_${lastName}.csv` : "wyniki.csv";

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // Dla starszych przeglądarek IE/Edge
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // Dla nowoczesnych przeglądarek
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    // Reset formularza i powrót do ekranu powitalnego
    form.reset();
    vasValueSpan.textContent = vasInput.value;
    vasManualInput.value = "";
    questionsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    window.scrollTo(0, 0);
    firstNameInput.focus();
  });
});
