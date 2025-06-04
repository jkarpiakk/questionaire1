// ... (wcześniejsza część skryptu bez zmian)

const vasManualInput = document.getElementById('vasManual');

// Aktualizacja przy zmianie suwaka
vasInput.addEventListener('input', function() {
  vasValueSpan.textContent = vasInput.value;
  vasManualInput.value = vasInput.value;
});

// Aktualizacja przy wpisaniu liczby ręcznie
vasManualInput.addEventListener('input', function() {
  let val = Number(vasManualInput.value);
  if (isNaN(val) || val < 0) val = 0;
  if (val > 100) val = 100;
  vasManualInput.value = val;
  vasInput.value = val;
  vasValueSpan.textContent = val;
});

// ... (reszta skryptu bez zmian)
