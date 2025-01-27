import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            game: {
                title: "Gobang",
                yourNickname: "Your nickname",
                yourColor: "Your color",
                opponent: "Opponent",
                chooseOpponent: "Choose...",
                humanPlayer: "Human player",
                ai: "AI",
                startGame: "Start game",
                newGame: "New game",
                turn: "{{playerName}}'s turn",
                winner: "{{playerName}} won!",
                player2: "Player 2"
            },
            colorSelection: {
                label: "Color selection"
            }
        }
    },
    fr: {
        translation: {
            game: {
                title: "Gobang",
                yourNickname: "Votre pseudo",
                yourColor: "Votre couleur",
                opponent: "Adversaire",
                chooseOpponent: "Choisir...",
                humanPlayer: "Joueur humain",
                ai: "IA",
                startGame: "Commencer la partie",
                newGame: "Nouvelle partie",
                turn: "Au tour de {{playerName}}",
                winner: "{{playerName}} a gagné !",
                player2: "Joueur 2"
            },
            colorSelection: {
                label: "Sélection de la couleur"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
