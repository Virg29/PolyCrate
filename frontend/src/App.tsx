import AppRouter from './AppRouter';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
	return (
		<ThemeProvider>
			<AppRouter />
		</ThemeProvider>
	);
};

export default App;
