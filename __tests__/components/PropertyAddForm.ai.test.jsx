/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyAddForm from '@/components/PropertyAddForm';
import * as requests from '@/utils/requests';

jest.mock('@/utils/requests', () => ({
  generateAIPropertyContent: jest.fn(),
}));

describe('PropertyAddForm — AI generate description', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const clearLocation = async (user) => {
    await user.clear(screen.getByPlaceholderText('City'));
    await user.clear(screen.getByPlaceholderText('State'));
  };

  const fillMinimalLocation = async (user) => {
    await user.type(screen.getByPlaceholderText('City'), 'Columbus');
    await user.type(screen.getByPlaceholderText('State'), 'OH');
  };

  it('shows an error and does not call the API when location is empty', async () => {
    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await clearLocation(user);
    await user.click(
      screen.getByRole('button', { name: 'Generate listing with AI' })
    );

    expect(
      screen.getByText(/Add at least a city or state so the AI can tailor the copy\./)
    ).toBeInTheDocument();
    expect(requests.generateAIPropertyContent).not.toHaveBeenCalled();
  });

  it('fills Listing Name and Description on successful AI response', async () => {
    requests.generateAIPropertyContent.mockResolvedValue({
      data: {
        title: 'Sunny Downtown Flat',
        shortDescription: 'A bright and modern flat in the city center.',
      },
    });

    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await fillMinimalLocation(user);
    await user.click(
      screen.getByRole('button', { name: 'Generate listing with AI' })
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sunny Downtown Flat')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('A bright and modern flat in the city center.')
      ).toBeInTheDocument();
    });
  });

  it('shows an error message when the AI call fails', async () => {
    requests.generateAIPropertyContent.mockRejectedValue(
      new Error('AI provider request failed')
    );

    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await fillMinimalLocation(user);
    await user.click(
      screen.getByRole('button', { name: 'Generate listing with AI' })
    );

    await waitFor(() => {
      expect(screen.getByText('AI provider request failed')).toBeInTheDocument();
    });
  });

  it('clears the error when the user types in the rawNotes field', async () => {
    requests.generateAIPropertyContent.mockRejectedValue(
      new Error('AI provider request failed')
    );

    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await fillMinimalLocation(user);
    await user.click(
      screen.getByRole('button', { name: 'Generate listing with AI' })
    );
    await waitFor(() =>
      expect(screen.getByText('AI provider request failed')).toBeInTheDocument()
    );

    await user.type(
      screen.getByPlaceholderText(/Top floor, in-unit laundry/),
      'quiet street'
    );

    expect(screen.queryByText('AI provider request failed')).not.toBeInTheDocument();
  });

  it('disables the button and sets aria-busy while generation is in progress', async () => {
    let resolveAI;
    requests.generateAIPropertyContent.mockImplementation(
      () => new Promise((resolve) => { resolveAI = resolve; })
    );

    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await fillMinimalLocation(user);
    await user.click(
      screen.getByRole('button', { name: 'Generate listing with AI' })
    );

    const button = await screen.findByRole('button', { name: 'Generating...' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    resolveAI({ data: { title: 'T', shortDescription: 'D' } });
  });

  it('prevents duplicate clicks by keeping button disabled during generation', async () => {
    let resolveAI;
    requests.generateAIPropertyContent.mockImplementation(
      () => new Promise((resolve) => { resolveAI = resolve; })
    );

    const user = userEvent.setup();
    render(<PropertyAddForm />);

    await fillMinimalLocation(user);
    const button = screen.getByRole('button', {
      name: 'Generate listing with AI',
    });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(requests.generateAIPropertyContent).toHaveBeenCalledTimes(1);

    resolveAI({ data: { title: 'T', shortDescription: 'D' } });
  });
});
