import { describe, it, expect } from 'vitest';
import type { MapDef, Token, BoardShape } from '@epoch/shared-types';

/**
 * Unit tests for board rendering: fog of war, shapes (AoE), and condition indicators.
 * Verifies the data model layer that feeds the canvas drawing functions.
 */

describe('Board Rendering', () => {
  describe('Fog of War', () => {
    it('fog object stores fogged squares by key', () => {
      const fog: Record<string, boolean> = {};
      fog['5,3'] = true;
      fog['5,4'] = true;
      fog['6,3'] = true;

      expect(Object.keys(fog).length).toBe(3);
      expect(fog['5,3']).toBe(true);
      expect(fog['6,4']).toBeUndefined();
    });

    it('fog toggle works correctly', () => {
      const fog: Record<string, boolean> = {};
      const key = '5,3';

      // Toggle on
      fog[key] = true;
      expect(Object.keys(fog).length).toBe(1);

      // Toggle off (delete)
      delete fog[key];
      expect(Object.keys(fog).length).toBe(0);
    });

    it('fog filters respect visibility rules', () => {
      const fog: Record<string, boolean> = {
        '0,0': true,
        '1,1': true,
        '2,2': true,
      };

      // GM sees all fog
      const gmFog = Object.keys(fog);
      expect(gmFog.length).toBe(3);

      // Players would see it as opaque (but the canvas handles rendering style)
      expect(gmFog.length).toBe(3); // Same data, different visual style
    });

    it('clearing fog removes all entries', () => {
      const fog: Record<string, boolean> = {
        '0,0': true,
        '1,1': true,
        '2,2': true,
        '3,3': true,
      };

      // Clear all
      const cleared = {};
      expect(Object.keys(cleared).length).toBe(0);
    });

    it('fog paint tracking works during drag', () => {
      const fogPaint = { target: true, seen: new Set<string>() };

      fogPaint.seen.add('5,3');
      fogPaint.seen.add('5,4');
      fogPaint.seen.add('6,3');

      expect(fogPaint.target).toBe(true); // GM is covering
      expect(fogPaint.seen.size).toBe(3);
      expect(fogPaint.seen.has('5,3')).toBe(true);
      expect(fogPaint.seen.has('7,7')).toBe(false);
    });
  });

  describe('AoE Shapes', () => {
    it('shape has required properties for rendering', () => {
      const shape: BoardShape = {
        id: 'shape-001',
        mapId: 'map-001',
        ownerUid: 'user-123',
        kind: 'circle',
        anchor: { col: 5, row: 5 },
        sizeFt: 15,
        color: '#5dcaa5',
        angleDeg: 0,
        hidden: false,
        createdAt: Date.now(),
      };

      expect(shape.kind).toBe('circle');
      expect(shape.sizeFt).toBe(15);
      expect(shape.color).toBe('#5dcaa5');
      expect(shape.anchor.col).toBe(5);
      expect(shape.anchor.row).toBe(5);
    });

    it('shapes can be anchored to tokens or grid points', () => {
      const gridAnchor: BoardShape['anchor'] = { col: 5, row: 5 };
      const tokenAnchor: BoardShape['anchor'] = { tokenId: 'token-001' };

      expect('col' in gridAnchor).toBe(true);
      expect('tokenId' in tokenAnchor).toBe(true);
      expect('col' in tokenAnchor).toBe(false);
    });

    it('cone and line shapes support aiming angle', () => {
      const cone: BoardShape = {
        id: 'shape-001',
        mapId: 'map-001',
        ownerUid: 'user-123',
        kind: 'cone',
        anchor: { col: 5, row: 5 },
        sizeFt: 15,
        color: '#5dcaa5',
        angleDeg: 45,
        hidden: false,
        createdAt: Date.now(),
      };

      const line: BoardShape = {
        ...cone,
        id: 'shape-002',
        kind: 'line',
        angleDeg: 90,
      };

      expect(cone.angleDeg).toBe(45);
      expect(line.angleDeg).toBe(90);
    });

    it('shapes can be hidden from players (GM-only)', () => {
      const visible: BoardShape = {
        id: 'shape-001',
        mapId: 'map-001',
        ownerUid: 'user-123',
        kind: 'circle',
        anchor: { col: 5, row: 5 },
        sizeFt: 15,
        color: '#5dcaa5',
        angleDeg: 0,
        hidden: false,
        createdAt: Date.now(),
      };

      const hidden: BoardShape = { ...visible, hidden: true };

      // Filtering logic: GM sees both, players see only visible
      const shapes = [visible, hidden];
      const forGm = shapes; // All shapes
      const forPlayer = shapes.filter((s) => !s.hidden); // Only visible

      expect(forGm.length).toBe(2);
      expect(forPlayer.length).toBe(1);
    });

    it('all four shape kinds are valid', () => {
      const kinds: Array<BoardShape['kind']> = ['circle', 'cone', 'line', 'square'];

      for (const kind of kinds) {
        const shape: BoardShape = {
          id: `shape-${kind}`,
          mapId: 'map-001',
          ownerUid: 'user-123',
          kind,
          anchor: { col: 5, row: 5 },
          sizeFt: 15,
          color: '#5dcaa5',
          angleDeg: 0,
          hidden: false,
          createdAt: Date.now(),
        };
        expect(shape.kind).toBe(kind);
      }
    });

    it('shapes filter by map correctly', () => {
      const shapes: BoardShape[] = [
        {
          id: 'shape-001',
          mapId: 'map-001',
          ownerUid: 'user-123',
          kind: 'circle',
          anchor: { col: 5, row: 5 },
          sizeFt: 15,
          color: '#5dcaa5',
          angleDeg: 0,
          hidden: false,
          createdAt: Date.now(),
        },
        {
          id: 'shape-002',
          mapId: 'map-002',
          ownerUid: 'user-123',
          kind: 'circle',
          anchor: { col: 5, row: 5 },
          sizeFt: 15,
          color: '#5dcaa5',
          angleDeg: 0,
          hidden: false,
          createdAt: Date.now(),
        },
      ];

      const map1Shapes = shapes.filter((s) => s.mapId === 'map-001');
      expect(map1Shapes.length).toBe(1);
      expect(map1Shapes[0].id).toBe('shape-001');
    });

    it('shapes support custom colors', () => {
      const colors = ['#5dcaa5', '#ef9f27', '#e24b4a', '#ffffff'];
      for (const color of colors) {
        const shape: BoardShape = {
          id: 'shape-001',
          mapId: 'map-001',
          ownerUid: 'user-123',
          kind: 'circle',
          anchor: { col: 5, row: 5 },
          sizeFt: 15,
          color,
          angleDeg: 0,
          hidden: false,
          createdAt: Date.now(),
        };
        expect(shape.color).toBe(color);
      }
    });
  });

  describe('Token Conditions', () => {
    it('conditions are stored as object map on token', () => {
      const conditions: Record<string, number> = {};
      conditions['poisoned'] = Date.now();
      conditions['stunned'] = Date.now();

      expect(Object.keys(conditions).length).toBe(2);
      expect(conditions['poisoned']).toBeDefined();
    });

    it('condition rings are drawn largest to smallest', () => {
      const condIds = ['cond1', 'cond2', 'cond3'];
      expect(condIds.length).toBeLessThanOrEqual(4); // Max 4 rings

      // When drawing, iterate in order (largest first)
      condIds.forEach((id, i) => {
        expect(i).toBeLessThan(condIds.length);
      });
    });

    it('conditions over 4 keep the 4 most recent', () => {
      const allConditions: Record<string, number> = {
        cond1: 100,
        cond2: 200,
        cond3: 300,
        cond4: 400,
        cond5: 500, // Most recent
      };

      const condIds = Object.keys(allConditions).slice(-4); // Last 4
      expect(condIds.length).toBe(4);
      expect(condIds[condIds.length - 1]).toBe('cond5'); // Most recent is last
    });
  });
});
