const API_KEY = 'S0ZUu97DSRU3dHJWpfiZvU5KmJ3ciIs3';

const form = document.getElementById("stockForm");
const input = document.getElementById("tickerInput");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const ticker = input.value.trim();
});

let myChart;
document.getElementById('lookupBtn').addEventListener('click', () => {
  const ticker = document.getElementById('tickerInput').value.toUpperCase();
  const days = parseInt(document.getElementById('dayRange').value);
  if (ticker && days) {
    fetchChart(ticker, days);
  }
});

const convertEpoch = (epoch) => {
  return new Date(epoch).toLocaleDateString();
};

async function fetchChart(ticker, days) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No data found. Please check the stock ticker to make sure you did correct input.");
      return;
    }

    const labels = data.results.map(d => convertEpoch(d.t));
    const closes = data.results.map(d => d.c);

    const ctx = document.getElementById('stockChart').getContext('2d');
    
    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Price`,
          data: closes,
          borderColor: 'purple',
          borderWidth: 3,
          fill: false,
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white' 
            }
          },
          title: {
            display: true,
            text: 'Stock Price',
            color: 'white' 
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white' 
            },
            grid: {
              color: 'white' 
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: 'white' 
            },
            grid: {
              color: 'white' 
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("API error:", error);
  }
}

async function fetchRedditStocks() {
    try {
      const res = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
      const data = await res.json();
      const top5 = data.slice(0, 5);  
      const tbody = document.querySelector("#redditTable tbody");
      tbody.innerHTML = "";  
  
      top5.forEach(stock => {
        const tr = document.createElement("tr");
  
        const bullishImageUrl = 'https://assets.entrepreneur.com/content/3x2/2000/1695054063-crypto-bull-run-s-2316418929.jpg?format=pjeg&auto=webp&crop=1:1';  
        const bearishImageUrl = 'https://investmentu.com/wp-content/uploads/2022/03/bearish-stocks.jpg';  
  
        const sentimentImage = stock.sentiment === "Bullish" 
          ? `<img src="${bullishImageUrl}" alt="Bullish" style="width: 160px; height: 150px;" />` 
          : `<img src="${bearishImageUrl}" alt="Bearish" style="width: 160px; height: 150px;" />`;
  
        const link = `https://finance.yahoo.com/quote/${stock.ticker}`; 
  
        tr.innerHTML = `
          <td><a href="${link}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td>${sentimentImage} (${stock.sentiment})</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("API error:", error);
    }
  }
  
  fetchRedditStocks();
  

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
      'lookup *ticker': (ticker) => {
        document.getElementById('tickerInput').value = ticker.toUpperCase();
        fetchChart(ticker.toUpperCase(), 30);
      }
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

startAnnyang();
