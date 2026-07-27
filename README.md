# Mission Control

Mission Control is a retro terminal-style personal website built with **HTML**, **CSS**, **vanilla JavaScript**, and **Vite**.

Instead of clicking through a traditional website, you interact with everything by typing commands into a fake terminal.

## Features

- Retro terminal interface
- Live weather using the Open-Meteo API
- NASA Astronomy Picture of the Day
- Web search command
- Persistent todo list using localStorage
- Command history with arrow keys

## Available Commands

- `help`
- `clear`
- `about`
- `whoami`
- `search <query>`
- `weather <city>`
- `apod`
- `todo add <task>`
- `todo list`
- `todo remove <number>`

## Getting Started

1. Clone the repository.
2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file and add your NASA API key.

```env
VITE_NASA_API_KEY=your_api_key_here
```

4. Start the development server.

```bash
npm run dev
```

5. Open the local URL shown in your terminal.

## Tech Stack

- HTML
- CSS
- JavaScript
- Vite
- Open-Meteo API
- NASA APOD API

## License

This project was built for **Hack Club Stardance**.