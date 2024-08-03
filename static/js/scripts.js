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

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const suggestionsDiv = document.getElementById('suggestions');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value;

        if (searchTerm.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        fetch(`/suggestions?term=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                suggestionsDiv.innerHTML = '';
                if (data.length > 0) {
                    suggestionsDiv.style.display = 'block';
                    data.forEach(suggestion => {
                        const div = document.createElement('div');
                        div.textContent = suggestion;
                        div.classList.add('suggestion-item');
                        div.addEventListener('click', function () {
                            searchInput.value = suggestion;
                            suggestionsDiv.style.display = 'none';
                        });
                        suggestionsDiv.appendChild(div);
                    });
                } else {
                    suggestionsDiv.style.display = 'none';
                }
            });
    });

    document.addEventListener('click', function (event) {
        if (!suggestionsDiv.contains(event.target) && event.target !== searchInput) {
            suggestionsDiv.style.display = 'none';
        }
    });
});