# React MUI App

This is a React application built using Vite and the Material-UI (MUI) component library. The application features a navigation drawer and multiple pages, including a Home page, a Data Browser page, and an Other page.

## Project Structure

The project is organized as follows:

```
react-mui-app
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Drawer
│   │   │   └── AppDrawer.jsx
│   │   ├── DataGrid
│   │   │   └── DataGrid.jsx
│   │   └── Layout
│   │       └── Layout.jsx
│   ├── pages
│   │   ├── Home
│   │   │   └── Home.jsx
│   │   ├── DataBrowser
│   │   │   └── DataBrowser.jsx
│   │   └── Other
│   │       └── Other.jsx
│   ├── hooks
│   │   └── useTableData.js
│   ├── services
│   │   └── api.js
│   ├── utils
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Features

- **Home Page**: Displays introductory text.
- **Data Browser Page**: 
  - Combo box for selecting tables.
  - Input for account number with submit and clear buttons.
  - Radio options for selecting environment (Production, Development, Pre-prod).
  - Dropdown for selecting dates.
  - Data grid that populates records based on the selected table.
- **Other Page**: Displays an "Under construction" message.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd react-mui-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast build tool and development server.
- [Material-UI](https://mui.com/) - A popular React UI framework.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.