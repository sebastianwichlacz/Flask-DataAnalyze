// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.country-btn');
    const selectedCountriesInput = document.getElementById('selected_countries');
    const maxSelection = 2; // Limit the number of selected countries

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle the 'selected' class
            button.classList.toggle('selected');

            // Update the hidden input field with selected countries
            const selectedButtons = document.querySelectorAll('.country-btn.selected');
            if (selectedButtons.length > maxSelection) {
                button.classList.remove('selected');
                alert(`You can select up to ${maxSelection} countries.`);
                return;
            }

            const selectedCountries = Array.from(selectedButtons).map(btn => btn.dataset.country);
            selectedCountriesInput.value = selectedCountries.join(',');
        });
    });
});
