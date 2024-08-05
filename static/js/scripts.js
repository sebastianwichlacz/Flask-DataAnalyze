document.addEventListener('DOMContentLoaded', function() {
    const searchInput1 = document.getElementById('search1');
    const searchInput2 = document.getElementById('search2');
    const plotImage = document.getElementById('plot-image'); // Ensure you have an image element with this ID

    searchInput1.addEventListener('input', function() {
        fetchSuggestions(searchInput1.value, 'search1');
    });

    searchInput2.addEventListener('input', function() {
        fetchSuggestions(searchInput2.value, 'search2');
    });

    function fetchSuggestions(term, searchInputId) {
        if (term.length < 1) {
            hideSuggestions(searchInputId);
            return;
        }

        fetch(`/suggestions?term=${encodeURIComponent(term)}`)
            .then(response => response.json())
            .then(data => {
                const suggestionsDiv = document.getElementById(`suggestions${searchInputId === 'search1' ? 1 : 2}`);
                suggestionsDiv.innerHTML = '';
                if (data.length > 0) {
                    suggestionsDiv.style.display = 'block';
                    data.forEach(country => {
                        const div = document.createElement('div');
                        div.textContent = country;
                        div.classList.add('suggestion-item');
                        div.addEventListener('click', () => handleSuggestionClick(country, searchInputId));
                        suggestionsDiv.appendChild(div);
                    });
                } else {
                    suggestionsDiv.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }

    function handleSuggestionClick(country, searchInputId) {
        if (searchInputId === 'search1') {
            searchInput1.value = country;
        } else if (searchInputId === 'search2') {
            searchInput2.value = country;
        }
        hideSuggestions('search1');
        hideSuggestions('search2');
        generatePlotIfBothSelected();
    }

    function hideSuggestions(searchInputId) {
        const suggestionsDiv = document.getElementById(`suggestions${searchInputId === 'search1' ? 1 : 2}`);
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
    }

    function generatePlotIfBothSelected() {
        const country1 = searchInput1.value.trim();
        const country2 = searchInput2.value.trim();
        if (country1 && country2) {
            fetch(`/plot?country1=${encodeURIComponent(country1)}&country2=${encodeURIComponent(country2)}`)
                .then(response => response.json())
                .then(data => {
                     if (data.plot) {
                    const plotImage = document.getElementById('plot-image');
                    plotImage.src = `/static/${data.plot}`;
                    plotImage.style.display = 'block';
                    }
                })
                .catch(error => console.error('Error fetching plot:', error));
        }
    }
});