document.getElementById("search-button").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();

    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) {
            throw new Error("Country not found!");
        }

        const data = await response.json();
        const country = data[0];

        displayCountryInfo(country);
        fetchBorderingCountries(country.borders || []);
    } catch (error) {
        displayError(error.message);
    }
}

function displayCountryInfo(country) {
    const countryInfoSection = document.getElementById("country-info");
    

    countryInfoSection.innerHTML = "";

    // Create elements
    const article = document.createElement("article");
    const title = document.createElement("h2");
    const capital = document.createElement("p");
    const population = document.createElement("p");
    const region = document.createElement("p");
    const flag = document.createElement("p"); //incudee
    const flagImg = document.createElement("img");
   

    // Assign values
    title.textContent = country.name.common;
    capital.innerHTML = `<strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}`;
    population.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;
    region.innerHTML = `<strong>Region:</strong> ${country.region}`;
    flag.innerHTML = `<strong>Flag:</strong>`; //changed and added
    flagImg.src = country.flags.svg;
    flagImg.alt = `Flag of ${country.name.common}`;

    // Append elements
    article.appendChild(title);
    article.appendChild(capital);
    article.appendChild(population);
    article.appendChild(region);
    article.appendChild(flag); //need to append before flagImg
    article.appendChild(flagImg);
    

    countryInfoSection.appendChild(article);
}

async function fetchBorderingCountries(borders) {
    const bordersSection = document.getElementById("bordering-countries");
    

    bordersSection.innerHTML = "";
    
    if (borders.length === 0) {
        const noBordersText = document.createElement("p");
        noBordersText.textContent = "No bordering countries.";
        bordersSection.appendChild(noBordersText);
        return;
    }

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const allCountries = await response.json();

        const borderingCountries = allCountries.filter(country => borders.includes(country.cca3));

        const title = document.createElement("h3");
        title.textContent = "Bordering Countries:";
        bordersSection.appendChild(title);

        borderingCountries.forEach(border => {
            const article = document.createElement("article");
            const countryName = document.createElement("p");
            const flagImg = document.createElement("img");

            countryName.textContent = border.name.common;
            flagImg.src = border.flags.svg;
            flagImg.alt = `Flag of ${border.name.common}`;

            article.appendChild(countryName);
            article.appendChild(flagImg);
            bordersSection.appendChild(article);
        });

    } catch (error) {
        displayError("Error fetching bordering countries.");
    }
}

function displayError(message) {
    const countryInfoSection = document.getElementById("country-info");
    countryInfoSection.innerHTML = "";

    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = `Error: ${message}`;

    countryInfoSection.appendChild(errorMsg);

    // Clear bordering countries section on error
    document.getElementById("bordering-countries").innerHTML = "";
}
