/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { createMockToolContext } from '@devtools/core/testing';
import { Component } from '../src/component.tsx';

describe('Component', () => {
  it('renders without crashing', () => {
    const ctx = createMockToolContext();
    render(<Component ctx={ctx} />);
    expect(screen.getByText('Tool Name')).toBeDefined();
  });
});
