var loading = document.getElementById('loading');
var screen = document.getElementById('screen');
var output = document.getElementById('output');
var cmdInput = document.getElementById('cmd');
var promptLine = document.getElementById('prompt-line');

function print(text) {
  var line = document.createElement('div');
  line.textContent = text;
  output.appendChild(line);
  window.scrollTo(0, document.body.scrollHeight);
}

setTimeout(function () {
  loading.style.display = 'none';
  screen.style.display = 'block';
  promptLine.style.display = 'flex';

  print('Welcome, Commander.');
  print('Type "help" to see the list of commands.');

  cmdInput.focus();
}, 2000);

var todos = JSON.parse(localStorage.getItem('todos') || '[]');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

async function runWeather(city) {
  if (!city) {
    print('Usage: weather <city name>');
    return;
  }

  print('Fetching weather...');

  try {
    var geoRes = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city));
    var geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      print('Could not find location: ' + city);
      return;
    }

    var lat = geoData.results[0].latitude;
    var lon = geoData.results[0].longitude;
    var placeName = geoData.results[0].name;

    var weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true');
    var weatherData = await weatherRes.json();
    var w = weatherData.current_weather;

    print('Weather in ' + placeName + ': ' + w.temperature + '°C, wind ' + w.windspeed + ' km/h.');
  } catch (err) {
    print('Something went wrong fetching the weather.');
  }
}

async function runApod() {
  print('Contacting NASA...');

  try {
    var key = import.meta.env.VITE_NASA_API_KEY;
    var res = await fetch('https://api.nasa.gov/planetary/apod?api_key=' + key);
    var data = await res.json();

    if (data.error) {
      print('NASA API error: ' + data.error.message);
      return;
    }

    print(data.title + ' (' + data.date + ')');
    print(data.explanation);

    if (data.media_type === 'image') {
      var img = document.createElement('img');
      img.src = data.url;
      img.style.maxWidth = '100%';
      img.style.border = '1px solid currentColor';
      img.style.marginTop = '8px';
      output.appendChild(img);
    } else {
      print('Video of the day: ' + data.url);
    }

    window.scrollTo(0, document.body.scrollHeight);
  } catch (err) {
    print('Could not fetch APOD. Check your API key in .env');
  }
}

var history = [];
var historyIndex = -1;

function handleCommand(fullText) {
  var trimmed = fullText.trim();
  if (trimmed === '') return;

  history.push(trimmed);
  historyIndex = history.length;

  var parts = trimmed.split(' ');
  var cmd = parts[0].toLowerCase();
  var args = parts.slice(1);

  if (cmd === 'help') {
    print('Available commands (do not include <> when typing):');
    print('  help - show this list');
    print('  clear - clear the screen');
    print('  about - about this project');
    print('  whoami - who you are');
    print('  search <query> - search Google');
    print('  weather <city> - get current weather');
    print('  apod - NASA photo of the day');
    print('  todo add <text> - add a todo');
    print('  todo list - show your todos');
    print('  todo remove <n> - remove a todo by number');
  } else if (cmd === 'clear') {
    output.innerHTML = '';
  } else if (cmd === 'about') {
    print('MISSION CONTROL - a hack club Stardance project.');
  } else if (cmd === 'whoami') {
    print('commander');
  } else if (cmd === 'search') {
    var query = args.join(' ');
    if (!query) {
      print('Usage: search <query>');
    } else {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
    }
  } else if (cmd === 'weather') {
    runWeather(args.join(' '));
  } else if (cmd === 'apod') {
    runApod();
  } else if (cmd === 'todo') {
    var action = args[0];
    var rest = args.slice(1);

    if (action === 'add') {
      var text = rest.join(' ');
      if (!text) {
        print('Usage: todo add <text>');
      } else {
        todos.push(text);
        saveTodos();
        print('Added: ' + text);
      }
    } else if (action === 'list') {
      if (todos.length === 0) {
        print('No todos yet.');
      } else {
        for (var i = 0; i < todos.length; i++) {
          print((i + 1) + '. ' + todos[i]);
        }
      }
    } else if (action === 'remove') {
      var index = parseInt(rest[0], 10) - 1;
      if (todos[index] === undefined) {
        print('Invalid todo number.');
      } else {
        var removedText = todos[index];
        todos.splice(index, 1);
        saveTodos();
        print('Removed: ' + removedText);
      }
    } else {
      print('Usage: todo add <text> | todo list | todo remove <n>');
    }
  } else {
    print('Command not found: ' + cmd + '. Type "help".');
  }
}

cmdInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    var value = cmdInput.value;
    print('commander@mission-control:~$ ' + value);
    cmdInput.value = '';
    handleCommand(value);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex = historyIndex - 1;
      cmdInput.value = history[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex = historyIndex + 1;
      cmdInput.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      cmdInput.value = '';
    }
  }
});