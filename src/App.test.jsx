import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should show start screen initially', () => {
    render(<App />);
    expect(screen.getByText('Gobang')).toBeDefined();
    expect(screen.getByTestId('player-name-input')).toBeDefined();
    expect(screen.getByTestId('ai-mode-button')).toBeDefined();
    expect(screen.getByTestId('human-mode-button')).toBeDefined();
  });

  it('should show start button only when name and mode are selected', () => {
    render(<App />);
    
    // Initially, start button should not be visible
    expect(screen.queryByTestId('start-game-button')).toBeNull();
    
    // Enter player name
    const nameInput = screen.getByTestId('player-name-input');
    fireEvent.change(nameInput, { target: { value: 'Player 1' } });
    
    // Select game mode
    const aiButton = screen.getByTestId('ai-mode-button');
    fireEvent.click(aiButton);
    
    // Now start button should be visible
    expect(screen.getByTestId('start-game-button')).toBeDefined();
  });
});
