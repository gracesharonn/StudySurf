import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";

import LandingPage from '@/screens/landing'; 
import Home from '@/screens/home';
import QuizGenerator from '@/screens/quiz/QuizGenerator';
import OCRPage from '@/screens/ocr/OCRScanner'; // Add this import

import '@/index.css';

const paths = [
  {
    path: '/', 
    element: <LandingPage />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/quiz',
    element: <QuizGenerator />,
  },
  {
    path: '/ocr', 
    element: <OCRPage />,
  }
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  );
};

export default App;
