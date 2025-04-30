import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from "vitest";
import { MemoryRouter } from 'react-router-dom';
import WelcomeHeader from "../components/WelcomeHeader";
import LogoutButton from "../components/LogoutButton";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import GameListing from "../components/GameListing";
import CreateGameForm from '../components/CreateGameForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-toastify', () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    }
  };
});

describe("WelcomeHeader component test", () => {
  beforeEach(() => {
    render(<WelcomeHeader />);
  });

  it("renders without crashing", () => {
    // already rendered
  });

  it("displays the <h1> heading", () => {
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome to your Dashboard 🎯');
  });

  it("displays the <p> text", () => {
    expect(screen.getByText(/This is your central hub to manage quizzes/i)).toBeInTheDocument();
  });
});

describe("LogoutButton component test", () => {
  it("renders with the correct text", () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /Log out/i })).toBeInTheDocument();
  });

  it("calls onClick function when clicked", () => {
    const onClick = vi.fn();
    render(<LogoutButton onClick={onClick} />);
    const button = screen.getByRole('button', { name: /Log out/i });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("LoginForm component test", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders email + password fields", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPW@' } });

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@gmail.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('testPW@');
  });

  it("redirects to dashboard after login", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'mock-token' }),
      })
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'zohomata12@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testing' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it("shows toast error during unsuccessful login", async () => {
    const toast = (await import('react-toastify')).toast;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid username or password' }),
      })
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid username or password');
    });
  });
});

describe("RegisterForm component test", () => {

  beforeEach(() => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders all input fields and register button', () => {
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@gmail.com');
    expect(screen.getByLabelText(/^Password$/i)).toHaveValue('password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue('password');
  });


  it('shows error toast when passwords do not match', async () => {
    const toast = (await import('react-toastify')).toast;

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'wrong123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match!');
    });
  });

  it('navigates to dashboard after successful registration', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'mockToken' }),
      })
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Tester' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast when registration fails from backend', async () => {
    const toast = (await import('react-toastify')).toast;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already exists' }),
      })
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'duplicate@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });
});

const baseGame = {
  id: 102693806,
  name: 'Game blah',
  createdAt: '2025-04-22T00:00:00.000Z',
  thumbnail: null,
  questions: [
    { duration: 10, text: 'Q1' }
  ],
  active: 0
};
const activeGame = { ...baseGame, active: 1 };


const mockAlterGameSession = vi.fn();
const mockAlterPopup = vi.fn();
const mockAdvance = vi.fn();
const mockGetSessionDetails = vi.fn(() => Promise.resolve({ results: { players: [] } }));

describe("GameListing component test during inactive game", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <GameListing
          game={baseGame}
          alterGameSession={mockAlterGameSession}
          alterPopup={mockAlterPopup}
          advance={mockAdvance}
          getSessionDetails={mockGetSessionDetails}
        />
      </MemoryRouter>
    );
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders basic info in inactive state', () => {
    expect(screen.getByRole('heading', { level: 4, name: /game blah/i })).toBeInTheDocument();
    expect(screen.getByText(/ID: 102693806/i)).toBeInTheDocument();
    expect(screen.getByText('Created: 4/22/2025')).toBeInTheDocument();
    expect(screen.getByText(/Questions: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Quiz Duration: 10 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Inactive/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Game Details/i })).toBeInTheDocument();
  })

  it('calls alterGameSession with "START" on start button click', () => {
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }));
    expect(mockAlterGameSession).toHaveBeenCalledWith(102693806, 'START');
  });
});

describe("GameListing component test during active game", () => {

  beforeEach(() => {
    render(
      <MemoryRouter>
        <GameListing
          game={activeGame}
          alterGameSession={mockAlterGameSession}
          alterPopup={mockAlterPopup}
          advance={mockAdvance}
          getSessionDetails={mockGetSessionDetails}
        />
      </MemoryRouter>
    );
    vi.clearAllMocks();
    localStorage.clear();
  })

  it('renders active state buttons and status', () => {
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
    expect(screen.getByText('Session Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Advance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /End Game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Session Details/i })).toBeInTheDocument();
  });


  it('calls alterPopup when Session Details is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /Session Details/i }));
    expect(mockAlterPopup).toHaveBeenCalledWith(true);
  });
});

const mockHandleGameAdd = vi.fn(() => Promise.resolve());
const mockOnClose = vi.fn();

describe("CreateGameForm component test", () => {
  beforeEach(() => {
    render(
      <CreateGameForm 
        onClose={mockOnClose} 
        games={[]} 
        handleGameAdd={mockHandleGameAdd} 
      />
    );
    vi.clearAllMocks();
    localStorage.setItem('email', 'test@email.com');
  });

  it('renders form fields and buttons correctly', () => {
    expect(screen.getByText(/Create New Game/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Thumbnail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'My Game' } });
    fireEvent.change(screen.getByLabelText(/Question 1/i), { target: { value: 'What is 2 + 2?' } });
    fireEvent.change(screen.getByLabelText(/Answer/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Points/i), { target: { value: '5' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(mockHandleGameAdd).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('adds and removes a question correctly', () => {
    fireEvent.click(screen.getByText(/Add Question/i));
    expect(screen.getByText(/Question 2/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Remove Last Question/i));
    expect(screen.queryByText(/Question 2/i)).not.toBeInTheDocument();
  });

  it('switches to multiple choice and adds options', () => {
    fireEvent.click(screen.getByLabelText(/Multiple Choice/i));

    expect(screen.getByPlaceholderText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 2/i)).toBeInTheDocument();
  });

  it('adds additional option for choice-based question', () => {
    fireEvent.click(screen.getByLabelText(/Single Choice/i));
    fireEvent.click(screen.getByText(/Add Option/i));

    expect(screen.getByPlaceholderText(/Option 3/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});