import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceTracker } from '../ResourceTracker';

describe('ResourceTracker', () => {
  it('applies + and − by the typed amount, clamped to 0–max', () => {
    const onChange = vi.fn();
    render(
      <ResourceTracker label="HP" current={5} max={8} onChange={onChange} />,
    );

    fireEvent.click(screen.getByLabelText(/Increase HP/));
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.click(screen.getByLabelText(/Reduce HP/));
    expect(onChange).toHaveBeenLastCalledWith(4);

    // Big amount clamps to the bounds.
    fireEvent.change(screen.getByLabelText('HP amount'), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByLabelText(/Increase HP/));
    expect(onChange).toHaveBeenLastCalledWith(8);
    fireEvent.click(screen.getByLabelText(/Reduce HP/));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('disables controls for an empty pool (0/0, e.g. non-caster Arcana)', () => {
    render(
      <ResourceTracker label="Arcana" current={0} max={0} onChange={vi.fn()} />,
    );
    expect(screen.getByLabelText(/Increase Arcana/)).toBeDisabled();
    expect(screen.getByLabelText(/Reduce Arcana/)).toBeDisabled();
  });
});
