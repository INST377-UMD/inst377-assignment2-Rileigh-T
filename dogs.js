async function loadDogImages() {
    const carousel = document.getElementById("carousel");
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await res.json();
        const img = document.createElement("img");
        img.src = data.message;
        img.width = 1000;
        img.height = 500;
        img.style.display = "block";
        img.style.margin = "0 auto"; 
        carousel.appendChild(img);
      } catch (err) {
        console.error("failed", err);
      }
    }
    simpleslider.getSlider(); 
  }
  
  const breedMap = {};
  
  async function loadDogBreeds() {
    const res = await fetch("https://dogapi.dog/api/v2/breeds");
    const data = await res.json();
    const buttonsContainer = document.getElementById("breed-buttons");
  
    data.data.forEach(breed => {
      const name = breed.attributes.name;
      const id = breed.id;
  
      breedMap[name.toLowerCase()] = id; 
  
      const button = document.createElement("button");
      button.textContent = name;
      button.classList.add("button-89"); 
      button.setAttribute("data-id", id);
      button.addEventListener("click", () => showBreedInfo(id));
      buttonsContainer.appendChild(button);
    });
  }
  
  async function showBreedInfo(breedId) {
    const res = await fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`);
    const data = await res.json();
    const attributes = data.data.attributes;
  
    document.getElementById("breed-name").textContent = attributes.name;
    document.getElementById("breed-description").textContent = attributes.description;
    document.getElementById("life-span").textContent = `${attributes.life.min} - ${attributes.life.max}`;
    document.getElementById("breed-info").classList.remove("hidden");
  }
  
  function startAnnyang() {
    if (annyang) {
      const commands = {
        'hello': () => alert("Hello World"),
  
        'change the page color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
  
        'navigate to *page': (page) => {
          const pageName = page.toLowerCase();
          if (["homepage", "stocks", "dogs"].includes(pageName)) {
            window.location.href = `${pageName}.html`;
          }
        },
  
        'load dog breed *breed': (breed) => {
          const lowerName = breed.toLowerCase();
          const id = breedMap[lowerName];
          if (id) {
            showBreedInfo(id);
          }
        }
      };
  
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  loadDogImages();
  loadDogBreeds();
  startAnnyang();
  