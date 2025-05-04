window.addEventListener('DOMContentLoaded', () => {
    fetch('https://zenquotes.io/api/random')
      .then(res => res.json())
      .then(data => {
        document.getElementById('quote').textContent = `"${data[0].q}"`;
        document.getElementById('author').textContent = `— ${data[0].a}`;
      })
      .catch(() => {
        document.getElementById('quote').textContent = "Couldn't load quote.";
      });
  });
  

  if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change the page color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        const lower = page.toLowerCase();
        if (lower.includes('home')) window.location.href = 'homepage.html';
        else if (lower.includes('stocks')) window.location.href = 'stocks.html';
        else if (lower.includes('dogs')) window.location.href = 'dogs.html';
      }
    };
  
    annyang.addCommands(commands);
  }
  