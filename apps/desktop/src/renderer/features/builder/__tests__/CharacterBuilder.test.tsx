import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterBuilder } from '../CharacterBuilder';
import { solrynSystem } from '@solryn/systems/solryn';

function renderBuilder() {
  render(
    <CharacterBuilder
      system={solrynSystem}
      gameId="g"
      ownerUserId="u"
      onFinish={async () => {}}
    />,
  );
  // Step past the welcome/orientation splash into the numbered flow.
  fireEvent.click(screen.getByRole('button', { name: /Begin/ }));
}

describe('CharacterBuilder (integration smoke)', () => {
  it('opens on a welcome splash (not a numbered step); Begin reveals step 1', () => {
    render(
      <CharacterBuilder
        system={solrynSystem}
        gameId="g"
        ownerUserId="u"
        onFinish={async () => {}}
      />,
    );

    // Welcome first: a heading, but no step counter and no Roll button yet.
    expect(
      screen.getByRole('heading', { name: /Create your character/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Step 1 of/)).toBeNull();
    expect(screen.queryByRole('button', { name: /^Roll/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Begin/ }));

    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();
  });

  it('starts on the roll step with Next gated, and enables it after all stats are rolled', () => {
    renderBuilder();

    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Next: Choose race/ }),
    ).toBeDisabled();

    // The per-stat "Roll NdM" button advances one stat at a time (sequential, anti-fishing).
    for (let i = 0; i < solrynSystem.coreStats.length; i++) {
      fireEvent.click(screen.getByRole('button', { name: /^Roll \d/ }));
    }

    expect(
      screen.getByRole('button', { name: /Next: Choose race/ }),
    ).toBeEnabled();
    // No reroll: once all are rolled, no Roll buttons remain.
    expect(screen.queryByRole('button', { name: /^Roll/ })).toBeNull();
  });

  it('"Roll all stats" rolls every stat at once and enables Next', () => {
    renderBuilder();

    fireEvent.click(screen.getByRole('button', { name: /Roll all stats/ }));

    expect(
      screen.getByRole('button', { name: /Next: Choose race/ }),
    ).toBeEnabled();
    // Everything is locked in one click — no per-stat or roll-all buttons remain.
    expect(screen.queryByRole('button', { name: /^Roll/ })).toBeNull();
  });
});
